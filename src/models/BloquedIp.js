'use strict'

const { DataTypes, Model } = require('sequelize')
class BlockedIp extends Model {
    static init(sequelize) {
        super.init(
            {
                ip: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
            },

            {
                sequelize,
            }
        )
    }

    static associate(models) {}
}

module.exports = BlockedIp
