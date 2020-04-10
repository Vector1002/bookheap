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



  const PORT=process.env.PORT;

  app.listen(PORT,()=>{
      console.log(`App is running on port ${PORT}`)
  })