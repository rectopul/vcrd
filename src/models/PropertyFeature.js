const { DataTypes, Model } = require('sequelize')

class PropertyFeature extends Model {
    static init(sequelize) {
        super.init(
            {
                bedrooms: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        isInt: {
                            msg: `The bedrooms field is a integer`,
                        },
                        notNull: {
                            msg: `The bedrooms field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The bedrooms field cannot be empty`,
                        },
                    },
                },
                suites: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `The suites field is a integer`,
                        },
                        notEmpty: {
                            msg: `The suites field cannot be empty`,
                        },
                    },
                },
                demiSuites: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `The demiSuites field is a integer`,
                        },
                        notEmpty: {
                            msg: `The demiSuites field cannot be empty`,
                        },
                    },
                },
                bathrooms: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        isInt: {
                            msg: `The bathrooms field is a integer`,
                        },
                        notNull: {
                            msg: `The bathrooms field cannot be empty`,
                        },
                    },
                },
                toilet: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `The toilet field is a integer`,
                        },
                        notEmpty: {
                            msg: `The toilet field cannot be empty`,
                        },
                    },
                },
                jobs: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `The jobs field is a integer`,
                        },
                        notEmpty: {
                            msg: `The jobs field cannot be empty`,
                        },
                    },
                },
                flooring: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `The flooring field is a integer`,
                        },
                        notEmpty: {
                            msg: `The flooring field cannot be empty`,
                        },
                    },
                },
                furnished: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The furnished field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The furnished field cannot be empty`,
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

module.exports = PropertyFeature
