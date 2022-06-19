const Comment=require('../models/comment');
const Post=require('../models/post');


module.exports.create=function(req,res){
    Post.findById(req.body.post,function(err,post){ // req.body.name is in type hidden home.ejs
        if(err){
            console.log("cannot find post");
            return;
        }
        if(post){ // if post exist
            Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:post._id,
            },function(err,comment){
                if(err){
                    console.log("cannot add comment");
                    return;
                }
                post.comments.push(comment);
                post.save(); // update and lock it
                return res.redirect('/');
            });
        }
    });
}
