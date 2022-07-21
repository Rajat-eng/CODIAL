const express=require('express');
const passport = require('passport');
const router=express.Router();

const homeController=require('../controllers/home_controller');


console.log('router loaded');


router.get('/',passport.checkAuthentication,homeController.home);
router.use('/users',require('./users'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));
router.use('/accounts',require('./accounts'));
router.use('/likes',require('./likes'));
router.use('/friends',require('./friends'));
router.use('/api', require('./api'));

// for any further routes, access from here
// router.use('/routerName', require('./routerfile));

module.exports=router;