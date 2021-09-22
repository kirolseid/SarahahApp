const app =require('express').Router()

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/login')
});

module.exports=app
