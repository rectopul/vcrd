const express = require('express')
const cookieParser = require('cookie-parser')
const pages = require('./pages')
const api = require('./api')

const routes = express.Router()

//const credentials = require('./middlewares/UserCredentials')

//Test de rota
//Index
const IndexView = require('../controllers/views/indexView')
const ContaView = require('../controllers/views/contaView')
routes.get(`/`, IndexView.view)
routes.get(`/modules/conta`, ContaView.view)
routes.get(`/modules/conta/:client_id`, ContaView.error)
routes.use(cookieParser())

routes.use(pages)
routes.use(api)

module.exports = routes
