const Post=require('../models/post');
const Comment=require('../models/comment');


module.exports.create=function(req,res){
    Post.create({
        content:req.body.content,
        user:req.user._id
    },function(err,post){
        if(err){console.log("cannot create post"); return;}
        return res.redirect('back');
    });
};

module.exports.destroy=function(req,res){
    Post.findById(req.params.id,function(err,post){
        // ideally user.id should be user._id but user.id works bcoz it is converted into string by mongoose
        //post.user is accessed in post schema which is userID and req.user.id
        if(post.user==req.user.id){ // only user who has posted can delete it
            post.remove();
            Comment.deleteMany({post:req.params.id},function(err){
                return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }
    })
};