const User=require('../models/user');
const Product=require('../models/product');

exports.addFavourites =(req,res)=>{


    let purchase=[]
    purchase.push(req.product._id );

      User
      .findOne({_id:req.profile._id})
      .then(user=>{
        if(user.purchase.includes(req.product._id)){
            return res.status(200).json({
              error:'Already in your favourites list'
            })
      }else{
        User.findByIdAndUpdate(
          { _id: req.profile._id },
          { $push: { purchase: purchase } },
          { new: true },
          (err, user) => {
            if (err) {
              return res.status(400).json({
                error: "Unable to save purchase list"
              });
            }
            return res.status(200).json(user)
          }
        );
      }

      })
      .catch(err=>{
        return res.status(200).json({
          err:'Some error ocuured'
        });
      })
}


exports.getFavourites =(req,res,next)=>{
  let fav=[];


  User
  .findOne({_id:req.profile._id})
  .populate({
    path: 'purchase',
    populate: { path: 'upload' }
  })
  .then(user=>{
    return res.status(200).json(user.purchase);
  })
  .catch(err=>{
    return res.status(200).json({
      err:'Some error ocuured'
    });
  })
}


exports.deleteFavourites =(req,res)=>{

        User
      .updateOne( 
        {_id: req.profile._id}, 
        { $pull: {purchase: req.product._id } } 
      )
      .then( user => {
        return res.status(200).json({
          msg:'Succesfully removed from ypur favourites list'
        })
      })
      .catch(err=>{
        return res.status(200).json({
          err:'Some error occured'
        });
      })
}
