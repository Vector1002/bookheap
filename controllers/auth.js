const User =require('../models/user')
const { validationResult } = require('express-validator');
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup=(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array()[0].msg });
    }

    const newUser=new User(req.body);

    User
    .findOne({email:req.body.email})
    .then(user =>{
        if(user){
            return res.status(422).json({error:'Email already exits'})
        }
        else{
            newUser
            .save()
            .then(user=>{
                return res.status(200).json(user);
            })
            .catch(err=>{
                return res.status(400).json({
                    error: "NOT able to save user in DB"
                  });
            });
        }
    })
    .catch(err=>{
        return res.status(400).json({
            error: "NOT able to save user in DB"
          });
    });
}




exports.signin=(req,res)=>{
    const errors=validationResult(req.body);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }

      User
      .findOne({email})
      .then(user =>{
          if(!user){
              return res.status(400).json({error:'User does not exits. Please Sign up first!'})
          }
         

          if (!user.autheticate(password)) {
            return res.status(401).json({
              error: "Email and password do not match"
            });
          }

          const token = jwt.sign({ _id: user._id }, process.env.SECRET);
          //put token in cookie
          res.cookie("token", token, { expire: new Date() + 9999 });
      
          //send response to front end
          const { _id, name, email } = user;
          return res.json({ token, user: { _id, name, email} });
      })
      .catch(err=>{
        return res.status(400).json({
            error: "User does not exits. Please Sign up first!"
          });
      });

}


exports.signout=(req,res)=>{
    res.clearCookie('token');
    res.json({
        msg:"User signout successfully"
    });
}

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
  });


  exports.isAuthenticated=(req,res,next)=>{
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({error:"ACCESS DENIED"});
    }
    next()
  }

  


