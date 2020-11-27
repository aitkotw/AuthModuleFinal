const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CustomerSchema = new Schema({
  cardno: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  }, 
  address: {
    type: String,
    required: true,
  },
  custType: {
    type: String,
    required: true,
  },
  altPhone: {
    type: String,
  },
  gst: {
    type: String,
  },
  dob: {
    type: String,
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref : 'Users'
  },
  date: {
    type : Date, 
    default: Date.now
  },
});

module.exports = Customers = mongoose.model("customers", CustomerSchema);
