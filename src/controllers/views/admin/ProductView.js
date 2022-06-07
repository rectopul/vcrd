const userByToken = require('../../../middlewares/auth')
const Client = require('../../../models/Client')
const User = require('../../../models/User')
const Product = require('../../../models/Product')

module.exports = {
    async view(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await userByToken(token)

            const user = await User.findByPk(user_id)

            return res.render('admin/client', {
                pageClasses: ``,
                title: `Cadastro de cliente`,
                page: `client`,
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

            const products = await Product.findAll({ include: { association: `image` } })

            return res.render('admin/products', {
                pageClasses: ``,
                title: `Listagem de Produtos`,
                page: `products`,
                products: products ? products.map((product) => product.toJSON()) : null,
                token,
                user: user.toJSON(),
            })
        } catch (error) {
            console.log(error)
        }
    },
}
