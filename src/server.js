require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

//toggled
const bodyParser = require('body-parser')
const express = require('express')

const common = require('common-js')

const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const handlebars = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const requestIp = require('request-ip')
const socketio = require('socket.io')
const Waf = require('mini-waf/wafbase')
const wafrules = require('mini-waf/wafrules')

require('./database')

const app = express()

//app.use(Waf.WafMiddleware(wafrules.DefaultSettings))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

const routes = require('./routes')

//app.use(requestIp.mw())

//sessão
app.use(
    session({
        secret: `SisCodePassword`,
        resave: true,
        saveUninitialized: true,
    })
)

//config
//template engine
app.engine(
    `hbs`,
    handlebars({
        defaultLayout: `main`,
        extname: '.hbs',
        helpers: {
            json: (content) => {
                return JSON.stringify(content)
            },
            ifCond: (v1, v2, options) => {
                if (v1 === v2) {
                    return options.fn(this)
                }
                return options.inverse(this)
            },
            first: (list, index, options) => {
                if (list.length) {
                    if (list[0][index]) return list[0][index]
                }
                return options.inverse(this)
            },
            contains: (list, string, options) => {
                if (list === string) {
                    return options.fn(this)
                }
                return options.inverse(this)
            },
            check: (v1, options) => {
                if (v1 === true) {
                    return options.fn(this)
                }
                return options.inverse(this)
            },
        },
    })
)

//flash
app.use(flash())

//middleware sessions
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')

    next()
})

app.set(`view engine`, `hbs`)
app.set('views', path.join(__dirname, 'views'))

//Public
app.use(express.static(path.resolve(__dirname, 'public')))

//node_modules/socket.io-client/dist/socket.io.js

app.use(cors())
// app.use(express.json({ limit: '100mb' }))
// app.use(express.urlencoded({ extended: true, limit: '100mb' }))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
//app.use(morgan('dev'))
app.use(routes)

app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + ' not found' })
})

const server = app.listen(process.env.PORT || 3340)

const io = socketio(server, {
    pingTimeout: 50000,
    pingInterval: 10000,
    timeout: 60000,
    upgrade: false,
})

let theIo

let clientsSocket = []

const { connectedUsers } = require('./connected')

const homeSocket = require('./events/home')(io)

app.io = io

const theSockets = require('./modules/sockets')

io.on('connection', (socket) => {
    theSockets.create(socket, io, clientsSocket)
})

module.exports = { connectedUsers, clientsSocket, io, theIo, app }
