const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ServiceCompletedSchema = new Schema({
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
  amount: {
    type: String,
    required: true,
  },
  doneBy: {
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

module.exports = ServiceCompleted = mongoose.model("servicecompleted", ServiceCompletedSchema);
