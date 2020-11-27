const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sr_no: {
    type: String,
    required: true,
  },
  hsn: {
    type: String,
    required: true,
  }, 
  warranty: {
    type: String,
    required: true,
  }, 
  amount: {
    type: String,
    required: true,
  },
  tax: {
    type: String,
    required:true,
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref : 'Users'
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Products = mongoose.model("products", ProductSchema);
