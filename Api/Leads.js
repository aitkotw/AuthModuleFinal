const express = require("express");
const passport = require('passport')
const bcrypt = require("bcryptjs");

// Initialize Router
const router = express.Router();

// Load Admin Model
const Leads = require("../model/Leads");

// Load Input validation
const autoDataValidator = require("./../validation/autoValidateInput");


// @route   GET /products
// @desc    Get All the products
// @access  Private
router.get( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    try {
        await Leads.find({vendor:req.user._id}, (err, result) => {
            if(!err){
                return res.status(200).json(result)
            } else{
                return res.status(400).json({erro :'Unable to fetch data'})
            }
        });
    } catch (error) {
        res.status(500).json({error:'Server Error'})
    }

});

// @route   POST /products
// @desc    Create a new vendor
// @access  Private
router.post( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    expectedBodyData = ['name', 'phone', 'address', 'altPhone']
    requiredFields = ['name', 'phone']
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //const { errors, isValid } = validateVendorDetails(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const addProduct = new Leads({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        altPhone: req.body.altPhone,
        vendor: req.user._id,
    })

    try {
        addProduct.save({}, (err, doc) =>{
            if(!err){
                return res.status(200).json(doc);
            } else {
                return res.status(400).json({error:'Unable to save Data'});
            }
        })
    } catch (error) {
        return res.status(500).json({error:'Server Error'})
    }
    
});


// @route   PUT su/vendor/
// @desc    Update Vendor Data
// @access  Private
router.put( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{

    expectedBodyData = ['name', 'phone', 'address', 'altPhone', '_id']
    requiredFields = ['name', 'phone', '_id'] 
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    } 

    const updateLeads = new Leads({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        altPhone: req.body.altPhone,
        vendor: req.user._id,
    })

    try {
        await Leads.findByIdAndUpdate(req.body._id, updateLeads, (err, result) => {
            if(!err){
                return res.status(200).json(result);
            } else {
                return res.status(400).json({error:'Unable to update Data'});
            }
        })
    } catch (error) {
        return res.status(500).json({error:'Server Error'})
    }
    
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

    try {
        await Leads.findOneAndRemove({_id:req.body._id, vendor: {$eq:req.user._id}}, (err, result) => {
            if(!err){
                return res.status(200).json({message: 'Data Deleted Successfully'});
            } else {
                return res.status(400).json({error: 'Something Went Wrong'});
            }
        })
    } catch (error) {
        return res.status(500).json({error:'server error'})
    }
    
});



module.exports = router;
