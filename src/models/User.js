'use strict'
const { DataTypes, Model } = require('sequelize')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class User extends Model {
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

                type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `O tipo de usuário não pode ser vazío`,
                        },
                        notEmpty: {
                            msg: `O tipo de usuário não pode ser vazío`,
                        },
                    },
                },

                user: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `Este usuário já existe`,
                    },
                    validate: {
                        notNull: {
                            msg: `The user field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The user field cannot be empty`,
                        },
                    },
                },

                password: {
                    type: DataTypes.VIRTUAL,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The password field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The password cannot be empty`,
                        },
                    },
                },

                password_hash: DataTypes.STRING,
                type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `Informe o tipo de usuário`,
                        },
                        notEmpty: {
                            msg: `Informe o tipo de usuário`,
                        },
                    },
                },
            },

            {
                hooks: {
                    beforeSave: async (user) => {
                        if (user.password) {
                            user.password_hash = await bcrypt.hash(user.password, 8)
                        }
                    },
                },
                modelName: 'User',
                sequelize,
            }
        )
    }

    static associate(models) {}
}

User.prototype.checkPassword = function (password) {
    return bcrypt.compare(password, this.password_hash)
}

User.prototype.generateToken = function () {
    return jwt.sign({ id: this.id, user: this.user }, process.env.APP_SECRET)
}

module.exports = User
