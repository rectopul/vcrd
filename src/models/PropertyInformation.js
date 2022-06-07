const { DataTypes, Model } = require('sequelize')

class PropertyInformation extends Model {
    static init(sequelize) {
        super.init(
            {
                keysAreWith: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The keysAreWith field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The keysAreWith field cannot be empty`,
                        },
                    },
                },
                visitingHours: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The visitingHours field cannot be empty`,
                        },
                    },
                },
                keyNumber: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `The keyNumber field is a integer`,
                        },
                        notEmpty: {
                            msg: `The keyNumber field cannot be empty`,
                        },
                    },
                },
                liquidator: {
                    type: DataTypes.TEXT,
                    validate: {
                        notEmpty: {
                            msg: `The liquidator field cannot be empty`,
                        },
                    },
                },
                liquidatorPhone: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The liquidatorPhone field cannot be empty`,
                        },
                    },
                },
                other: {
                    type: DataTypes.TEXT,
                    validate: {
                        notEmpty: {
                            msg: `The other field cannot be empty`,
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

module.exports = PropertyInformation
