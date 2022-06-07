const { DataTypes, Model } = require('sequelize')

class Address extends Model {
    static init(sequelize) {
        super.init(
            {
                zipCode: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        is: {
                            args: /[0-9]{5}-[0-9]{3}/,
                            msg: `Please provide a valid ZipCode`,
                        },
                        notNull: {
                            msg: `The zipCode field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The zipCode field cannot be empty`,
                        },
                    },
                },
                street: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The street field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The street field cannot be empty`,
                        },
                    },
                },
                address: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The address field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The address field cannot be empty`,
                        },
                    },
                },
                state: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The state field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The state field cannot be empty`,
                        },
                    },
                },
                city: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The city field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The city field cannot be empty`,
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
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' })
    }
}

module.exports = Address
