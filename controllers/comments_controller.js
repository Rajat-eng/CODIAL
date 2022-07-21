const Comment=require('../models/comment');
const Post=require('../models/post');
const Like=require('../models/like');
const commentsMailer=require('../mailers/comments_mailer');
const commentEmailWorker=require('../workers/comment_email_worker');
const queue = require('../config/kue');


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


            comment=await comment.populate('user','name email');

            
            // commentsMailer.newComment(comment);
            let job=queue.create('emails',comment).save(function(err){
            // create queue for processing comments
                if(err){
                    console.log('err in creating queue',err);
                    return;
                }
                console.log('jon enqued',job.id);
            });

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment:comment
                    },
                    message:"Comment created"
                })
            }
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
            await Like.deleteMany({likeable:comment._id,onModel:'Comment'});
            comment.remove();
            let post=await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }

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
