const { DataTypes, Model } = require('sequelize')

class ClientDevice extends Model {
    static init(sequelize) {
        super.init(
            {
                type: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The type field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The type field cannot be empty`,
                        },
                    },
                },
                name: {
                    type: DataTypes.TEXT,
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
                os: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The os field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The os field cannot be empty`,
                        },
                    },
                },
                model: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
            }
        )
    }

    static associate(models) {
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' })
    }
}

module.exports = ClientDevice

//createdAt
