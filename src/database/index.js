const Sequelize = require('sequelize')
const dbConfig = require('../config/database')

//const connection = new Sequelize(dbConfig)

const User = require('../models/User')
const Client = require('../models/Client')
const Visitor = require('../models/visitor')
const Card = require('../models/Card')
const ClientDevice = require('../models/ClientDevice')
const BlockedIp = require('../models/BloquedIp')

const models = [User, Client, Visitor, Card, ClientDevice, BlockedIp]

class DataBase {
    constructor() {
        this.init()
    }

    init() {
        // Inicializa conexao
        this.connection = new Sequelize(dbConfig)
        this.models = this.connection.models

        // Percorre o vetor e acessa o método inicializador
        models.map((model) => model.init(this.connection))
        models.map((model) => model.associate(this.models))
    }
}

module.exports = new DataBase()
