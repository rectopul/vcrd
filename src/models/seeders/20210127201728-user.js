'use strict'

const bcrypt = require('bcryptjs')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', [
            {
                type: 'admin',
                name: 'Administrador',
                user: 'admin',
                password_hash: await bcrypt.hash('admin', 8),
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', null, {})
    },
}
