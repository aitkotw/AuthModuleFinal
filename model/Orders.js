const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ItemSchema = new Schema({
    product: {
        type:Schema.Types.ObjectId,
        ref: 'products',
        required:true
    },
    name: {
        type:String,
        required:true
    },
    hsn: {
        type:String,
        required:true
    },
    qty:{
        type:Number,
        required:true,
    },
    warranty:{
        type:Number,
        required:true,
    },
    amt:{
        type:String, 
        required:true,       
    }
})

const OrdersSchema = new Schema({
  billno: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref : 'Users'
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref : 'Customers'
  }, 
  items: {
    type: [ItemSchema],
    required: true,
  }, 

});

module.exports = Orders = mongoose.model("orders", OrdersSchema);
