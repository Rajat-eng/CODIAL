const User=require('../models/user'); // acquiring user from db

module.exports.profile=function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title:"profile",
            profile_user:user,
        });
    })    
}
module.exports.update=function(req,res){
    // only logged in user can edit
    if(req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            return res.redirect('back');
        })
    }else{
        return res.status('401').send('Unauthorized');
    }
}

// render sign in page
module.exports.signUp=function(req,res){
    // if logged in sign up page should not get open
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title:"codeial|Sign Up",
    });
}

// render sign in page
module.exports.signIn=function(req,res){
    // if logged in sign up page should not get open
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title:"codeial|Sign In"
    });
}

// get sign-up data
module.exports.create=function(req,res){
   if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
   }
   User.findOne({email:req.body.email},function(err,user){
    if(err){
        console.log("User email already exists");
        return;
    }
    if(!user){
        User.create(req.body,function(err,user){
            if(err){ console.log("error in creating user"); return;}
            return res.redirect('/users/sign-in')
        });
    }else{
        return res.redirect('back');
    }

   });
};


// get sign-in data
module.exports.createSession=function(req,res){ 
   return res.redirect('/');
};

module.exports.destroySession=function(req,res,next){
    req.logout(function(err){
        if(err){
            return next(err);
        }
        return res.redirect('/');
    });
};