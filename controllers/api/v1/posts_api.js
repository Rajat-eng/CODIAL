const Post=require('../../../models/post');
const Comment=require('../../../models/comment');

const { json } = require('express');

module.exports.index= async function(req,res){

    let posts=await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments', // comments on post from post schema
            populate:{
                path:'user' // user who has commmented from comment schema
            }
        });
    
    return res.json(200,{
        message:"List of posts",
        posts:posts
    })
}


module.exports.destroy=async function(req,res){
    try{
        let post=await Post.findById(req.params.id);
        // ideally user.id should be user._id but user.id works bcoz it is converted into string by mongoose
        //post.user is accessed in post schema which is userID and req.user.id

         if(post.user==req.user.id){ // only user who has posted can delete it

            post.remove();
            await Comment.deleteMany({post:req.params.id});

            // if(req.xhr){
            //     return res.status(200).json({
            //         data:{
            //             post_id:req.params.id,
            //         },
            //         message:"Post Deleted"
            //     });
            // }
            
            return res.json(200,{
                message:"Post Deleted"
            });

            
        }else{
            return res.json(401,{
                message:"You cannot delete this post"
            })
        }
    }catch(err){
        return res.json(500,{
            message:"Internal Server Error"
        });
    }
   
};

