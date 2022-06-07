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
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This email of user already exist`,
                    },
                    validate: {
                        notNull: {
                            msg: `The email field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The email field cannot be empty`,
                        },
                        isEmail: {
                            msg: `Enter a valid email`,
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
                passwordResetToken: DataTypes.STRING,
                passwordResetExpires: DataTypes.DATE,
                phone: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This phone of store aready exist`,
                    },
                    validate: {
                        notNull: {
                            msg: `The phone field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The phone field cannot be empty`,
                        },
                    },
                },
                cell: {
                    type: DataTypes.STRING,
                    validate: {
                        is: {
                            args: /(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/g,
                            msg: `Please provide a valid cell number`,
                        },
                    },
                },
                address: {
                    type: DataTypes.TEXT,
                },
                city: {
                    type: DataTypes.TEXT,
                },
                about: {
                    type: DataTypes.TEXT,
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

    static associate(models) {
        this.hasOne(models.UserImage, { foreignKey: 'user_id', as: 'avatar' })
    }
}

User.prototype.checkPassword = function (password) {
    return bcrypt.compare(password, this.password_hash)
}

User.prototype.generateToken = function () {
    return jwt.sign({ id: this.id, name: this.name }, process.env.APP_SECRET)
}

module.exports = User
