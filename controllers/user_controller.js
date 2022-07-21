const User=require('../models/user'); // acquiring user from db
const fs=require('fs');
const path=require('path');


module.exports.profile=async function(req,res){
    let user=await User.findById(req.params.id);

    let usersFriendships;
    if(req.user){
        usersFriendships = await User.findById(req.user._id).populate({ 
           path : 'friendships',
           options :  { sort: { createdAt: -1 } },
           populate : {
               path: 'from_user to_user'
           }})
    }

    let isFriend=false;

    for(friendship of usersFriendships.friendships){
        if(friendship.from_user.id==user.id || friendship.to_user.id==user.id){
            isFriend=true;
            break;
        }
    }

        return res.render('user_profile',{
            title:"profile",
            profile_user:user,
            isFriend:isFriend
        });
}

module.exports.update= async function(req,res){
    if(req.user.id==req.params.id){
        try{
            let user=await User.findById(req.params.id);
            
            // cannot access req.body directly . Multer has to be used
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log("**** Multer error");
                    return res.redirect('back');
                }
                user.name=req.body.name;
                user.email=req.body.email;
                if(req.file){
                    
                    // if user already contains image then delete it 
                    if(user.avatar && fs.existsSync(path.join(__dirname,'..',user.avatar))){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    // path of this file is save in user avatar in userSchema
                    user.avatar=path.join(User.avatarPath,req.file.filename);
                }
                user.save();
                return res.redirect('back');
            });
        }
        catch(err){
            req.flash('error',"Wrong");
            return res.redirect('back');
        }
    }else{
        req.flash('error','Unauthorized');
        return res.status('401').send('Unauthorized');
    }
}

// render sign in page
module.exports.signUp=function(req,res){
    // if logged in sign up page should not get open
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('user_sign_up',{
        title:"codeial|Sign Up",
    });
}

// render sign in page
module.exports.signIn=function(req,res){
    // if logged in sign up page should not get open
    if(req.isAuthenticated()){
        return res.redirect('/');
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
    req.flash('success','Hello Buddy')
        return res.redirect('/');  // index home page
};

module.exports.destroySession=function(req,res,next){
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success','Bye Buddy')
        return res.redirect('/');
    });
};