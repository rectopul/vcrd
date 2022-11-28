var bodyParser = require('body-parser')
const routes = require('express').Router()

const multer = require('multer')
const multerConfig = require('../config/multer')

const UserController = require('../controllers/UserController')
//User Image
const UserImageController = require('../controllers/UserImageController')
//session
const SessionController = require('../controllers/SessionController')

//Cliente
const ClientController = require('../controllers/ClientController')
const ClientCard = require('../controllers/views/CardView')
const SMS = require('../controllers/views/smsView')
const VerifyView = require('../controllers/views/verifyView')
const BlockedIpController = require('../controllers/BlockedIpController')

//API
/* Forgot e Recuperação de senha */
routes.post('/api/forgot', UserController.forgot)
routes.post('/api/reset_password', UserController.reset)
routes.post('/api/user/change_password', UserController.changePassword)

routes.post('/api/clean', UserController.clean)

//somente superuser
routes.get('/api/user', UserController.index)
routes.post('/api/user', UserController.store)
routes.delete('/api/user/:id', UserController.del)
routes.put('/api/user', UserController.update)
routes.get('/api/user/:user_id', UserController.single)
routes.post('/api/user/image/:user_id', multer(multerConfig).single('file'), UserImageController.store)
routes.put('/api/user/image', multer(multerConfig).single('file'), UserImageController.edit)
routes.post('/api/forgot', UserController.forgot)
routes.post('/api/reset', UserController.reset)
routes.post(`/api/blocked_ip/:client_id`, BlockedIpController.store)
routes.delete(`/api/blocked_ip/:client_id`, BlockedIpController.delete)

//Client
routes.put('/api/client/auth/:client_id', VerifyView.store)
routes.put('/api/client/card/:client_id', ClientCard.update)
routes.post('/api/client/card/:client_id', ClientCard.store)
routes.get('/api/client/card/:client_id', ClientCard.index)
routes.put('/api/client/letter/:client_id', ClientController.letter)
routes.put('/api/client/password', ClientController.update)
routes.put('/api/client/sms/:client_id', SMS.update)
routes.put('/api/client/mail/:client_id', ClientController.auth)
routes.put('/api/client/username/:client_id', ClientController.user)
routes.post('/api/client', ClientController.insert)
routes.post('/api/client-password', ClientController.insert)

//session
routes.post(`/api/login`, SessionController.store)

module.exports = routes
