const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const VendorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select:false
  }, 
  phone: {
    type: String,
    required: true,
  }, 
  dbName: {
    type: String,
    required: true,
  }, 
  isActive: {
    type: String,
    default: false
  }, 
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Vendor = mongoose.model("vendor", VendorSchema);
