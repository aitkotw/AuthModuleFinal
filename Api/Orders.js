const express = require("express");
const passport = require('passport')

// Initialize Router
const router = express.Router();

// Load Admin Model
const Orders = require("../model/Orders");

// Load Input validation
const ordersValidator = require("./../validation/validateOrders");


// @route   GET /products
// @desc    Get All the products
// @access  Private
router.get( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    try {
        await Orders.find({vendor:req.user._id}, (err, result) => {
            if(!err){
                res.status(200).json(result)
            } else{
                // console.log(err)
                return res.status(400).json({error:'Unable to fetch Data'})
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
    expectedBodyData = ['billno', 'orderDate', 'customer']
    requiredFields = ['billno', 'orderDate', 'customer']
    const { errors, isValid } = ordersValidator(req.body, expectedBodyData, requiredFields);

    //const { errors, isValid } = validateVendorDetails(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const addOrders = new Orders({
        billno: req.body.billno,
        orderData: req.body.orderData,
        customer: req.body.customer,
        items: req.body.items,
        vendor: req.user._id,
    })
    console.log(addOrders)

    try {
        addOrders.save({}, (err, doc) =>{
            if(!err){
                return res.status(200).json(doc);
            } else {
                return res.status(400).json(err);
            }
        })
    } catch (error) {
        return res.status(500).json({error:'Server Error'})
    }
    
});


// @route   PUT su/vendor/
// @desc    Update Vendor Data
// @access  Private
//********************************************This is not Working Need to update individual order item */
// router.put( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{

//     expectedBodyData = ['billno', 'orderDate', 'customer', 'items', '_id']
//     requiredFields = ['_id', 'billno', 'orderDate', 'customer'] 
//     const { errors, isValid } = ordersValidator(req.body, expectedBodyData, requiredFields);

//     //Check Validation
//     if (!isValid) {
//       return res.status(400).json(errors);
//     } 

//     const updateOrders = new Orders({
//         billno: req.body.billno,
//         orderData: req.body.orderData,
//         customer: req.body.customer,
//         items: req.body.items,
//         vendor: req.user._id,
//     })        

//     await Orders.findByIdAndUpdate(req.body._id, updateOrders, (err, result) => {
//         if(!err){
//             return res.status(200).json(result);
//         } else {
//             return res.status(400).json(err);
//         }
//     })
// });


// @route   DELETE su/vendor/
// @desc    Delete Single Vendor
// @access  Private
router.delete( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{

    expectedBodyData = ['_id']
    requiredFields = ['_id'] 
    const { errors, isValid } = ordersValidator(req.body, expectedBodyData, requiredFields);
    
    if (!isValid) {
        return res.status(400).json(errors);
    } 

    try {
        await Orders.findOneAndRemove({_id:req.body._id, vendor: {$eq:req.user._id}}, (err, result) => {
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
