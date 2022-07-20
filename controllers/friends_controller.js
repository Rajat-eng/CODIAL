const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.toggle=async function(req,res){
    //frind/toggle/?userID 
    //userID is of user on which req is sent

    try{
        let toggledUser=await User.findById(req.user._id).populate('friendships');
        let ourUser=await User.findById(req.query.userID).populate('friendships');
    
        let friendship_op1=await Friendship.findOne({
            // current user has sent req to userID and are friends
            from_user:req.user._id,
            to_user:req.query.userID
        });
    
        let friendship_op2=await Friendship.findOne({
            // current user has recieved req to userID and are friends
            from_user:req.query.userID,
            to_user:req.user._id
        });

        let friendshipStatus=false;
    
        if(toggledUser){
             // if frienship exists
            if(friendship_op1){
                await toggledUser.friendships.pull(friendship_op1._id);
                await toggledUser.save();
                await ourUser.friendships.pull(friendship_op1._id);
                await ourUser.save();
                await friendship_op1.remove();
            }else if(friendship_op2){
                await toggledUser.friendships.pull(friendship_op2._id);
                await toggledUser.save();
                await ourUser.friendships.pull(friendship_op2._id);
                await ourUser.save();
                await friendship_op2.remove();
            }else{
                let newFriendship=await Friendship.create({
                    from_user:req.user._id,
                    to_user:req.query.userID
                });
                console.log(newFriendship._id);
                toggledUser.friendships.push(newFriendship._id);
                ourUser.friendships.push(newFriendship._id);
                toggledUser.save();
                ourUser.save();
                friendshipStatus=true;
            }
            
                return res.json(200,{
                    message:"Request Successfull",
                    data:{
                        friendshipStatus:friendshipStatus
                    }
                });
            //return res.redirect('back');
        }     
    }catch(err){
        console.log('error toggling friend',err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
    
}