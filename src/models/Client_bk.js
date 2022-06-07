const { DataTypes, Model } = require('sequelize')

class Client extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The name field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The name field cannot be empty`,
                        },
                    },
                },
                cpf: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This CPF already exist`,
                    },
                    validate: {
                        is: {
                            args: /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/,
                            msg: `Please enter a valid CPF`,
                        },
                        notNull: {
                            msg: `The cpf field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The cpf field cannot be empty`,
                        },
                    },
                },
                rg: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This RG already exist`,
                    },
                    validate: {
                        is: {
                            args: /(^(\d{2}\x2E\d{3}\x2E\d{3}[-]\d{1})$|^(\d{2}\x2E\d{3}\x2E\d{3})$)/,
                            msg: `Please enter a valid RG`,
                        },
                        notNull: {
                            msg: `The cpf field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The cpf field cannot be empty`,
                        },
                    },
                },
                gender: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The gender field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The gender field cannot be empty`,
                        },
                    },
                },
                nationality: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The nationality field cannot be empty`,
                        },
                    },
                },
                marital: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The marital field cannot be empty`,
                        },
                    },
                },
                birthDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The birthDate field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The birthDate field cannot be empty`,
                        },
                    },
                },
                type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The type field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                note: {
                    type: DataTypes.TEXT,
                },
            },
            {
                sequelize,
            }
        )
    }

    static associate(models) {
        this.hasOne(models.Address, { foreignKey: 'client_id', as: 'address' })
        this.hasOne(models.Contact, { foreignKey: 'client_id', as: 'contact' })
        this.hasMany(models.Location, { foreignKey: 'owner_id', as: 'owner' })
        this.hasMany(models.Location, { foreignKey: 'occupant_id', as: 'occupant' })
        this.hasMany(models.Location, { foreignKey: 'guarantor_id', as: 'guarantor' })
    }
}

module.exports = Client
