const express=require('express');
const router=express.Router();
const { check } = require('express-validator');
const {signup,signin,signout}=require('../controllers/auth')

router.post('/signup', [
    check('name','Name should be atleast 3 character long').isLength({ min: 3 }),
    check('email',"Email is required").isEmail(),
    check('password','Password must be at least 3 char ').isLength({ min: 6 }),
    check('phoneNo','Enter valid phone number').isLength({min:10,max:10})
  ],
  signup
  );


  router.post(
    "/signin",
    [
      check("email", "email is required").isEmail(),
      check("password", "password field is required").isLength({ min: 1 })
    ],
    signin
  );

  router.get("/signout", signout);


module.exports=router;