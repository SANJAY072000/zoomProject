const express=require('express'),
passport=require('passport'),
router=express.Router(),
bcrypt=require('bcryptjs'),
jsonwt=require('jsonwebtoken');


// fetching the schemas
const User=require('../../models/User');


// fetching the setup file
const config=require('../../setup/config');


/*
@type - POST
@route - /api/auth/register/admin
@desc - a route to register admin
@access - PUBLIC
*/
router.post('/register/admin',(req,res)=>{
User.findOne({userEmail:req.body.adminEmail})
        .then(user=>{
            if(user)
            return res.status(200).json({userAlreadyRegistered:'Your are already registered'});
            const newUser= new User({
                userName:req.body.adminName,
                userEmail:req.body.adminEmail,
                userPassword:req.body.adminPassword
            });
            bcrypt.genSalt(10,(err, salt)=>{
                bcrypt.hash(newUser.userPassword, salt, (err, hash)=>{
                    if(err)throw err;
                    newUser.userPassword=hash;
                    newUser.save()
                    .then(user=>res.status(200).json(user))
                    .catch(err=>console.log(err));
                });
            });
        })
        .catch(err=>console.log(err));
});


/*
@type - POST
@route - /api/auth/login/user
@desc - a route to login user
@access - PUBLIC
*/
router.post('/login/user',(req,res)=>{
const userEmail=req.body.userEmail,userPassword=req.body.userPassword;
User.findOne({userEmail})
    .then(user=>{
    if(!user)
    return res.status(200).json({"userNotRegistered":'Your are not registered'});
    bcrypt.compare(userPassword,user.userPassword)
    .then(isCorrect=>{
    if(isCorrect){
    const payload={
        id:user._id,
        userName:user.userName,
        userEmail:user.userEmail,
        userZoomId:user.userZoomId,
        userPassword:user.userPassword
    };
    jsonwt.sign(payload,config.secret,{expiresIn:3600},(err,token)=>{
    if(err)throw err;
    res.status(200).json({success:true,token:`Bearer ${token}`});
    });
    }
    else
    return res.status(200).
    json({"passwordIncorrect":'Your password is incorrect'});})
    .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
});


/*
@type - GET
@route - /api/auth/test
@desc - a route to test user login
@access - PRIVATE
*/
router.get('/test',passport.authenticate('jwt',{session:false}),
(req,res)=>{
User.findOne({_id:req.user._id})
.then(user=>res.status(200).json(user))
.catch(err=>console.log(err));
});




// exporting the routes
module.exports=router;


