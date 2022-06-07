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
