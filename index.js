const express= require('express');
const app=express();

// cookies
const cookieParser=require('cookie-parser');

const port=8000;
const db=require('./config/mongoose');

// session cookies
const session=require('express-session'); // create session cookie in encrypred form
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const MongoStore=require('connect-mongo');

// parser use
app.use(express.urlencoded());
app.use(cookieParser());

// use layouts
const expressLayouts=require('express-ejs-layouts');
const { default: mongoose } = require('mongoose');
app.use(expressLayouts);


// extract style and scripts from subpages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


// use static
app.use(express.static('./assets'));


// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

//middleware for session
// mongo store is used to store session db
app.use(session({
        name:'codeial',
        // TODO change secret before deployment in production mode
        secret:'blahsomething',
        saveUninitialized:false,
        resave:false,
        cookie:{
            maxAge: (1000*60*100), // 1sec*60*100
        },
        store:MongoStore.create( // session gets permanenntly stored even if server expires
            {
                mongoUrl:'mongodb://localhost:27017/codeial_development',   
                autoRemove:'disabled'
            },
            function(err){
                console.log(err || "connect-mongodb set up ok");
            }
        )
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser); // checks if a cookie is present and sends user data to local


//  use routes
app.use('/',require('./routes'));



// running engine
app.listen(port,function(err){
    if(err){
        console.log(`Error: ${err}`);
        return;
    }
    console.log(`server is running on port:${port}`);
})