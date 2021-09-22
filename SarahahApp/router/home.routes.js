const app =require('express').Router()


app.get('/', (req, res) => {
    res.render('index.ejs',{id:''})
});


module.exports=app