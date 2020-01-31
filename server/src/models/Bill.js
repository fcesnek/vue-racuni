const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  payer: {
    name: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  description: {
    type: String
  },
  cost: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  billNumber: {
    type: String,
    required: true,
  },
  isPaidFor: {
    type: Boolean,
    default: false,
    required: true,
  }
});
module.exports = mongoose.model('Bill', billSchema);
