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
              error:'Already in favourites list'
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

  console.log("hell");

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

  User.findOne({_id: req.profile._id}, function (error, data) {
      if (error) {
         return res.status(400).json({error:'Not able to removed from DB'});
      } else if (data) {
          var records = {'records': data};

          function search(nameKey, myArray){
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
                      return res.status(400).json({
                        error:'Not removed from DB some error occured'
                      });
                  } else {
                      res.status(200).json({
                        msg:'Sucessfully removed from Favourites'
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