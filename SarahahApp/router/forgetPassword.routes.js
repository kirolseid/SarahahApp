const UM = require('../models/user.model');
const app =require('express').Router()
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken');
const validation = require('../validation/changePass.valid');
const {validationResult} =require('express-validator');


let transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user:'kirotest0@gmail.com', // generated ethereal user
      pass:'Kiro@1234' , // generated ethereal password
    },
});

app.get('/forget', (req, res) => {
    res.render('forgetPassword.ejs',{id:'',checkMass:req.flash('checkMass'),notfounded:req.flash('notfounded')})
});


app.post('/handleforget',async (req, res) => {
    // console.log(req.body);
    const{email}=  req.body
    let data = await UM.findOne({email})
    // console.log(data);

    if (data) {
        var token = jwt.sign({ email }, 'hamada');
        let info ={
            from: '"NODE JS " <kirotest0@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            html:   `
                        <div style="background-color:#bbf;color:red ;padding:140px">
                            <h1><a href="${req.protocol}://${req.headers.host}/changePasswrd/${token}" target="_blank" rel="noopener noreferrer">click to Change Password</a> <h1>
                        </div>
                    `, // html body        
        };
            await transporter.sendMail(info)
        req.flash('checkMass','checkUEmail')
        res.redirect('/forget')       
    }else{
        req.flash('notfounded','notemail')
        res.redirect('/forget')
    }
});


app.get('/changePasswrd/:token',(req, res) => {
   res.render('changePassword.ejs',{id:'',validMass:req.flash('inputInvalid')}) 
   
});

app.post('/handelchangePass', validation,(req, res) => {
    const{newPass,confirnNewPass}=req.body
    let token =req.headers.referer.split(`${req.protocol}://${req.headers.host}/changePasswrd/`)
    // console.log(token);
        jwt.verify(token[1], 'hamada',async function(err, decoded) {
            
            // console.log(decoded.email) // bar
            let email= await UM.findOne({email:decoded.email})
                if (email) {
                    let error =validationResult(req)
                    if (error.isEmpty()) {
                        bcrypt.hash(newPass, 7,async function(err, hash) {
                            // Store hash in your password DB.
                            await UM.findOneAndUpdate({email:decoded.email},{password:hash})
                            res.redirect('/login')
                        });
                    }else{
                    req.flash('inputInvalid',error.array())
                    // console.log('inputInvalid',error.array());
                    res.redirect('/changePasswrd/'+token)
                    }
                }else{
                    console.log("email m4 mazbot");
                    res.redirect('/login')

                }

        }); 


});


module.exports=app
