const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ServiceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sDate: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
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

module.exports = Service = mongoose.model("services", ServiceSchema);
