const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;

const User=require('../models/user');

// authenticate using passport
passport.use(new LocalStrategy({
    usernameField:'email'
    },function(email,password,done){ // email & password is written password in form
        // find user and establish identity
        User.findOne({email:email},function(err,user){ 
            if(err){
                console.log("error in finding user");
                return done(err);
            }
            if(!user || user.password!=password){
                console.log('Invalid Username/password');
                return done(null,false); //no error but user is not found
            }
            return done(null,user);
        });
    })
);

// serializing the key to decide which key is to be kept in the cookies. determines which data of user object is stored in session

passport.serializeUser(function(user,done){
    done(null,user.id);
    // stored in req.session.passport.user = {id: 'xyz'}
});


// deserializing the user from the key in the cookies. this is to retirive key when again req is send 
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){ // output of serialize done
        if(err){
            console.log("error in finding user");
            return done(err);
        }
        return done(null,user);
    });
});

// check if user is authticated
passport.checkAuthentication=function(req,res,next){
    // if user is signed in pass on the function to next(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    // if user is not autheticated
    return res.redirect('/users/sign-in');

}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains current signed in user from session cookie and we are sending this to the locals for the views
        res.locals.user= req.user; 
    }
    next();
}

module.exports=passport;
