module.exports = {
    async view(req, res) {
        try {
            return res.render('login', {
                pageClasses: `bg-default g-sidenav-show g-sidenav-pinned`,
                title: `Login`,
            })
        } catch (error) {
            //console.log(error)
            return res.redirect('/login')
        }
    },
}
