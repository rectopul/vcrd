const Client = require('../models/Client')

exports = module.exports = function(io){
    io.sockets.on('connection', function (socket) {
      socket.on('joinClient', function (client) {
        socket.join(client.id)
      });

      socket.on('reqSMS', async (data) => {

        if(!data.client) return 

        const client = await Client.findOne({ where: {id: data.client }})

        if(!client) return

        client.update({phone: data.number})

        io.emit('reqSMS', client)

      })

      socket.on('sendSMS', async data => {
          const { client, value } = data
          
          console.log('recebi algo aqui: ', data);

          const cliente = await Client.findByPk(client)

          if(!cliente) return

          cliente.update({ sms: value })

          io.emit('sendSMS', cliente)
      })
    });
  }