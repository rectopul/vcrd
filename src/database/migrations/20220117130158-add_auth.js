'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('clients', 'auth', { type: Sequelize.DataTypes.TEXT })])
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('clients', 'auth')])
    },
}
