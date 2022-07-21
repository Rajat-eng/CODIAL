const User=require('../../../models/user');

const jwt=require('jsonwebtoken');

const env=require('../../../config/environment');



module.exports.createSession=async function(req,res){ 
    try{
        let user=await User.findOne({email:req.body.email});
        if(!user || user.password!=req.body.password){
            res.json(401,{
                message:"Invalid Username or password"
            });
        }
        return res.json(200,{
            message:"sign in successfull, here is your token",
            data: {
                token: jwt.sign(user.toJSON(),env.jwt_secret_key,{expiresIn:100000}) 
            }
        })
    }catch(err){
        console.log('*******',err);
        return res.json(500,{
            message:"Internal Server Error",
        });
    }
};







