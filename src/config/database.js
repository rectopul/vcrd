require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

let database

if (process.env.DATABASE_URL) {
    // the application is executed on Heroku ... use the postgres database
    database = {
        use_env_variable: process.env.DATABASE_URL,
        url: process.env.DATABASE_URL,
        dialect: process.env.DB_DIALECT || 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        storage: './__tests__/database.sqlite',
        ssl: true,
        options: {
            port: 5432,
        },
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true,
        },
    }
} else {
    // the application is executed on the local machine ... use mysql
    database = {
        dialect: process.env.DB_DIALECT || 'postgres',
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        storage: './__tests__/database.sqlite',
        logging: false,
        options: {
            port: 5432,
        },
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true,
        },
    }
}

module.exports = database
