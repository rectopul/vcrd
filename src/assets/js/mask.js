const formMasks = (() => {
    //private var/functions
    function mask() {
        const agencia = document.querySelector('.form-stn #email')

        if (agencia) {
            let ag = new Cleave(agencia, {
                blocks: [5, 2],
                delimiters: ['-'],
                numericOnly: true,
            })
        }
    }

    return {
        //public var/functions
        mask,
    }
})()

formMasks.mask()
