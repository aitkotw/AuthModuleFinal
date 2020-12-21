const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PaymentsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  order_id: {
    type: Schema.Types.ObjectId,
    ref : 'Orders',
    required: true
  },
  pDate: {
    type: String,
    required: true,
  },
  amount:{
    type:String,
    required:true
  },
  purpose:{
      type:String,
      required:true
  },
  status:{
    type:String,
    default:'pending'
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

module.exports = Payments = mongoose.model("payments", PaymentsSchema);
