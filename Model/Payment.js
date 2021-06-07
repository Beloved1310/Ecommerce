const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    data: {
      id: Number,
      tx_ref: String,
      amount: Number,
      currency: String,
      created_at: String,
      customer: {
        id: Number,
        name: String,
        email: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
