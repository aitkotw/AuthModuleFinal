const express = require("express");
const passport = require('passport')

// Initialize Router
const router = express.Router();

// Load Link Model
const Links = require("../model/LinkGen");

// Load Input validation
const autoDataValidator = require("./../validation/autoValidateInput");

// @route   GET /products
// @desc    Get All the products
// @access  Private
router.get( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    try {
        await Links.find({vendor:req.user._id}, (err, result) => {
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

    expectedBodyData = ['phone']
    requiredFields = ['phone']
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    } 

    // Create a function for link genration.
    let timestamp = new Date().getTime().toString()
    encodedString = Buffer.from(timestamp).toString('base64')

    const addLink = new Links({        
        vendor: req.user._id,
        vName: req.user.name,
        phone: req.body.phone,
        ref: encodedString
    })

    try {
        addLink.save({}, (err, doc) =>{
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
        await Links.findOneAndRemove({_id:req.body._id, vendor: {$eq:req.user._id}}, (err, result) => {
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


// @route   DELETE su/vendor/
// @desc    Delete Single Vendor    
// @access  Private
router.get( "/validation", passport.authenticate("jwt", { session: false }), async (req, res) =>{

    expectedBodyData = ['ref']
    requiredFields = ['ref'] 
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    if (!isValid) {
        return res.status(400).json(errors);
    } 

    try {
        await Links.findOne({vendor:req.user._id, ref: req.body.ref}, (err, doc) => {
            if(!err){
                if(doc!== null){
                    //Validate the time with one day
                    if(doc.expire.getTime() > new Date().getTime() == true){
                        return res.status(200).json({status: 'True', name : doc.vName})
                    } else {
                        return res.status(200).json({status: 'False', error : "Expired"})
                        //TODO: Remove the link from DB
                    }                    
                } else {
                    return res.status(200).json({status: 'False', error: "Invalid"})
                }
            } else {
                return res.status(400).json({error: 'Something Went Wrong'});
            }
        })
    } catch (error) {
        return res.status(500).json({error:'server error'})
    }
   
});


//Send SMS to customer


module.exports = router;
