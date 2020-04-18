require("dotenv").config();

const express=require('express');
const app=express();
var morgan=require('morgan');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const cors=require('cors');

morgan('tiny');


//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const favouritesRoute = require("./routes/favourites");

mongoose
.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  });


  app.get('/',(req,res)=>{
    res.send('<h1>dfasfa</h1>');
  });

  //middlewares
  app.use(bodyParser.json());
  app.use(cors());
  app.use(cookieParser());

  ///myRoutes
  app.use('/api',authRoutes);   
  app.use('/api',userRoutes);   
  app.use('/api',productRoutes);   
  app.use('/api',favouritesRoute);   



  const PORT=process.env.PORT;

  app.listen(PORT,()=>{
      console.log(`App is running on port ${PORT}`)
  })