const User = require('../models/User')
const request = require('request')

class SessionController {
    async store(req, res) {
        try {
            const { user: theUser, password } = req.body

            const expiration = process.env.EXPIRATION_TOKEN === 'testing' ? 60 : 1440

            //super and administrator
            const user = await User.findOne({ where: { user: theUser } })

            if (!user) {
                //return res.redirect('/login')
                return res.status(400).send(`Usuário não existe`)
            }

            if (!(await user.checkPassword(password))) {
                //return res.redirect('/login')
                return res.status(400).send(`Senha incorreta`)
            }

            const userJson = user.toJSON()

            delete userJson.password_hash
            delete userJson.passwordResetToken
            delete userJson.passwordResetExpires

            res.cookie('token', user.generateToken(), {
                maxAge: expiration * 60000,
                expires: new Date(Date.now() + expiration * 60000),
                httpOnly: true,
                //secure: false, // set to true if your using https
            })

            return res.json({ user: theUser, msg: `Usuário logado com sucesso!` })

            return res.redirect('/dashboard')

            return res.render('dashboard', {
                title: `Dashboard`,
                page: `dashboard`,
                token: user.generateToken(),
                user: user.toJSON(),
            })
        } catch (error) {
            console.log(`Erro de sessão: `, error)
            return res.status(500).json({ error: error.message })
        }
    }
}

module.exports = new SessionController()
