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
