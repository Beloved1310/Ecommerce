const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    txf_ref: String,
    mine: Array,
    _id: mongoose.Schema.Types.ObjectId,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    shippingAddress: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    paymentMethod: { type: String },
    itemsPrice: { type: Number },
    shippingPrice: { type: Number },
    taxPrice: { type: Number },
    totalPrice: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
