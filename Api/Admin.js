const express = require("express");
const passport = require('passport')
const bcrypt = require("bcryptjs");

// Initialize Router
const router = express.Router();

// Load Admin Model
const User = require("../model/Users");

// Load Input validation
const autoDataValidator = require("./../validation/autoValidateInput");


// @route   GET su/vendor/
// @desc    Get All the Vendors
// @access  Private
router.get( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    try {
        await User.find({role:'vendor'}, (err, result) => {
        if(!err){
            res.status(200).json(result)
        } else{
            //console.log(err)
            res.status(400).json({error:'Unable to fetch Data'})
        }
    });
    } catch (error) {
        res.status(500).json({error:'Server Error'})
    }
    
});

// @route   POST su/vendor
// @desc    Create a new vendor
// @access  Private
router.post( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    expectedBodyData = ['name', 'email', 'password', 'phone']
    requiredFields = ['name', 'email', 'password', 'phone']
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //const { errors, isValid } = validateVendorDetails(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    try {
        await User.findOne({email: req.body.email}, (err, result) => {
            if(!err){
                if(result){
                    return res.status(400).json({error: 'Email already Exists'});
                }

                const addVendor = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    phone: req.body.phone,
                    role: 'vendor',
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(addVendor.password, salt, (err, hash) => {
                    if (err) throw err;
                    addVendor.password = hash;
                    addVendor.save({}, (err, doc) =>{
                            if(!err){
                                return res.status(200).json(doc);
                            } else {
                                return res.status(400).json({error:'Unable to create user'});
                            }
                        })
                    });
                });

            } else {
                return res.status(400).json({error: 'Something Went Wrong'});
            }
        })
    } catch (error) {
        res.status(500).json({error:'Server Error'})
    }

    
});


// @route   PUT su/vendor/
// @desc    Update Vendor Data
// @access  Private
router.put( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{

    expectedBodyData = ['name', 'email', 'phone', '_id']
    requiredFields = ['_id'] 
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    } 

    await User.find({$or:[{_id: req.body._id},{email: req.body.email}]}, async (err, result) => {
        if(!err){
            if(result.length > 1){
                return res.status(400).json({error: 'Email already Exists'});
            }

            const updateVendor = ({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
            })

            await User.findByIdAndUpdate(req.body._id, updateVendor, (err, result) => {
                if(!err){
                    return res.status(200).json(result);
                } else {
                    return res.status(400).json({error:'Unable to update User'});
                }
            })
        } else {
            return res.status(400).json({error: 'Something Went Wrong'});
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

    try {
        await User.findByIdAndRemove(req.body._id, (err, result) => {
            if(!err){
                return res.status(200).json({message: 'Data Deleted Successfully'});
            } else {
                return res.status(400).json({error: 'Unable to Delete User'});
            }
        })
    } catch (error) {
        res.status(500).json({error:'Something Went Wrong'})
    }


});


// @route   POST su/vendor/
// @desc    Update Vendor Status
// @access  Private
router.patch( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{

    expectedBodyData = ['_id', 'status']
    requiredFields = ['_id', 'status'] 
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);
    
    if (!isValid) {
        return res.status(400).json(errors);
    } 

    const activateVendor = ({
        isActive: req.body.status,
    })

    try {
        await User.findByIdAndUpdate(req.body._id, activateVendor, (err, doc) => {
            if(!err){
                return res.status(200).json(doc);
            } else {
                return res.status(400).json({error: 'Unable to activate/deactivate user'});
            }
        })
    } catch (error) {
        res.status(500).json({error:'Something Went Wrong'})
    }

});


module.exports = router;
