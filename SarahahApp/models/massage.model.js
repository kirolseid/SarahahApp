const mongoose = require('mongoose');

const userSchema=mongoose.Schema({
    
    userId:mongoose.Schema.Types.ObjectId,
    massage:String,

})

module.exports=mongoose.model('massage',userSchema)