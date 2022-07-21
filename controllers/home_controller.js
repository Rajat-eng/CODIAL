// module.exports.actionName=function(req,res){};

const Post=require ('../models/post');
const User=require('../models/user');

module.exports.home= async function(req,res){
    // populate gives user object {id,name,email ..}
    try{
        let posts=await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments', // comments on post from post schema
            populate:{
                path:'user likes' // user who has commmented from comment schema
            },
        }).populate('likes');
        
        let users= await User.find({});
        let usersFriendships;

        if(req.user){
            // user should be logged in
            usersFriendships=await User.findById(req.user._id).populate({
                path:'friendships',
                populate:{
                    path:'from_user to_user'
                }
            });
        }
        return res.render('home',{
            title:"codeial|Home",
            posts:posts,
            all_users:users,
            myUser:usersFriendships
        });

    }catch(err){
        console.log("Error",err);
        return;
    }
};
