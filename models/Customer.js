// importing the required modules
const mongoose=require('mongoose'),
Schema=mongoose.Schema;


// creating the schema
const custSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    custName:{
        type:String,
        required:true
    },
    custEmail:{
        type:String,
        required:true
    },
    custPassword:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});


// exporting the schema
module.exports=mongoose.model('cust',custSchema);






