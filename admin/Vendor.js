const express = require("express"); // call express
const router = express.Router(); // get an instance of the express Router
const passport = require("passport");

// Validation
const validateVendorDetails = require("./../validation/vendorDetials");
const autoDataValidator = require("./../validation/autoValidateInput")

// Modals
const Vendor = require("../model/Vendor");

// @route   GET su/vendor/
// @desc    Get All the Vendors
// @access  Private
router.get( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    await Vendor.find((err, result) => {
        if(!err){
            res.status(200).json(result)
        } else{
            console.log(err)
        }
    });
});

// @route   POST su/vendor
// @desc    Create a new vendor
// @access  Private
router.post( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{

    expectedBodyData = ['name', 'email', 'phone', 'dbname']
    requiredFields = ['name', 'email', 'phone', 'dbname']
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //const { errors, isValid } = validateVendorDetails(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    await Vendor.findOne({$or:[{email: req.body.email},{dbName: req.body.dbname}]}, (err, result) => {
        if(!err){
            if(result){
                return res.status(400).json({Message: 'Email already Exists'});
            }

            const addVendor = new Vendor({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                dbName: req.body.dbname,
            })

            addVendor.save({}, (err, doc) =>{
                if(!err){
                    return res.status(200).json(doc);
                } else {
                    return res.status(400).json(err);
                }
            })
        } else {
            return res.status(400).json({Message: 'Something Went Wrong'});
        }
    })
});


// @route   PUT su/vendor/
// @desc    Update Vendor Data
// @access  Private
router.put( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{

    expectedBodyData = ['name', 'email', 'phone', 'dbname', '_id']
    requiredFields = ['_id'] 
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    } 

    await Vendor.find({$or:[{_id: req.body._id},{email: req.body.email}]}, async (err, result) => {
        if(!err){
            if(result.length > 1){
                return res.status(400).json({Message: 'Email already Exists', Data: result.length});
            }

            const updateVendor = ({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
            })

            await Vendor.findByIdAndUpdate(req.body._id, updateVendor, (err, result) => {
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

    await Vendor.findByIdAndRemove(req.body._id, (err, result) => {
        if(!err){
            return res.status(200).json({Message: 'Data Deleted Successfully'});
        } else {
            return res.status(400).json({Error: 'Something Went Wrong'});
        }
    })
});

module.exports = router;
