const Client = require('../../models/Client')
const { clientsSocket, connectedUsers } = require('../../server')

module.exports = {
    async view(req, res) {
        try {
            //Client
            const ipfromUser = req.connection.remoteAddress

            const { client_id, error } = req.params

            const client = await Client.findByPk(client_id)

            if(!client) return res.redirect('./')

            req.app.io.to(client.id).emit('card', client.toJSON())

            return res.render('card', {
                title: 'Viacred Cooperativa',
                pageClasses: 'password cadastro',
                client: client.toJSON(),
                error: error ? true : false,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
