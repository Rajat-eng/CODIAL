const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const AVATAR_PATH=path.join('/uploads/users/avatars');
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    avatar:{
        // contains path of avatar user.avatar= AVATAR_PATH +'/'+ filename
        type:String,
    }
},{
    // account created and updated timestamps
    timestamps:true 
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH)); // __dirname is this file, .. is for accessing avatar path
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
// static methods
userSchema.statics.uploadedAvatar=multer({ storage: storage }).single('avatar'); // we are only sending single file 
userSchema.statics.avatarPath=AVATAR_PATH;  // making AVATAR_PATH publicly available


const User=mongoose.model('User',userSchema);
module.exports=User;