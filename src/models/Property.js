const { DataTypes, Model } = require('sequelize')

class Property extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.TEXT,
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
                description: {
                    type: DataTypes.TEXT,
                    validate: {
                        notEmpty: {
                            msg: `The description field cannot be empty`,
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
                            msg: `The type field cannot be empty`,
                        },
                    },
                },
                tradingType: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The tradingType field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The tradingType field cannot be empty`,
                        },
                    },
                },
                propertyIs: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The propertyIs field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The propertyIs field cannot be empty`,
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
        this.hasOne(models.PropertyAddress, { foreignKey: 'property_id', as: 'address' })
        this.hasOne(models.PropertyFeature, { foreignKey: 'property_id', as: 'feature' })
        this.hasOne(models.PropertyInformation, { foreignKey: 'property_id', as: 'information' })
        this.hasOne(models.PropertyValue, { foreignKey: 'property_id', as: 'value' })
        this.hasMany(models.Location, { foreignKey: 'property_id', as: 'property' })
    }
}

module.exports = Property
