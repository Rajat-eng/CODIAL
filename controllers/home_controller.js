// module.exports.actionName=function(req,res){};

const Post=require ('../models/post')

module.exports.home=function(req,res){

    // populate gives user object {id,name,email ..}
    Post.find({})
    .populate('user')
    .populate({
        path:'comments', // commnets on post  from post schema
        populate:{
            path:'user' // user who has commmented from comment schema
        }
    })
    .exec(function(err,posts){
        return res.render('home',{
            title:"codeial|Home",
            posts:posts,
        });
    });
};
