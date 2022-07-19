const Like=require('../models/like');
const Post=require('../models/post');
const Comment=require('../models/comment');


module.exports.toggleLike= async function(req,res){
    
    try{

        // likes/toggle/id=a4dsd&type=Post

        let likeable;
        let deleted=false;

        if(req.query.type=='Post'){
            likeable=await Post.findById(req.query.id).populate('likes'); // array of likes in post
        }else{ 
            likeable=await Comment.findById(req.query.id).populate('likes');  // array of likes in comment
        }

        // check if like already exists
        let existingLike=await Like.findOne({
            user:req.user._id, // user
            likeable:req.query.id, // id of post or comment
            onModel:req.query.type  // model is post or comment
        });

        if(existingLike){
           // delete existing like
            likeable.likes.pull(existingLike._id);
            likeable.save();
            await existingLike.remove();
            deleted=true;
        }else{
           //make a new like
           let newLike=await Like.create({
            user:req.user._id,
            likeable:req.query.id,
            onModel:req.query.type
           });

           likeable.likes.push(newLike._id);
           likeable.save();
        }

        return res.json(200,{
            message:'success',
            data:{
                deleted:deleted,
                likeableId:req.query.id,
                type:req.query.type
            }
        });
        
        //return res.redirect('back');

    }catch(err){
        console.log(err);
        return res.json(500,{
            message:'Internal Server Error'
        })
    }
}