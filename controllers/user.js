const User=require('../models/user');

exports.getUserById=(req,res,next,id)=>{ 
    User.findById(id,function(err,user){
        if(err || !user){
            return res.status(400).json({
                error:'user does not find'
            })
        }

        req.profile=user;
        next();
    })
}


exports.getUser=(req,res)=>{
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
}


exports.getSaleList=(req,res)=>{
return res.json(req.profile.sale)
}
