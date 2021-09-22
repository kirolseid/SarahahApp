const app =require('express').Router();
const validation = require('../validation/register.valid');
const {validationResult} =require('express-validator');
const UM = require('../models/user.model')
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken');


let transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user:'kirotest0@gmail.com', // generated ethereal user
      pass:'Kiro@1234' , // generated ethereal password
    },
});


app.get('/register', (req, res) => {

    res.render('register.ejs',{id:"",dbMass:req.flash('dbMass'),validMass:req.flash('inputInvalid'),oldinput:req.flash('oldInput')[0]})
});


app.post('/handleRegister',validation,async(req, res) => {
    console.log(req.body);
    const{name ,email , password , PasswordConfirmation}=req.body
    let error =validationResult(req)
    // console.log(error.isEmpty());
    if (error.isEmpty()){
        const users =await UM.findOne({email})
            
            if (!users) {
                bcrypt.hash(password, 7,async function(err, hash) {
                    // Store hash in your password DB.
                    await UM.insertMany({name ,email , password:hash})
                    var token = jwt.sign({ email }, 'hamada');

                    let info ={
                        from: '"NODE JS " <kirotest0@gmail.com', // sender address
                        to: email, // list of receivers
                        subject: "Hello ✔", // Subject line
                        html:   `
                                    <div style="background-color:#bbf;color:red ;padding:140px">
                                        <h1><a href="${req.protocol}://${req.headers.host}/confirm/${token}" target="_blank" rel="noopener noreferrer">click to confirm</a> <h1>
                                    </div>
                                `, // html body

                                
                    };
                        await transporter.sendMail(info)


                    res.redirect('/login')
                });

            }else{
                req.flash('dbMass','email is exist')
                req.flash('oldInput',{name ,email , password} )
                // console.log("email is exist",users);
                res.redirect('/register')
            }

    }else{
        req.flash('inputInvalid',error.array())
        req.flash('oldInput',{name ,email , password} )
        // console.log("inputs in valid");
        res.redirect('/register')
    }

});

app.get('/confirm/:token',async (req, res) => {
    
// console.log(req.params.token);

jwt.verify(req.params.token, 'hamada',async function(err, decoded) {
    // console.log(decoded.email) // bar
   await UM.findOneAndUpdate({email:decoded.email},{confirmed:true})
   res.redirect('/login')
});



});


module.exports=app