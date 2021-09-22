const mongoose = require('mongoose');

const userSchema=mongoose.Schema({
    confirmed: {type:Boolean,default:false},
    name:String,
    email:String,
    password:String,

})

module.exports=mongoose.model('user',userSchema)