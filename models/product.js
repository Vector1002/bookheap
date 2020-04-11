const mongoose=require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema=new mongoose.Schema(
{
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength: 32
    },
    description:{
        type:String,
        trim:true,
        maxlength: 2000

    },
    price:{
        type: Number,
        required: true,
        trim: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    upload:{
        type: ObjectId,
        ref: "User",
        required: true
    }
},{
    timestamps:true
}

)


module.exports = mongoose.model("Product", productSchema);
