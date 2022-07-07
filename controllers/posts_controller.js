const Post=require('../models/post');
const Comment=require('../models/comment');


module.exports.create=async function(req,res){
    try{
        let post=await Post.create({
            content:req.body.content,
            user:req.user._id
        });

        if(req.xhr){
            post =  await post.populate('user','name');
            return res.status(200).json({
                data:{
                    post:post,
                },
                message:"Post created"
            });
        }
        
        req.flash('success','post created');
        return res.redirect('back');
    }catch(err){
        req.flash('error',err);
        return;
    }
};

module.exports.destroy=async function(req,res){
    try{
        let post=await Post.findById(req.params.id);
        // ideally user.id should be user._id but user.id works bcoz it is converted into string by mongoose
        //post.user is accessed in post schema which is userID and req.user.id
        if(post.user==req.user.id){ // only user who has posted can delete it
            post.remove();
            await Comment.deleteMany({post:req.params.id});
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id,
                    },
                    message:"Post Deleted"
                });
            }
            req.flash('success','post and assocaited comments deleted');
            return res.redirect('back');
        }else{
            req.flash('error','you cannot delete this post');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error',err);
        return;
    }
   
};