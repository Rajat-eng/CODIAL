const express=require('express');
const router=express.Router();

const homeController=require('..//controllers/home_controller')
router.get('/',homeController.home);
router.use('/users',require('./users'));
//  for any further routes other than / use routes.use()
module.exports=router;