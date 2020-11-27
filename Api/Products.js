const express = require("express");
const passport = require('passport')
const bcrypt = require("bcryptjs");

// Initialize Router
const router = express.Router();

// Load Admin Model
const Product = require("../model/Products");

// Load Input validation
const autoDataValidator = require("./../validation/autoValidateInput");


// @route   GET /products
// @desc    Get All the products
// @access  Private
router.get( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    await Product.find({vendor:req.user._id}, (err, result) => {
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
    expectedBodyData = ['name', 'sr_no', 'hsn', 'warranty', 'amount', 'tax']
    requiredFields = ['name', 'sr_no', 'hsn', 'warranty', 'amount', 'tax']
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //const { errors, isValid } = validateVendorDetails(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    await Product.findOne({$and:[{name:req.body.name}, {vendor: req.user._id}]}, (err, result) => {
        if(!err){
            if(result){
                return res.status(400).json({Message: 'Product name already Exists'});
            }

            const addProduct = new Product({
                name: req.body.name,
                sr_no: req.body.sr_no,
                hsn: req.body.hsn,
                warranty: req.body.warranty,
                amount: req.body.amount,
                tax: req.body.tax,
                vendor: req.user._id,
            })

            addProduct.save({}, (err, doc) =>{
                if(!err){
                    return res.status(200).json(doc);
                } else {
                    return res.status(400).json(err);
                }
            })

        } else {
            return res.status(400).json({Error: 'Product Already Exits'});
        }
    })
});


// @route   PUT su/vendor/
// @desc    Update Vendor Data
// @access  Private
router.put( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{

    expectedBodyData = ['name', 'sr_no', 'hsn', 'warranty', 'amount', 'tax', '_id']
    requiredFields = ['_id'] 
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    } 

    await Product.find({$and:[{name:req.body.name}, {vendor: req.user._id}, {_id:{$not:{$eq:req.body._id}}}]}, async (err, result) => {
        if(!err){
            if(result.length > 0){
                return res.status(400).json({Message: 'Product already Exists'});
            }

            const updateProduct = ({
                name: req.body.name,
                sr_no: req.body.sr_no,
                hsn: req.body.hsn,
                warranty: req.body.warranty,
                amount: req.body.amount,
                tax: req.body.tax,
                vendor: req.user._id,
            })
        
            await Product.findByIdAndUpdate(req.body._id, updateProduct, (err, result) => {
                if(!err){
                    return res.status(200).json(result);
                } else {
                    return res.status(400).json(err);
                }
            })
           
        } else {
            return res.status(400).json({Message: 'Something Went Wrong'});
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

    await Product.findOneAndRemove({_id:req.body._id, vendor: {$eq:req.user._id}}, (err, result) => {
        if(!err){
            return res.status(200).json({Message: 'Data Deleted Successfully'});
        } else {
            return res.status(400).json({Error: 'Something Went Wrong'});
        }
    })
});



module.exports = router;
