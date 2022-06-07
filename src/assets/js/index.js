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
