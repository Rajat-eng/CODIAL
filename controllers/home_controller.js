// module.exports.actionName=function(req,res){};

const Post=require ('../models/post');
const User=require('../models/user');
module.exports.home=function(req,res){
    // populate gives user object {id,name,email ..}
    Post.find({})
    .populate('user')
    .populate({
        path:'comments', // comments on post from post schema
        populate:{
            path:'user' // user who has commmented from comment schema
        }
    })
    .exec(function(err,posts){
        User.find({},function(err,users){
            return res.render('home',{
                title:"codeial|Home",
                posts:posts,
                all_users:users,
            });
        })   
    });
};
