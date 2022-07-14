const express=require('express');
const router=express.Router();
const passport=require('passport');

const usersController= require('../controllers/user_controller');

router.get('/profile/:id',passport.checkAuthentication,usersController.profile);
router.post('/update/:id',passport.checkAuthentication,usersController.update)
router.get('/sign-in',usersController.signIn);
router.get('/sign-up',usersController.signUp);

router.post('/create',usersController.create); // sign up

//use passport as middleware to authenticate
router.post('/create-session',passport.authenticate( //sign in
    'local', // strategy
    {failureRedirect:'/users/sign-in'}
),usersController.createSession);

// logout
router.get('/sign-out',usersController.destroySession);


// google auth
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'users/sign-in'}),usersController.createSession);


module.exports=router;