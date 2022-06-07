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
