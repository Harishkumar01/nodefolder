const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser')
const expressvalidator = require('express-validator');
const fs = require('fs')
const cors = require('cors')


//db

mongoose.connect(process.env.uri,{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('DB connected'))

mongoose.connection.on('error',err => {
  console.log(`DB connection error: ${err.message}`);
});

//bring in routes

const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");


//apidocs
app.get('/',(req,res) => {
  fs.readFile('docs/apiDocs.json', (err,data) => {
    if(err) {
      return res.status(400).json({
        error: err
      })
    }
    const docs = JSON.parse(data);
    res.json(docs);
  })
})
//middlewares

//const myownmiddleware = (req,res,next) => {
//  console.log("Middleware Applied!");
//  next();
//}

app.use(morgan("dev"));
//app.use(myownmiddleware);

app.use(bodyparser.json())
app.use(cookieparser())
app.use(expressvalidator())
app.use(cors());
app.use("/",postRoutes);
app.use("/",authRoutes);
app.use("/",userRoutes);
app.use(function (err,req,res,next){
  if(err.name === "UnauthorizedError") {
    res.status(401).json({error: "Unauthorized User!"});
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`A node js api is listening on port : ${port}`);
});