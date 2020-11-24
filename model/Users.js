const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
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
    select:false,
  }, 
  phone: {
    type: String,
    required: true,
  },
  isActive: {
    type: String,
    default: false
  }, 
  role: {
    type: String,
    required: true,
    select:false,
  }, 
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Users = mongoose.model("users", UserSchema);