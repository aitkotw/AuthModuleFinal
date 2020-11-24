const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("./../config/keys");

// Initialize Router
const router = express.Router();

// Load Admin Model
const User = require("../model/Users");

// Load Input validation
const autoDataValidator = require("./../validation/autoValidateInput");
const Users = require("../model/Users");

// @route   GET api/users/register
// @desc    Register a User
// @access  Public
router.post("/register", (req, res) => {
    expectedBodyData = ['name', 'email', 'password', 'phone', 'role']
    requiredFields = ['name', 'email', 'password', 'phone']
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);
    
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        errors.email = "Email already Exists";
        return res.status(400).json(errors);
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          phone: req.body.phone,
          role: req.body.role,
        });
  
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });
      }
    });
  });

  // @route   GET api/users/login
  // @desc    Returning The token
  // @access  Public
  router.post("/login", (req, res) => {
    // //Check Validation
    expectedBodyData = ['email', 'password']
    requiredFields = ['email', 'password']
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    const email = req.body.email;
    const password = req.body.password;
  
    //Find the User By Email
    User.findOne({ email }).select('_id email +password').then((user) => {
      //Check for User
      if (!user) {
        errors.email = "Invalid Username/Password";
        return res.status(404).json(errors);
      }  
      //Check Password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {  
          const payload = { id: user.id, name: user.name };
          // Sign Token
          jwt.sign(payload, keys.secretKey, { expiresIn: 3600 }, (err, token) => {
            res.json({
              sucess: true,
              token: `Bearer ${token}`,
            });
          });
        } else {
          errors.password = "Invalid Username/Password";
          return res.status(400).json(errors);
        }
      }).catch((err) => console.log(err));
    });
  });

// @route   GET api/users/login
// @desc    Returning The token
// @access  Public

// router.get('/all', (req, res) => {
//     Users.find((err, doc) => {
//         if(!err){
//             return res.status(400).json(doc);
//         }
//     })
// })


  module.exports = router;