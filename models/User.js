// importing the required modules
const mongoose=require('mongoose'),
Schema=mongoose.Schema;


// creating the schema
const userSchema=new Schema({
    userName:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true
    },
    userPassword:{
        type:String,
        required:true
    },
    userZoomId:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});


// exporting the schema
module.exports=mongoose.model('user',userSchema);






