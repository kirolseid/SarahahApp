const auth = require('../middleware/auth');
const app =require('express').Router()
const MM =require('../models/massage.model')
const PM =require('../models/photo.model')


app.get('/message',auth,async(req, res) => {
    // console.log(req.protocol);
    // console.log((req.headers.host));
    let url =req.protocol+"://"+req.headers.host+"/user/"+req.session.Id
    // console.log(url);
    let massages= await  MM.find({userId:req.session.Id})
    // console.log(massages);
    let photo = await PM.find({userId:req.session.Id})
    // console.log(photo[0]);
    res.render('messages.ejs',{id:req.session.Id,name:req.session.name,url:url,massages,photo:photo[0]})

});




app.post('/uploadFile',async(req, res) => {
    // console.log(req.body);
    // console.log(req.file);

    if (req.file==undefined) {
        res.redirect('/message')
        console.log('input invalid');

        
    }else{
        let photo =await PM.findOne({userId:req.session.Id})
        if (photo) {
            
            await PM.findOneAndRemove({userId:req.session.Id})
                await PM.insertMany({
                    userId:req.session.Id,
                    photoPath:req.file.path
                })
                res.redirect('/message') 
            
        }else{

            await PM.insertMany({
                userId:req.session.Id,
                photoPath:req.file.path
            })
            res.redirect('/message')
        }
        
    }
});



module.exports=app