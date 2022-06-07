const userByToken = require('../../middlewares/auth')
const User = require('../../models/User')
const Client = require('../../models/Client')

module.exports = {
    async view(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await userByToken(token)

            const { client: client_id } = req.query

            const client = await Client.findByPk(client_id)

            //userName

            const user = await User.findByPk(user_id)

            return res.render('admin/operator', {
                title: `CEF | OPERATOR`,
                page: `dashboard`,
                token,
                user: user.toJSON(),
                client: client.toJSON(),
                operator: true,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
