const express=require('express');
const router=express.Router();

const friendsController=require('../controllers/friends_controller');
const passport=require('passport');

router.get('/toggle/',passport.checkAuthentication,friendsController.toggle);

module.exports=router;
