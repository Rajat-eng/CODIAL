// module.exports.actionName=function(req,res){};

const Post=require ('../models/post');
const User=require('../models/user');

module.exports.home= async function(req,res){
    // populate gives user object {id,name,email ..}
    try{
        let posts=await Post.find({})
        .populate('user')
        .populate({
            path:'comments', // comments on post from post schema
            populate:{
                path:'user' // user who has commmented from comment schema
            }
        });
        
        let users= await User.find({});
    
        return res.render('home',{
            title:"codeial|Home",
            posts:posts,
            all_users:users,
        });
    }catch(err){
        console.log("Error",err);
        return;
    }
};
