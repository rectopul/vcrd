const Client = require('../models/Client')
const Contact = require('../models/Contact')
const Address = require('../models/Address')
const Property = require('../models/Property')
const PropertyAddress = require('../models/PropertyAddress')
const PropertyFeature = require('../models/PropertyFeature')
const PropertyInformation = require('../models/PropertyInformation')
const PropertyValue = require('../models/PropertyValue')
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

    async search(req, res) {
        try {
            const authHeader = req.headers.authorization

            if (!authHeader) return res.status(401).send({ error: 'No token provided' })

            await UserByToken(authHeader)

            const { args } = req.params

            const property = await Property.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${args}%`,
                            },
                        },
                        {
                            description: {
                                [Op.like]: `%${args}%`,
                            },
                        },
                        {
                            property_is: {
                                [Op.like]: `%${args}%`,
                            },
                        },
                    ],
                },
            })

            return res.json(property)
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

            console.log(`Erro ao buscar imóvel: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async single(req, res) {
        const authHeader = req.headers.authorization

        if (!authHeader) return res.status(401).send({ error: 'No token provided' })

        await UserByToken(authHeader)

        const { property_id } = req.params

        const property = await Property.findByPk(property_id, {
            include: [
                { association: 'address' },
                { association: 'feature' },
                { association: 'information' },
                { association: 'value' },
            ],
        })

        if (!property) {
            return res.status(401).json({ message: 'Property not found' })
        }

        return res.json(property)
    },

    async store(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const typesAccept = ['proprietário', 'fiador', 'inquilino']

            if (Object.keys(req.body).length === 0)
                return res.status(400).send({ error: `Por favor envie as infomações` })

            await UserByToken(authHeader)

            //property

            const { name, description, type, tradingType, propertyIs } = req.body

            var property = await Property.create({ name, description, type, tradingType, propertyIs })

            const property_id = property.id

            //property_addresses

            const { street, address, city, state, complement, walk, referencePoint } = req.body

            var property_address = await PropertyAddress.create({
                property_id,
                street,
                address,
                city,
                state,
                complement: complement || null,
                walk,
                referencePoint,
            })

            //property_features

            const { bedrooms, suites, demiSuites, bathrooms, toilet, jobs, flooring, furnished } = req.body

            var feature = await PropertyFeature.create({
                property_id,
                bedrooms: parseInt(bedrooms),
                suites: suites || 0,
                demiSuites: demiSuites || 0,
                bathrooms: parseInt(bathrooms) || 0,
                toilet: toilet || 0,
                jobs: jobs | 0,
                flooring: flooring || 0,
                furnished,
            })

            //property_information

            const { keysAreWith, visitingHours, keyNumber, liquidator, liquidatorPhone, other } = req.body

            var information = await PropertyInformation.create({
                property_id,
                keysAreWith,
                visitingHours: visitingHours || null,
                keyNumber: keyNumber || null,
                liquidator: liquidator || null,
                liquidatorPhone: liquidatorPhone || null,
                other: other || null,
            })

            //property_values

            const { iptu, condominium, water, energy, trash, cleaningFee, othersValues } = req.body

            console.log(parseFloat(water.replace('R$ ', '')), parseInt(bedrooms))

            var values = await PropertyValue.create({
                property_id,
                iptu: parseFloat(iptu.replace('R$ ', '')),
                condominium: parseFloat(condominium.replace('R$ ', '')) || null,
                water: parseFloat(water.replace('R$ ', '')) || null,
                energy: parseFloat(energy.replace('R$ ', '')) || null,
                trash: parseFloat(trash.replace('R$ ', '')) || null,
                cleaningFee: parseFloat(cleaningFee.replace('R$ ', '')) || null,
                others: parseFloat(othersValues) || null,
            })

            return res.json({ property, property_address, feature, information, values })
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

            console.log(`Erro ao criar novo imóvel: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        } finally {
            if (!property_address || !feature || !information || !values) await property.destroy()
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
