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

module.exports.destroy= function(req,res){
    Comment.findById(req.params.id,function(err,comment){
        if(comment.user==req.user.id ){
            let postId=comment.post; // extract post id on which comment is made before deleteting comment
            comment.remove();
            Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},function(err,post){
                return res.redirect('back');
            }) // pull out id from list of coomets in post schema
        }else{
            return res.redirect('back');
        }
    })
}
