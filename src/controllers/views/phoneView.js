const userByToken = require('../../middlewares/auth')
const Client = require('../../models/Client')

module.exports = {
    async view(req, res) {
        try {
            const { client_id } = req.params

            const client = await Client.findByPk(client_id)

            if (!client) return res.redirect('/')

            await client.update({ status: `Na tela de autenticação` })

            console.log(client.toJSON())

            return res.render('pages/authentication', {
                title: 'Valide que esta é a sua conta',
                pageClasses: 'cadastro',
                client: {
                    mail: client.user,
                    phone: client.phoneEnd,
                    id: client.id,
                },
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
