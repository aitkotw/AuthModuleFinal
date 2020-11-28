const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RenewalSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  rDate: {
    type: String,
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref : 'Users',
    required: true,
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref : 'Users',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Renewals = mongoose.model("renewals", RenewalSchema);
