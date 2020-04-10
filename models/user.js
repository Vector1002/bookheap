const mongoose=require('mongoose');
const uuidv1 = require("uuid/v1")
const crypto = require("crypto");

var userschema=new mongoose.Schema(
 {
    name:{
        type:String,
        trim:true,
        required:true
    },
    lastname:{
        type:String,
        trim:true,
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    userinfo:{
        type:String,
        trim:true
    },
    phoneNo:{
        type:Number,
        required:true,
    },
    salt: String,
    encry_password:{
        type:String,
        required:true,
    },
    purchase:{
        type: Array,
        default: []
    },
     sale:{
        type: Array,
        default: []
    }
 },
 {timestamps:true}

);

userschema
  .virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function() {
    return this._password;
  });

userschema.methods = {

  autheticate: function(plainpassword) {
    
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function(plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports= mongoose.model('User', userschema);






