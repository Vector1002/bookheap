const User=require('../models/user');
const Product=require('../models/product');

exports.addFavourites =(req,res)=>{

    const { name, description, price } = req.product;


    let purchase={}
    purchase.id=req.product._id,
    purchase.name=name,
    purchase.description= description,
    purchase.price=price   
      User
      .find({_id:req.profile._id})
      .find({purchase:purchase})
      .then(pur=>{
        if(pur.length){
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

exports.deleteFavourites =(req,res)=>{

  User.findOne({_id: req.profile._id}, function (error, data) {
      if (error) {
         return res.status(400).json({error:'Not able to removed from DB'});
      } else if (data) {
          var records = {'records': data};
          console.log("ddssssd",data.purchase);

          function search(nameKey, myArray){
            console.log('je',nameKey,myArray.length)
            for (var i=0; i < myArray.length; i++) {
                if (  JSON.stringify(myArray[i].id) === JSON.stringify( nameKey)) {
                    return i;
                }
            }
        }

          var idx = data.purchase ? search(req.product.id, data.purchase) : -1;

          if (idx !== -1) {
              data.purchase.splice(idx, 1);
              data.save(function(error) {
                  if (error) {
                      console.log(error);
                      return res.status(400).json({
                        error:'Not removed from DB some error occured'
                      });
                  } else {
                    console.log("FDSAfasdf",records)
                      res.status(200).json({
                        msg:'Suucessfully removed from Favourites'
                      });
                  }
              });
              return;
          }
      }
      
      return res.status(400).json({
        error:'Not removed from DB some error occured'
      });
      })
}

    // data.purchase.map((pur,index)=>{
    //   console.log("fdasf",pur)

    //       if( JSON.stringify(pur.id)==JSON.stringify(req.product._id) ){
    //         pur.purchase.pull({ id: req.product._id }) // removed
    //   console.log("fdsafdasf",pur)
    //         return res.status(200)
    //       }


    //     })