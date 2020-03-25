// importing npm modules
const express=require('express'),
passport=require('passport'),
mongoose=require('mongoose'),
bodyparser=require('body-parser');


// starting the server
const app=express();


// fetching the port number
const port=process.env.PORT||3000;

// fetching the mongourl from configuration file
const dbstr=require('./setup/config').mongoUrl;


// connecting the database
mongoose.connect(dbstr,{useNewUrlParser:true,useUnifiedTopology:true})
        .then(()=>console.log('Mongodb connected successfully'))
        .catch(err=>console.log(err));


// fetching the routes
const auth=require('./routes/api/auth');


// configuring middleware for bodyparser
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());


// configuring middleware for passport
app.use(passport.initialize());


// fetching the strategy
require('./strategies/jsonwtStrategy')(passport);


// calling the routes
app.use('/api/auth',auth);


// listening the server
app.listen(port,()=>console.log(`Server is running at port ${port}`));







