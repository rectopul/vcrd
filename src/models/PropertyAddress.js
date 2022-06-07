const { DataTypes, Model } = require('sequelize')

class PropertyAddress extends Model {
    static init(sequelize) {
        super.init(
            {
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
                complement: {
                    type: DataTypes.TEXT,
                    validate: {
                        notEmpty: {
                            msg: `The complement field cannot be empty`,
                        },
                    },
                },
                walk: {
                    type: DataTypes.STRING,
                },
                reference_point: {
                    type: DataTypes.TEXT,
                    validate: {
                        notEmpty: {
                            msg: `The reference_point field cannot be empty`,
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
        this.belongsTo(models.Property, { foreignKey: 'property_id', as: 'property' })
    }
}

module.exports = PropertyAddress
