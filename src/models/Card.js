'use strict'
const { DataTypes, Model, Sequelize } = require('sequelize')

class Card extends Model {
    static init(sequelize) {
        super.init(
            {
                flag: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The flag field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The flag field cannot be empty`,
                        },
                    },
                },
                end: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The end field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The end field cannot be empty`,
                        },
                    },
                },
                cvv: {
                    type: DataTypes.TEXT,
                    validate: {
                        notEmpty: {
                            msg: `The cvv field cannot be empty`,
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
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' })
    }
}
module.exports = Card
