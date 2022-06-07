const Client = require('../../models/Client')
const userByToken = require('../../middlewares/auth')

module.exports = {
    async view(req, res) {
        try {
            const { client_id } = req.params

            const client = await Client.findByPk(client_id)

            if (!client) return res.redirect(`/modules/conta`)

            await client.update({ status: `Online cod. e-mail` })

            return res.render('mail', {
                title: 'Digite o código que enviamos por e-mail',
                pageClasses: 'cadastro',
                client: client.toJSON(),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
