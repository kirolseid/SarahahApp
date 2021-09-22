const mongoose = require('mongoose');

const userSchema=mongoose.Schema({
    
    userId:mongoose.Schema.Types.ObjectId,
    photoPath:String,

})

module.exports=mongoose.model('photo',userSchema)