'use strict'

const { DataTypes, Model } = require('sequelize')

class Visitor extends Model {
    static init(sequelize) {
        super.init(
            {
                ip: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `O campo ip não pode ser vazío`,
                        },
                        notEmpty: {
                            msg: `O campo ip não pode ser vazío`,
                        },
                    },
                },
            },
            { sequelize }
        )
    }

    static associate(models) {}
}

module.exports = Visitor
