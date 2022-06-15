const express=require('express');
const router=express.Router();

const homeController=require('..//controllers/home_controller')
router.get('/',homeController.home);
//  for any further routes other than / use routes.use()
router.use('/users',require('./users'));

module.exports=router;