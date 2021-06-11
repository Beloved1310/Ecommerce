const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    user: {
      _id: mongoose.Types.ObjectId,
      fullname: String,
      email: String,
    },
    products: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    delivery: {
      address: String,
      city: String,
      postalCode: Number,
      country: String,
    },
    totalPrice: Number,
    orderNumber: String,
    paymentMethod: String,
    shippingPrice: Number,
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
