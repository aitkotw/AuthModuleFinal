const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const LeadsSchema = new Schema({
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
  },
  altPhone: {
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

module.exports = Leads = mongoose.model("leads", LeadsSchema);
