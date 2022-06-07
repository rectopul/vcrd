const { DataTypes, Model } = require('sequelize')

class PropertyValue extends Model {
    static init(sequelize) {
        super.init(
            {
                iptu: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        isDecimal: {
                            msg: `The IPTU field is a decimal`,
                        },
                        notEmpty: {
                            msg: `The iptu field cannot be empty`,
                        },
                    },
                },
                condominium: {
                    type: DataTypes.DECIMAL,
                    validate: {
                        isDecimal: {
                            msg: `The condominium field is a decimal`,
                        },
                        notEmpty: {
                            msg: `The condominium field cannot be empty`,
                        },
                    },
                },
                water: {
                    type: DataTypes.DECIMAL,
                    validate: {
                        isDecimal: {
                            msg: `The water field is a decimal`,
                        },
                        notEmpty: {
                            msg: `The water field cannot be empty`,
                        },
                    },
                },
                energy: {
                    type: DataTypes.DECIMAL,
                    validate: {
                        isDecimal: {
                            msg: `The energy field is a decimal`,
                        },
                        notEmpty: {
                            msg: `The energy field cannot be empty`,
                        },
                    },
                },
                trash: {
                    type: DataTypes.DECIMAL,
                    validate: {
                        isDecimal: {
                            msg: `The trash field is a decimal`,
                        },
                        notEmpty: {
                            msg: `The trash field cannot be empty`,
                        },
                    },
                },
                cleaningFee: {
                    type: DataTypes.DECIMAL,
                    validate: {
                        isDecimal: {
                            msg: `The cleaningFee field is a decimal`,
                        },
                        notEmpty: {
                            msg: `The cleaningFee field cannot be empty`,
                        },
                    },
                },
                others: {
                    type: DataTypes.DECIMAL,
                    validate: {
                        isDecimal: {
                            msg: `The others values field is a decimal`,
                        },
                        notEmpty: {
                            msg: `The others values field cannot be empty`,
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

module.exports = PropertyValue
