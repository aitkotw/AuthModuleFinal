const express = require("express");
const passport = require('passport')
const bcrypt = require("bcryptjs");

// Initialize Router
const router = express.Router();

// Load Admin Model
const Customer = require("../model/Customers");

// Load Input validation
const autoDataValidator = require("./../validation/autoValidateInput");


// @route   GET /products
// @desc    Get All the products
// @access  Private
router.get( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    await Customer.find({vendor:req.user._id}, (err, result) => {
        if(!err){
            res.status(200).json(result)
        } else{
            console.log(err)
        }
    });
});

// @route   POST /products
// @desc    Create a new vendor
// @access  Private
router.post( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    expectedBodyData = ['name', 'cardno', 'phone', 'address', 'email', 'dob', 'gst', 'altPhone', ]
    requiredFields = ['name', 'cardno', 'phone', 'address']
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //const { errors, isValid } = validateVendorDetails(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    
    const addCustomer = new Customer({
        cardno: req.body.cardno,
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        email: req.body.email,
        dob: req.body.dob,
        gst: req.body.gst,
        altPhone: req.body.altPhone,
        vendor: req.user._id,
    })

    addCustomer.save({}, (err, doc) =>{
        if(!err){
            return res.status(200).json(doc);
        } else {
            return res.status(400).json(err);
        }
    })

});


// @route   PUT su/vendor/
// @desc    Update Vendor Data
// @access  Private
router.put( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{

    expectedBodyData = ['name', 'cardno', 'phone', 'address', 'email', 'dob', 'gst', 'altPhone', '_id']
    requiredFields = ['name', 'cardno', 'phone', 'address', '_id']
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    } 

    const updateProduct = ({
        cardno: req.body.cardno,
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        email: req.body.email,
        dob: req.body.dob,
        gst: req.body.gst,
        altPhone: req.body.altPhone,
        vendor: req.user._id,
    })

    await Customer.findByIdAndUpdate(req.body._id, updateProduct, (err, result) => {
        if(!err){
            return res.status(200).json(result);
        } else {
            return res.status(400).json(err);
        }
    })

});


// @route   DELETE su/vendor/
// @desc    Delete Single Vendor
// @access  Private
router.delete( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{

    expectedBodyData = ['_id']
    requiredFields = ['_id'] 
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);
    
    if (!isValid) {
        return res.status(400).json(errors);
    } 

    await Customer.findOneAndRemove({_id:req.body._id, vendor: req.user._id}, (err, result) => {
        if(!err){
            return res.status(200).json({Message: 'Data Deleted Successfully'});
        } else {
            return res.status(400).json({Error: 'Something Went Wrong'});
        }
    })
});



module.exports = router;
