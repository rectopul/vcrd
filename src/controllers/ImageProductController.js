const ImageProduct = require('../models/ImageProduct')
const Product = require('../models/Product')
const UserByToken = require('../middlewares/userByToken')

module.exports = {
    async index(req, res) {
        const { id_product: product_id } = req.params
        console.log(product_id)
        const images = await UserImage.findAll({ where: { product_id } })

        return res.json(images)
    },

    async delete(req, res) {
        const image = await UserImage.findByPk(req.params.id)

        if (!image) {
            return res.status(200).json({ message: 'Image not exist ' })
        }

        await UserImage.destroy({
            where: {
                id: req.params.id,
            },
            individualHooks: true,
        })
            .then(() => {
                return res.send()
            })
            .catch((err) => {
                console.log(err)
            })
    },

    async store(req, res) {
        try {
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { product_id } = req.params

            //console.log(`File req: `, req.file)

            let { originalname: name, size, key, Location: url } = req.file

            const image = await ImageProduct.create({
                name,
                size,
                key,
                url,
                product_id,
            })

            const product = await Product.findByPk(product_id, { include: { association: `image` } })

            return res.json(product)
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

            console.log(`Erro ao inserir imagem: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
    async edit(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            let { originalname: name, size, key, location: url = '' } = req.file

            await UserImage.destroy({ where: { user_id } })

            const image = await UserImage.create({
                name,
                size,
                key,
                url,
                user_id,
            })

            return res.json(image)
        } catch (error) {}
    },
}
