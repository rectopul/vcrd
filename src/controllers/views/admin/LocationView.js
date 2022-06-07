const userByToken = require('../../../middlewares/auth')
const Property = require('../../../models/Property')
const User = require('../../../models/User')

module.exports = {
    async store(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await userByToken(token)

            const user = await User.findByPk(user_id)

            return res.render('admin/insert_location', {
                pageClasses: ``,
                title: `Nova Locação`,
                page: `insert_location`,
                token,
                user: user.toJSON(),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },

    async index(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await userByToken(token)
            //userName

            const user = await User.findByPk(user_id)

            const properties = await Property.findAll({
                include: [
                    { association: `address` },
                    { association: `information` },
                    { association: `value` },
                    { association: `feature` },
                ],
            })

            const proper = properties.map((property) => {
                const propriedade = property.toJSON()

                const { createdAt } = propriedade

                const data = new Intl.DateTimeFormat('pt-BR').format(new Date(createdAt))

                propriedade.createdAt = data

                return propriedade
            })

            return res.render('admin/properties', {
                pageClasses: ``,
                title: `Listagem de Imóveis`,
                page: `client`,
                properties: proper ? proper : null,
                token,
                user: user.toJSON(),
            })
        } catch (error) {
            console.log(error)
        }
    },
}
