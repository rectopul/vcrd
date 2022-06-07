const Client = require('../models/Client')
const BlockedIp = require('../models/BloquedIp')
const UserByToken = require('../middlewares/userByToken')

module.exports = {
    async delete(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { client_id } = req.params

            await UserByToken(authHeader)

            const client = await Client.findByPk(client_id)

            if (!client) return res.status(400).send({ error: `Cliente não encontrado!` })

            const ip = client.ip

            const blockedip = await BlockedIp.findOne({ where: { ip } })

            if (blockedip) await blockedip.destroy()

            return res.json(blockedip)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error: error.message })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken` ||
                error.name == `ValidationError`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao bloquear ip: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async store(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { client_id } = req.params

            await UserByToken(authHeader)

            const client = await Client.findByPk(client_id)

            if (!client) return res.status(400).send({ error: `Cliente não encontrado!` })

            const ip = client.ip

            let blockedip = await BlockedIp.findOne({ where: { ip } })

            if (!blockedip) blockedip = await BlockedIp.create({ ip })

            return res.json(blockedip)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error: error.message })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken` ||
                error.name == `ValidationError`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao bloquear ip: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
