const express= require('express');
const router=express.Router();

const { 
     getProductById,
    createProduct,
    getProduct,
    deleteProduct,
    getAllProducts
}=require('../controllers/product');

const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById,getSaleList } = require("../controllers/user");

router.param('userId',getUserById);
router.param('productId',getProductById);

router.post('/product/create/:userId',isSignedIn,isAuthenticated,createProduct);

router.get("/product/:productId", getProduct);

router.get('/sale/product/:userId',isSignedIn,isAuthenticated,getSaleList);

router.delete(
    "/product/:prodductId/:userId",
    isSignedIn,
    isAuthenticated,
    deleteProduct
  );


  router.get("/products", getAllProducts);

module.exports=router;
