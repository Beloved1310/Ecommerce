const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema(
  
  {
   _id: mongoose.Schema.Types.ObjectId,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    shippingAddress: {
      // fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      // lat: Number,
      // lng: Number,
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // seller: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    usse: Object,
  },
  

 {timestamps: true}
);



module.exports = mongoose.model('Order', OrderSchema);