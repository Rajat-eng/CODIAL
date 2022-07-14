const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');



passport.use(new googleStrategy({
    clientID:'1063508045916-uq84svdj2aeo5er4amk6ci7llpiik8bh.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL:'http://localhost:8000/users/auth/google/callback',
},

    function(accessToken,refreshToken,profile,done){
        User.find({email:profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log('theek karle',err);
                return;
            }
            console.log(profile);
            if(user){
                return done(null,user);
            }else{
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex'),
                },function(err,user){
                    if(err){
                        console.log('theek karle',err);
                        return;
                    }
                    return done(null,user);
                })
            }
        });
    }
));


module.exports=passport;


