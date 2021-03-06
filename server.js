// Import Packages
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const helmet = require('helmet');
var fs = require('fs')
var path = require('path')
const morgan = require('morgan')

// Import Files
const database = require('./config/setDatabase')
const isAdmin = require('./config/middlewares/ensureIsAdmin')
const Auth = require("./Api/Auth")
const Admin = require("./Api/Admin")
const Products = require("./Api/Products")
const Customers = require("./Api/Customers")
const Orders = require("./Api/Orders")
const Payments = require("./Api/Payments")
const Services = require("./Api/Service")
const Renewals = require("./Api/Renewals")
const Leads = require("./Api/Leads")
const Links = require("./Api/LinkGen")


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
app.use(database)

// Add Passport
app.use(passport.initialize());
require("./config/passport.js")(passport); // Passport Config

// API Routes
app.all('/api/su/*',passport.authenticate("jwt", { session: false }), isAdmin);
app.use("/api/su/vendor", Admin);
app.use("/api/auth", Auth);
app.use("/api/products", Products);
app.use("/api/customers", Customers);
app.use("/api/orders", Orders);
app.use("/api/payments", Payments);
app.use("/api/services", Services);
app.use("/api/renewals", Renewals);
app.use("/api/leads", Leads);
app.use("/api/links", Links);

// START THE SERVER
app.listen(port, () => {
    console.log(`Application Running on http://localhost:${port}`);
  });
