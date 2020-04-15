const Product=require('../models/product');
const User=require('../models/user');
const fs = require('fs');
const formidable = require('formidable');

exports.getProductById=(req,res,next,id)=>{ 

    Product.findById(id,function(err,product){
        if(err || !user){
            return res.status(400).json({
                error:'Product not found'
            })
        }
        req.product=product;
        next();
    })
}


exports.createProduct=(req,res,next)=>{

    let form =new formidable.IncomingForm();
    form.keepExtensions=true;


    form.parse(req, (err, fields, file) => {

        // console.log(fields);
        if (err) {
            return res.status(400).json({
              error: "problem with image"
            });
          }
          //destructure the fields
          const { name, description, price } = fields;
      
          if (!name || !description || !price) {
            return res.status(400).json({
              error: "Please include all fields"
            });
          }
      
          let product = new Product(fields);
      
          //handle file here
          if (file.photo) {
            if (file.photo.size > 3000000) {
              return res.status(400).json({
                error: "File size too big!"
              });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
          }
          // console.log(product);
      
          //save to the DB
          product.save((err, product) => {
            if (err) {
              res.status(400).json({
                  err:err,
                error: "Saving tshirt in DB failed"
              });
            }else{
            let sale=[]
                sale.push({
                    id:product._id,
                   name,
                   description,
                   price
                    });
    
    
              User.findByIdAndUpdate(
                { _id: req.profile._id },
                { $push: { sale: sale } },
                { new: true },
                (err, sale) => {
                  if (err) {
                    return res.status(400).json({
                      error: "Unable to save purchase list"
                    });
                  }
                  return res.status(200).json(product)
                }
              );
            }
           
          });

        
    });
}


exports.getProduct=(req,res)=>{
    req.product.photo = undefined;
    return res.json(req.product);
}


exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to delete the product"
        });
      }
      res.json({
        message: "Deletion was a success",
        deletedProduct
      });
    });
  };

  exports.getAllProducts=(req,res)=>{
    Product.find()
    .select("-photo")
    .populate("upload",'name email phoneNo')
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "NO product FOUND"
        });
      }
      console.log("fadsfas",products)
      res.json(products);
    });
  }


  