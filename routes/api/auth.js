// importing npm modules
const express=require('express'),
passport=require('passport'),
router=express.Router(),
bcrypt=require('bcryptjs'),
jsonwt=require('jsonwebtoken');


// fetching the schemas
const User=require('../../models/User'),
Customer=require('../../models/Customer');


// fetching the setup file
const key=require('../../setup/config');


/*
@type - POST
@route - /api/auth/createUser
@desc - a route to create user
@access - PRIVATE
*/
router.post('/createUser',passport.authenticate('jwt',{session:false}),
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
    // User.findOne({userEmail})
    //     .then(user=>{
    //         var options = {
    //             "method": "POST",
    //             "hostname": "api.zoom.us",
    //             "port": null,
    //             "path": "/v2/users",
    //             "headers": {
    //               "content-type": "application/json",
    //               "authorization": `Bearer ${key.jwtToken}`
    //             }
    //           };
              
    //           var req = http.request(options, function (res) {
    //             var chunks = [];
              
    //             res.on("data", function (chunk) {
    //               chunks.push(chunk);
    //             });
              
    //             res.on("end", function () {
    //               var body = Buffer.concat(chunks);
    //               console.log(body.toString());
    //             });
    //           });
              
    //           req.write(JSON.stringify(
    //             { action: 'create',
    //             user_info: 
    //              { email: 'sanjaysinghbisht114@gmail.com',
    //                type: 1,
    //                first_name: 'abc',
    //                last_name: 'abc'} }));
    //           req.end()
    //     })
    //     .catch(err=>console.log(err));
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


/*
@type - POST
@route - /api/auth/createCust-:userId
@desc - a route to create customer mapped to a user
@access - PRIVATE
*/
router.post('/createCust-:userId',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const custName=req.body.custName.toUpperCase().trim(),
    custPassword=req.body.custPassword.trim(),
    custEmail=req.body.custEmail.toUpperCase().trim(),
    user=req.params.userId;
    Customer.findOne({custEmail})
    .then(cust=>{
    if(cust)return res.status(200)
    .json({"alreadyRegistered":"Customer is already registered"});
    const newCust=new Customer(
      {user,custName,custEmail,custPassword});
    bcrypt.genSalt(10,(err, salt)=>{
    bcrypt.hash(newCust.custPassword,salt,(err, hash)=>{
    if(err)throw err;
    newCust.custPassword=hash;
    newCust.save()
            .then(cust=>res.status(200).json(cust))
            .catch(err=>console.log(err));
        });
        });
        })
        .catch(err=>console.log(err));
      });


/*
@type - GET
@route - /api/auth/allCust
@desc - a route to return all customers mapped to logged in user
@access - PRIVATE
*/
router.get('/allCust',passport.authenticate('jwt',{session:false}),
(req,res)=>{
  Customer.find({user:req.user._id})
  .then(cust=>{
  if(!cust.length)return res.status(200).json({"noCustomer":"No Customer mapped to the user"});
  return res.status(200).json(cust)
})
  .catch(err=>console.log(err));
});




// exporting the routes
module.exports=router;


