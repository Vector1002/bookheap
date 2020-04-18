const mongoose=require('mongoose');
const { ObjectId } = mongoose.Schema;
const User=require('./user'); 

const favouriteSchema=new mongoose.Schema(
{
    products:{
        type:ObjectId,
        ref:'Product',
        required:true
    },
    user:{
        type:ObjectId,
        ref:'User'
    }
},{
    timestamps:true
}

)


module.exports = mongoose.model("Favourite", favouriteSchema);
