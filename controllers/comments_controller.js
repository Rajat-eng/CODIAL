const Comment=require('../models/comment');
const Post=require('../models/post');


module.exports.create=function(req,res){
    Post.findById(req.body.post,function(err,post){ // name in type hidden
        if(post){
            Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:post._id,
            },function(err,comment){

                post.comments.push(comment);
                post.save(); // update and lock it
                return res.redirect('/');
            });
        }
    });
}
