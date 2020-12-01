const express = require("express");
const passport = require('passport')
const bcrypt = require("bcryptjs");

// Initialize Router
const router = express.Router();

// Load Admin Model
const Payments = require("../model/Payments");

// Load Input validation
const autoDataValidator = require("./../validation/autoValidateInput");


// @route   GET /products
// @desc    Get All the products
// @access  Private
router.get( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    try {
        await Payments.find({vendor:req.user._id}, (err, result) => {
            if(!err){
                res.status(200).json(result)
            } else{
                // console.log(err)
                return res.status(400).json({error:'Unable to fetch data'})
            }
        });
    } catch (error) {
        return res.status(500).json({error:'Server Error'})
    }
    
});

// @route   POST /products
// @desc    Create a new vendor
// @access  Private
router.post( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    expectedBodyData = ['name', 'pDate', 'amount', 'purpose']
    requiredFields = ['name', 'pDate', 'amount', 'purpose']
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //const { errors, isValid } = validateVendorDetails(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const addPayment = new Payments({
        name: req.body.name,
        pDate: req.body.pDate,
        amount: req.body.amount,
        purpose: req.body.purpose,
        vendor: req.user._id,
    })

    try {
        addPayment.save({}, (err, doc) =>{
            if(!err){
                return res.status(200).json(doc);
            } else {
                return res.status(400).json({error:'unable to save data'});
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

    expectedBodyData = ['name', 'pDate', 'amount', 'purpose', '_id']
    requiredFields = ['name', 'pDate', 'amount', 'purpose', '_id'] 
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    } 

    const updatePayment = ({
        name: req.body.name,
        pDate: req.body.pDate,
        amount: req.body.amount,
        purpose: req.body.purpose,
        vendor: req.user._id,
    })

    try {
        await Payments.findByIdAndUpdate(req.body._id, updatePayment, (err, result) => {
            if(!err){
                return res.status(200).json(result);
            } else {
                return res.status(400).json({error:'Unable to update data'});
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
        await Payments.findOneAndRemove({_id:req.body._id, vendor: {$eq:req.user._id}}, (err, result) => {
            if(!err){
                return res.status(200).json({message: 'Data Deleted Successfully'});
            } else {
                return res.status(400).json({error: 'Something Went Wrong'});
            }
        })
    } catch (error) {
        return res.status(500).json({error:'Server Error'})
    }
    
});

module.exports = router;
