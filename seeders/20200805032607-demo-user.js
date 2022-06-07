'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('users', [
            {
                type: 'super',
                name: 'User Teste',
                user: 'admin',
                password_hash: bcrypt.hashSync('123mudar', 8),
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('users', null, {})
    },
}
