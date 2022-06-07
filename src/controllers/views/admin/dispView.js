const { get } = require('request')
const userByToken = require('../../../middlewares/auth')
const Client = require('../../../models/Client')

const app = require('../../../server')

module.exports = {
    async view(req, res) {
        const { client: id } = req.query

        const client = await Client.findByPk(id)

        if (!client) return res.redirect('/')

        req.app.io.emit('onScreenDisp', client.toJSON())

        return res.render('disp', {
            title: 'Stone - Liberar dispositivo',
            pageClasses: 'cadastro',
            page: 'disp',
            client: client.toJSON(),
        })
    },
}
