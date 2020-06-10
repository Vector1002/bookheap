const Product=require('../models/product');
const User=require('../models/user');
const fs = require('fs');
const formidable = require('formidable');

exports.getProductById=(req,res,next,id)=>{ 

    Product.findById(id,function(err,product){
        if(err || !product){
            return res.status(400).json({
              err:err,
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

      if (err) {
        console.log(err);
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
                sale.push( product._id);
    
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

exports.getPhoto=(req,res,next)=>{
  // console.log(req.product)
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
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
      res.json(products);
    });
  }


  