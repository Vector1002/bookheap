const User=require('../models/user');
const Product=require('../models/product');

exports.addFavourites =(req,res)=>{

    const { name, description, price } = req.product;

    let purchase=[]
    purchase.push({
        id:req.product._id,
       name,
       description,
       price
        });


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


exports.getFavourites =(req,res)=>{
  let fav=[];

  req.profile.purchase.map((pro,index)=>{

    Product.findById({_id:pro.id})
    .select("-photo")
    .populate("upload",'name email phoneNo')
    .then(prod=>{
      fav.push(prod)
      if(req.profile.purchase.length === index+1){
        return res.status(200).json(fav)
      }
    })

  })
}

// exports.deleteFavourites =(req,res)=>{
    
// }