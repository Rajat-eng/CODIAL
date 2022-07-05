const Comment=require('../models/comment');
const Post=require('../models/post');


module.exports.create=async function(req,res){
    try{
        let post=await Post.findById(req.body.post);
        if(post){ // if post exist
            let comment=await Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:req.body.post,
            });
            post.comments.push(comment);
            post.save(); // update and lock it
            req.flash('success','comment added to the post');
            return res.redirect('/');
        }
    }catch(err){
        req.flash('error',err)
    }
    
}

module.exports.destroy= async function(req,res){
    try{
        let comment=await Comment.findById(req.params.id);
        let post=await Post.findById(comment.post);
        if(comment.user==req.user.id || post.user==req.user.id){ // if user who has commented also has logged in  
            let postId=comment.post; // extract post id on which comment is made before deleteting comment
            comment.remove();
            let post=await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});
            req.flash('success','comment deleted from the post');
            return res.redirect('back'); // pull out id from list of coomets in post schema
        } else{
            req.flash('error','you cannot delete the comment');
            return res.redirect('back');
        }
    }catch(err){
        console.log("Error",err);
    }
}
