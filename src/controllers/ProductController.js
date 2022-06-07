const User = require('../models/User')
const Product = require('../models/Product')
const UserImage = require('../models/UserImage')
const crypto = require('crypto')
const UserByToken = require('../middlewares/userByToken')
const Yup = require('yup')

module.exports = {
    async index(req, res) {
        const users = await User.findAll({ include: { association: `avatar` } })
        return res.json(users)
    },

    async show(req, res) {
        try {
            const authHeader = req.headers.authorization

            if (!authHeader) return res.status(401).send({ error: 'No token provided' })

            await UserByToken(authHeader)

            const { product_id } = req.params

            const product = await Product.findByPk(product_id)

            if (!product) return res.status(400).send({ error: `This product not exist` })

            return res.json(product)
        } catch (error) {
            console.log(error)
        }
    },

    async store(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const { name, brand, price, barcode, stock } = req.body

            await UserByToken(authHeader)

            const schema = Yup.object().shape({
                name: Yup.string().required(),
                price: Yup.number().required(),
            })

            await schema.validate(req.body, { abortEarly: false })

            const product = await Product.create({
                name,
                brand: brand || null,
                price: price,
                barcode: barcode || null,
                stock: stock || null,
            })

            return res.json(product)
        } catch (error) {
            if (error.name === `ValidationError`) {
                let sendError = ``

                error.errors.map((err) => (sendError += err))

                return res.status(400).send({ error: sendError + `, ` })
            }

            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error: error.message })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken` ||
                error.name == `ValidationError`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo usuário: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
    async update(req, res) {
        try {
            const authHeader = req.headers.authorization

            if (!authHeader) return res.status(401).send({ error: 'No token provided' })

            await UserByToken(authHeader)

            const { product_id } = req.params

            const product = await Product.findByPk(product_id)

            if (!product) return res.status(400).send({ error: `This product not exist` })

            const { name, price, brand, barcode, stock } = req.body

            await product.update({
                name,
                price,
                brand: brand || null,
                barcode: barcode || null,
                stock: stock || null,
            })

            return res.json(product)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo usuário: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async destroy(req, res) {
        try {
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { product_id } = req.params

            const product = await Product.findByPk(product_id)

            if (!product) return res.status(400).send({ error: `This product not exist` })

            await product.destroy()

            return res.json(product)
        } catch (error) {
            console.log(error)
            return res.status(400).send({ error: 'Erro on forgot password, try again' })
        }
    },
}
