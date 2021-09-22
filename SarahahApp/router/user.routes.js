const auth = require('../middleware/auth');
const MM =require('../models/massage.model')
const app =require('express').Router()
const UM =require('../models/user.model')
const PM =require('../models/photo.model')


let userId 
app.get('/user/:id',async(req, res) => {
    // console.log(req.params.id);
    userId=req.params.id
    let user =await UM.findOne({_id:userId })
    // console.log(user);
    let photo =await PM.findOne({userId:userId })

    // console.log(photo);
    res.render('user.ejs',{id:req.session.Id,name:user.name,photo:photo})
});

app.post('/handelMassage',async (req, res) => {
    // console.log(id);
    // console.log(req.body);
    await MM.insertMany({userId:userId,massage:req.body.massage})
    res.redirect("/user/"+userId)
});


module.exports=app