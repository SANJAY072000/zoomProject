// importing npm modules
const express=require('express'),
passport=require('passport'),
router=express.Router(),
bcrypt=require('bcryptjs'),
jsonwt=require('jsonwebtoken');


// fetching the schemas
const User=require('../../models/User');


// fetching the setup file
const key=require('../../setup/config');


/*
@type - POST
@route - /api/auth/createUser
@desc - a route to create user
@access - PRIVATE
*/
router.post('/createUser',
// passport.authenticate('jwt',{session:false}),
(req,res)=>{
    const userName=req.body.userName.toUpperCase().trim(),
    userPassword=req.body.userPassword.trim(),
    userEmail=req.body.userEmail.toUpperCase().trim(),
    userZoomId=req.body.userZoomId;
    User.findOne({userEmail})
    .then(user=>{
    if(user)return res.status(200).json({"alreadyRegistered":"You are already registered"});
    const newUser=new User({userName,userEmail,userPassword,userZoomId});
    bcrypt.genSalt(10,(err, salt)=>{
    bcrypt.hash(newUser.userPassword,salt,(err, hash)=>{
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
@route - /api/auth/loginUser
@desc - a route to login user
@access - PUBLIC
*/
router.post('/loginUser',(req,res)=>{
    const userEmail=req.body.userEmail.toUpperCase().trim(),userPassword=req.body.userPassword.trim();
    User.findOne({userEmail})
        .then(user=>{
        if(!user)return res.status(200).json({"notRegistered":"You are not registered"});
        bcrypt.compare(userPassword,user.userPassword)
              .then(isCorrect=>{
              if(isCorrect){
              const payload={
                  id:user._id,
                  userEmail:user.userEmail,
                  userName:user.userName,
                  userZoomId:user.userZoomId
              };
              jsonwt.sign(payload,key.secret,{expiresIn:3600},
              (err,token)=>{
              if(err)throw err;
              return res.status(200).json({
              success:true,
              token:`Bearer ${token}`
              });
              });
              }
              else return res.status(200).json({"incorrectPassword":"Password is incorrect"});
              })
              .catch(err=>console.log(err));
        })
        .catch(err=>console.log(err));
    });
    
    
/*
@type - GET
@route - /api/auth/testUser
@desc - a route to test login of the user
@access - PRIVATE
*/
router.get('/testUser',passport.authenticate('jwt',{session:false}),
(req,res)=>{
User.findOne({_id:req.user._id})
    .then(user=>res.status(200).json(user))
    .catch(err=>console.log(err));
});




// exporting the routes
module.exports=router;


