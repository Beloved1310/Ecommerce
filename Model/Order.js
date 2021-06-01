const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    user: {},
    products: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    delivery: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    totalPrice: Number,
    orderNumber: String,
    paymentMethod: { type: String },
    shippingPrice: { type: Number },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
