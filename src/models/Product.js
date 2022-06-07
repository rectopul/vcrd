'use strict'
const { DataTypes, Model, Sequelize } = require('sequelize')

class Product extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The name field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The name field cannot be empty`,
                        },
                    },
                },
                brand: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The brand field cannot be empty`,
                        },
                    },
                },
                price: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The price field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The price field cannot be empty`,
                        },
                        isDecimal: {
                            msg: `The Price field is a Decimal number`,
                        },
                    },
                },
                barcode: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The Barcode field cannot be empty`,
                        },
                    },
                },
                stock: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: `The stock field cannot be empty`,
                        },
                        isInt: {
                            msg: `The stock field is a Integer number`,
                        },
                    },
                },
            },
            {
                sequelize,
            }
        )
    }

    static associate(models) {
        //Relations
        this.hasOne(models.ImageProduct, { foreignKey: 'product_id', as: 'image' })
    }
}
module.exports = Product
