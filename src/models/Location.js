const { DataTypes, Model } = require('sequelize')

class Location extends Model {
    static init(sequelize) {
        super.init(
            {
                paymentType: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The paymentType field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The paymentType field cannot be empty`,
                        },
                    },
                },
                locationValue: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The locationValue field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The locationValue field cannot be empty`,
                        },
                    },
                },
                locationType: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The locationType field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The locationType field cannot be empty`,
                        },
                    },
                },
                participation: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The participation field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The participation field cannot be empty`,
                        },
                    },
                },
                locationTime: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The locationTime field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The locationTime field cannot be empty`,
                        },
                        isInt: {
                            msg: `The locationTime field is a integer number`,
                        },
                    },
                },
                locationStart: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The locationStart field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The locationStart field cannot be empty`,
                        },
                        isDate: {
                            msg: `The locationStart field is a date value`,
                        },
                    },
                },
                locationEnd: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The locationEnd field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The locationEnd field cannot be empty`,
                        },
                        isDate: {
                            msg: `The locationEnd field is a date value`,
                        },
                    },
                },
                locationGuarantee: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The locationEnd field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The locationEnd field cannot be empty`,
                        },
                    },
                },
                capitalizationValue: {
                    type: DataTypes.DECIMAL,
                    validate: {
                        notEmpty: {
                            msg: `The capitalizationValue field cannot be empty`,
                        },
                        isDecimal: {
                            msg: `The capitalizationValue field is a decimal value`,
                        },
                    },
                },
                capitalizationStart: {
                    type: DataTypes.DATE,
                    validate: {
                        notEmpty: {
                            msg: `The capitalizationStart field cannot be empty`,
                        },
                        isDate: {
                            msg: `The capitalizationStart field is a date value`,
                        },
                    },
                },
                capitalizationEnd: {
                    type: DataTypes.DATE,
                    validate: {
                        notEmpty: {
                            msg: `The capitalizationEnd field cannot be empty`,
                        },
                        isDate: {
                            msg: `The capitalizationEnd field is a date value`,
                        },
                    },
                },
                capitalizationObservation: {
                    type: DataTypes.TEXT,
                    validate: {
                        notEmpty: {
                            msg: `The capitalizationObservation field cannot be empty`,
                        },
                    },
                },
                capitalizationApolice: {
                    type: DataTypes.TEXT,
                    validate: {
                        notEmpty: {
                            msg: `The capitalizationApolice field cannot be empty`,
                        },
                    },
                },
                calcaoValue: {
                    type: DataTypes.DECIMAL,
                    validate: {
                        notEmpty: {
                            msg: `The capitalizationApolice field cannot be empty`,
                        },
                        isDecimal: {
                            msg: `The calcao_value field is a decimal number`,
                        },
                    },
                },
                bailValue: {
                    type: DataTypes.DECIMAL,
                    validate: {
                        notEmpty: {
                            msg: `The bailValue field cannot be empty`,
                        },
                        isDecimal: {
                            msg: `The bailValue field is a decimal value`,
                        },
                    },
                },
                bailObservation: {
                    type: DataTypes.TEXT,
                    validate: {
                        notEmpty: {
                            msg: `The bailObservation field cannot be empty`,
                        },
                    },
                },
                bailApolice: {
                    type: DataTypes.TEXT,
                    validate: {
                        notEmpty: {
                            msg: `The capitalizationApolice field cannot be empty`,
                        },
                    },
                },
                bailStart: {
                    type: DataTypes.DATE,
                    validate: {
                        notEmpty: {
                            msg: `The bailStart field cannot be empty`,
                        },
                        isDate: {
                            msg: `The bailStart field is a date value`,
                        },
                    },
                },
                bailEnd: {
                    type: DataTypes.DATE,
                    validate: {
                        notEmpty: {
                            msg: `The bailEnd field cannot be empty`,
                        },
                        isDate: {
                            msg: `The bailEnd field is a date value`,
                        },
                    },
                },
                administrationFee: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The administrationFee field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The administrationFee field cannot be empty`,
                        },
                        isDecimal: {
                            msg: `The administrationFee field is a decimal value`,
                        },
                    },
                },
                administrationFeeType: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The administrationFeeType field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The administrationFeeType field cannot be empty`,
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
        this.belongsTo(models.Client, { foreignKey: 'owner_id', as: 'owner' })
        this.belongsTo(models.Client, { foreignKey: 'occupant_id', as: 'occupant' })
        this.belongsTo(models.Client, { foreignKey: 'guarantor_id', as: 'guarantor' })
        this.belongsTo(models.Property, { foreignKey: 'property_id', as: 'property' })
    }
}

module.exports = Location
