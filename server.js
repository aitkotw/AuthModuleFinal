// Import Packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const helmet = require('helmet');
var fs = require('fs')
var path = require('path')
const morgan = require('morgan')

// Import Files
const db = require("./config/keys").mongoURI;
const Auth = require("./admin/Auth");
const Vendor = require("./admin/Vendor");

// Initialize Express 
var app = express();
var port = process.env.PORT || 4000;

// Write log to file
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// Add Middlewares
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined',  { stream: accessLogStream }))

//Database Connection
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if(!err){
        console.log('Connection Success')
    } else{
        console.log(err)
    }
});

// Add Passport
app.use(passport.initialize());
require("./config/passport.js")(passport); // Passport Config

// API Routes
app.use("/su/auth", Auth);
app.use("/su/vendor", Vendor);

// START THE SERVER
app.listen(port, () => {
    console.log(`Application Running on http://localhost:${port}`);
  });
