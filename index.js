const express= require('express');
const app=express();
require('./config/view_helpers')(app);


// environment
const env=require('./config/environment');
const logger=require('morgan');
// cookies
const cookieParser=require('cookie-parser');

const port=8000;
const db=require('./config/mongoose');
const path=require('path');

// layouts
const expressLayouts=require('express-ejs-layouts');

// passport
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const MongoStore=require('connect-mongo');


// chat server
const http = require('http');
const chatServer = http.createServer(app);
const chatSockets=require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000, () => {
  console.log('chat Server listening on :5000');
});



// session cookies
const session=require('express-session'); // create session cookie in encrypred form

// SASS
const sassMiddleware=require('node-sass-middleware');
const flash=require('connect-flash');
const customMware=require('./config/middleware');

if(env.name=='development'){
    app.use(sassMiddleware({
        src:path.join(__dirname,env.asset_path,'scss'),
        dest:path.join(__dirname,env.asset_path,'css'),
        debug:true,
        outputStyle:'extended',
        prefix:'/css'
      })
      );
}


// parser use
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

// use layouts
app.use(expressLayouts);


// extract style and scripts from subpages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


// use static
app.use(express.static(env.asset_path));

// make uploads path available 
app.use('/uploads',express.static( path.join(__dirname,'uploads')) );

// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

//middleware for session
// mongo store is used to store session db
app.use(session({
        name:'codeial',
        // TODO change secret before deployment in production mode
        secret:env.session_cookie_key,
        saveUninitialized:false,
        resave:false,
        cookie:{
            maxAge: (1000*60*30), // 1sec*60
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
app.use(flash());
app.use(customMware.setFlash);

// use morgan
app.use(logger(env.morgan.mode,env.morgan.options));

//  use routes
app.use('/',require('./routes'));

// running engine
app.listen(port,function(err){
    if(err){
        console.log(`Error: ${err}`);
        return;
    }
    console.log(`server is running on port:${port}`);
});



