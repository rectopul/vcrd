const { DataTypes, Model } = require('sequelize')

class Contact extends Model {
    static init(sequelize) {
        super.init(
            {
                cell: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This cell already exist`,
                    },
                    validate: {
                        notNull: {
                            msg: `The cell field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The cell field cannot be empty`,
                        },
                    },
                },
                phone: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This phone already exist`,
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
                other: {
                    type: DataTypes.TEXT,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        isEmail: {
                            msg: `Please provide valid email`,
                        },
                        notNull: {
                            msg: `The email field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The email field cannot be empty`,
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

module.exports = Contact
