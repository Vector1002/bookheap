const express= require('express');
const router=express.Router();

const { 
     getProductById,
}=require('../controllers/product');

const {addFavourites,getFavourites}=require('../controllers/favourites')
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

router.param('userId',getUserById);
router.param('productId',getProductById);

router.post('/addfavorites/:userId/:productId',isSignedIn,isAuthenticated,addFavourites);

router.get("/favorites/:userId",isSignedIn,isAuthenticated,getFavourites);


// router.delete(
//     "/favorites/:productId/",
//     isSignedIn,
//     isAuthenticated,
//     deleteFavourites
//   );


module.exports=router;
