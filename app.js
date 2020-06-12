require("dotenv").config();

const express=require('express');
const app=express();
var morgan=require('morgan');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const cors=require('cors');
var path=require('path');

morgan('tiny');


//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const favouritesRoute = require("./routes/favourites");

mongoose
.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((e)=>{
    console.log(e);
  });


  // app.get('/',(req,res)=>{
  //   console.log('ddd')
  // });

  //middlewares
  app.use(bodyParser.json());
  app.use(cors());
  app.use(cookieParser());

  ///myRoutes
  app.use('/api',authRoutes);   
  app.use('/api',userRoutes);   
  app.use('/api',productRoutes);   
  app.use('/api',favouritesRoute);   


  if(process.env.NODE_ENV=='production'){
    // console.log('jeee',__dirname);
    app.use(express.static('/build'));
    // app.use(express.static(path.join(__dirname, 'build')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname+'/build/index.html'));
    });
  }


  const PORT=process.env.PORT || 8000;

  app.listen(PORT,()=>{
      console.log(`App is running on port ${PORT}`)
  })