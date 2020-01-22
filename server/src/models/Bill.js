const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  payerFullName: {
    type: String
  },
  street: {
    type: String
  },
  city: {
    type: String
  },
  description: {
    type: String
  },
  cost: {
    type: Number
  },
  month: {
    type: Number
  },
  year: {
    type: Number
  },
  isPaidFor: {
    type: Boolean,
    default: false
  }
});

module.exports.BillSchema = BillSchema;
