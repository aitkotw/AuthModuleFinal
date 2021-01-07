const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const LinkSchema = new Schema({
  vendor: {
    type: Schema.Types.ObjectId,
    ref : 'Users'
  },
  vName: {
    type: String,
    required:true
  },
  phone:{
    type: String,
    required: true
  },
  ref: {
    type: String,
    required: true,
  },
  date: {
    type : Date, 
    default: Date.now
  },
  expire: {
    type : Date, 
    default: () => new Date(+new Date() + 1*24*60*60*1000)
  },
});

module.exports = Leads = mongoose.model("links", LinkSchema);
