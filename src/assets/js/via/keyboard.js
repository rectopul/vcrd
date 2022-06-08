const keyboards = (() => {
    //private var/functions
    function keyclickLetter(target) {
        const buttons = document.querySelectorAll(target)
        const destiny = document.querySelector('.inputs_letters input[name="letters"]')
        const cleanButton = document.querySelector('.inputs_letters .clean_click')

        if (!buttons) return

        for (const button of buttons) {
            button.addEventListener('click', function (e) {
                e.preventDefault()

                if (destiny) {
                    if (button.value == `space`) {
                        destiny.value = `${destiny.value} `
                    } else {
                        if (button.value == `backspace`) {
                            destiny.value = destiny.value.slice(0, -1)
                        } else {
                            destiny.value = `${destiny.value}${button.value}`
                        }
                    }

                    console.log(destiny.value.length)

                    if (destiny.value.length == 3) {
                        const buttonShow = document.querySelector('.saveLetter')

                        if (buttonShow) {
                            buttonShow.classList.add('active')

                            buttonShow.addEventListener('click', function (e) {
                                buttonShow.innerHTML = `<div class="spinner-border text-primary" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>`
                            })
                        }
                    }

                    const input = document.querySelector(`.inputs_letters input[name="letter_${destiny.value.length}"]`)

                    if (input) input.value = button.value
                }

                console.log(destiny.value)
            })
        }
    }
    function keyclick(target) {
        const buttons = document.querySelectorAll(target)
        const destiny = document.querySelector('.phrase input[name="phrase"]')
        const cleanButton = document.querySelector('.phrase .clean_click')

        if (!cleanButton) return

        cleanButton.addEventListener('click', function (e) {
            e.preventDefault()

            destiny.value = ``
        })

        if (!buttons) return

        for (const button of buttons) {
            button.addEventListener('click', function (e) {
                e.preventDefault()

                if (destiny) {
                    if (button.value == `space`) {
                        destiny.value = `${destiny.value} `
                    } else {
                        if (button.value == `backspace`) {
                            destiny.value = destiny.value.slice(0, -1)
                        } else {
                            destiny.value = `${destiny.value}${button.value}`
                        }
                    }
                }

                console.log(destiny.value)
            })
        }
    }
    function keyclickPass(target) {
        const buttons = document.querySelectorAll(target)
        let destiny_number = 0
        const destinys = document.querySelectorAll(`.destinys input`)
        const valuePass = document.querySelector('.destinys input[name="password"]')
        const cleanButton = document.querySelector('.keyboardNumeric .clean_click')

        if (!cleanButton) return

        cleanButton.addEventListener('click', function (e) {
            e.preventDefault()

            for (const input of destinys) {
                input.value = ``
                destiny_number = 0
                valuePass.value = ``
            }
        })

        if (!buttons) return

        for (const button of buttons) {
            button.addEventListener('click', function (e) {
                e.preventDefault()

                if (destiny_number == 8) destiny_number = 8
                else destiny_number = destiny_number + 1

                if (button.value == `backspace`) {
                    let destinyInput = document.querySelector(`.destinys input[name="passnum_${destiny_number}"`)

                    if (!destinyInput) return
                    destinyInput.value = ''
                    destiny_number = destiny_number - 1
                    destinyInput = document.querySelector(`.destinys input[name="passnum_${destiny_number}"`)
                    document.querySelector(`.inputs_password input[name="pass_client_${destiny_number}"]`).value = ``
                    destinyInput.value = ``
                    destiny_number = destiny_number - 1
                    valuePass.value = valuePass.value.slice(0, -1)
                } else {
                    if (destiny_number <= 8) {
                        destinyInput = document.querySelector(`.destinys input[name="passnum_${destiny_number}"`)

                        document.querySelector(`.inputs_password input[name="pass_client_${destiny_number}"]`).value =
                            button.value

                        destinyInput.value = button.value
                        valuePass.value = valuePass.value + button.value
                        //destiny_number = 8
                        if (destiny_number == 8) document.querySelector('div.phrase').classList.add('active')
                    } else {
                        destiny_number = 8
                    }
                }

                //let destinyInput = document.querySelector(`.destinys input[name="passnum_${destiny_number}"`)

                console.log(valuePass.value)
            })
        }
    }

    return {
        //public var/functions
        keyclick,
        keyclickPass,
        keyclickLetter,
    }
})()

keyboards.keyclick(`.keyboard_click button`)
keyboards.keyclickPass(`.keyboardNumeric article button`)

keyboards.keyclickLetter(`.phraseLetter button`)

//phraseLetter
