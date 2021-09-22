const app =require('express').Router()
const {validationResult} =require('express-validator');
const UM = require('../models/user.model')
const bcrypt = require('bcrypt');
const validation =require('../validation/login.valid')


app.get('/login', (req, res) => {
    res.render('login.ejs',{validMass:req.flash("validMass"),emailMass:req.flash('emailMass'),passMass:req.flash('passMass'),id:"" ,confMass:req.flash('confirmMass')})
});

app.post('/handleLogin', validation,async(req, res) => {
    let error =validationResult(req);
    const{email, password} =req.body
    if (error.isEmpty()) {
        let user = await UM. findOne({email})
        if (user) {
            const match = await bcrypt.compare(password, user.password);

            if(match) {
                if (user.confirmed==false) {
                    req.flash('confirmMass','notConfirmed')
                    res.redirect('/login')  
                }else{
                    req.session.Id=user.id
                    req.session.name=user.name
                    res.redirect('/message')
                }


            }else{
                req.flash('passMass','password  incorrect')
                res.redirect('/login')  
            }
        
            //...
        }else{
            req.flash('emailMass','email incorrect')
            res.redirect('/login')
        }
        
    }else{
        req.flash("validMass","invalid input")
        res.redirect('/login')
        
    }
    // console.log(req.body);
    res.redirect('/login')
    
});


module.exports=app