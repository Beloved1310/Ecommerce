const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
    name: {
      type: String,
    },
    price: {
      type: String,
    },
    quantity: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
