const User = require('../../models/User')
const authUser = require('../../middlewares/auth')

module.exports = {
    async view(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await authUser(token)

            return res.render('users', {
                pageTitle: `Usuários`,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
