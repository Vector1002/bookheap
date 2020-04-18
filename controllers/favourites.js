const User=require('../models/user');
const Product=require('../models/product');

exports.addFavourites =(req,res)=>{

    const { name, description, price } = req.product;


    let purchase={}
    purchase.id=req.product._id,
    purchase.name=name,
    purchase.description= description,
    purchase.price=price   
    //  purchase.push({
    //     id:req.product._id,
    //    name,
    //    description,
    //    price
    //     });

      // console.log("qqqqssssssfdasf",purchase);

      User
      .find({_id:req.profile._id})
      .find({purchase:purchase})
      .then(pur=>{
        if(pur.length){
          console.log("Fdsaf");
            return res.status(400).json({
              error:'Already favourite'
            })
      }else{
        User.findByIdAndUpdate(
          { _id: req.profile._id },
          { $push: { purchase: purchase } },
          { upsert: true },
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

      }).
      catch(err=>{
        console.log(err);
      })

      

  
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