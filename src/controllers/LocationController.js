const Client = require('../models/Client')
const Location = require('../models/Location')
const Property = require('../models/Property')
const UserByToken = require('../middlewares/userByToken')
const { Op } = require('sequelize')

module.exports = {
    async index(req, res) {
        try {
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const clients = await Client.findAll({ include: [{ association: 'address' }, { association: 'contact' }] })

            return res.json(clients)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao buscar clientes: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async single(req, res) {
        const authHeader = req.headers.authorization

        if (!authHeader) return res.status(401).send({ error: 'No token provided' })

        await UserByToken(authHeader)

        const { client_id } = req.params

        const client = await Client.findByPk(client_id, {
            include: [{ association: 'address' }, { association: 'contact' }],
        })

        if (!client) {
            return res.status(401).json({ message: 'client not found' })
        }

        return res.json(client)
    },
    async search(req, res) {
        try {
            const authHeader = req.headers.authorization

            if (!authHeader) return res.status(401).send({ error: 'No token provided' })

            await UserByToken(authHeader)

            const { args } = req.params

            const { type } = req.query

            const client = await Client.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${args}%`,
                            },
                            type: {
                                [Op.eq]: type,
                            },
                        },
                        {
                            note: {
                                [Op.like]: `%${args}%`,
                            },
                            type: {
                                [Op.eq]: type,
                            },
                        },
                    ],
                },
            })

            return res.json(client)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({
                    error: error.message.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/(Validation error: )/g, ''),
                })

            console.log(`Erro ao buscar cliente: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async store(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            if (Object.keys(req.body).length === 0)
                return res.status(400).send({ error: `Por favor envie as infomações` })

            await UserByToken(authHeader)

            //Client

            const {
                admFeeType: administrationFeeType,
                administrationFee,
                bailApolice,
                bailEnd,
                bailObservation,
                bailStart,
                bailValue,
                calcaoValue,
                capitalizationApolice,
                capitalizationEnd,
                capitalizationObservation,
                capitalizationStart,
                capitalizationValue,
                guarantor: clientGuarantor,
                locationEnd,
                locationGuarantee,
                locationStart,
                locationTime,
                locationType,
                locationValue,
                occupant: clientOccupant,
                owner: clientOwner,
                participation,
                paymentType,
                property: propertyName,
            } = req.body

            //owner

            const owner = await Client.findOne({ where: { name: clientOwner } })

            if (!owner) return res.status(401).json({ error: 'owner not exist' })

            //occupant
            const occupant = await Client.findOne({ where: { name: clientOccupant } })

            if (!occupant) return res.status(401).json({ error: 'occupant not exist' })

            //property
            const property = await Property.findOne({ where: { name: propertyName } })

            if (!property) return res.status(401).json({ error: 'this property not exist not exist' })

            //check type
            const paymentTypes = [
                'Boleto',
                'Cheque de terceiros',
                'Cheque Próprio',
                'Debito',
                'Deposito',
                'Saque',
                'DOC',
                'TED',
            ]
            if (paymentTypes.indexOf(paymentType) === -1)
                return res.status(401).json({ error: 'Payment Type not accepted' })

            //Check location types
            const locationTypes = ['residencial', 'comercial', 'residencial/comercial', 'industrial', 'escritório']

            if (locationTypes.indexOf(locationType) === -1)
                return res.status(401).json({ error: 'Location Type not accepted' })

            //Check fee type
            const feeTypes = ['%', 'R$']
            if (feeTypes.indexOf(administrationFeeType) === -1)
                return res.status(401).json({ error: 'This Fee Type not accepted' })

            //Check guarantee`s
            //check if guarantor exist
            const guarantor = await Client.findOne({ where: { name: clientGuarantor } })

            if (locationGuarantee && locationGuarantee == `Fiador`) {
                if (!clientGuarantor) return res.status(400).send({ error: `Please inform the guarantor` })
                if (!guarantor) return res.status(400).send({ error: `This guarantor not exist` })
            }
            //Calção
            else if (`Caução` == locationGuarantee) {
                if (!calcaoValue) return res.status(400).send({ error: `Please inform the calcaoValue` })
            }
            //Fiança
            else if (`Fiança` == locationGuarantee) {
                if (!bailValue || !bailStart || !bailEnd || !bailApolice)
                    return res
                        .status(400)
                        .send({ error: `Please inform bailValue, bailStart, bailEnd and bailApolice` })
            }
            //Capitalização
            else if (`capitalização` == locationGuarantee) {
                if (!capitalizationValue || !capitalizationStart || !capitalizationEnd || !capitalizationApolice)
                    return res.status(400).send({
                        error: `Please inform capitalizationValue, capitalizationStart, capitalizationEnd and capitalizationApolice`,
                    })
            }
            //Create location

            //console.log(`Bail Value: `, parseFloat(bailValue.replace(`R$`, '')))

            const location = await Location.create({
                property_id: property.id,
                occupant_id: occupant.id,
                owner_id: owner.id,
                locationType,
                participation,
                paymentType,
                locationValue,
                locationStart,
                locationTime,
                locationEnd,
                administrationFeeType,
                administrationFee,
                locationGuarantee,
                guarantor_id: guarantor ? guarantor.id : null,
                calcaoValue: calcaoValue || null,
                bailValue: parseFloat(bailValue.replace(`R$`, '')) || null,
                bailApolice: bailApolice || null,
                bailEnd: bailEnd || null,
                bailObservation: bailObservation || null,
                bailStart: bailStart || null,
                capitalizationApolice: capitalizationApolice || null,
                capitalizationEnd: capitalizationEnd || null,
                capitalizationObservation: capitalizationObservation || null,
                capitalizationStart: capitalizationStart || null,
                capitalizationValue: parseFloat(capitalizationValue.replace(`R$`, '')) || null,
            })

            return res.json(location)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar nova locação: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async update(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            if (Object.keys(req.body).length === 0)
                return res.status(400).send({ error: `Por favor envie as infomações` })

            const { name, cpf, rg, gender, nationality, marital, birth_date: birthDate, type, note } = req.body

            await UserByToken(authHeader)

            const { client_id } = req.params

            const client = await Client.findByPk(client_id)

            if (!client) return res.status(400).send({ error: `client not found` })

            await client.update({
                name,
                cpf,
                rg,
                gender,
                nationality,
                marital,
                birthDate,
                type,
                note,
            })

            //Address

            const address = await Address.findOne({ where: { client_id: client.id } })

            const { street, address: location, city, state, zipCode } = req.body

            await address.update({
                street,
                address: location,
                city,
                state,
                zipCode,
            })

            //Contact

            const contact = await Contact.findOne({ where: { client_id: client.id } })

            const { cell, phone, other, email } = req.body

            await contact.update({
                cell,
                email,
                phone,
                other,
            })

            return res.json(client)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao atualizar cliente: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async destroy(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { client_id } = req.params

            const client = await Client.findByPk(client_id)

            if (!client) return res.status(400).send({ error: `client not found` })

            client.destroy()

            return res.json(client)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao excluir cliente: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
