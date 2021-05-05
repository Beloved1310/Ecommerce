const mongoose = require('mongoose');
 const PaymentSchema = new mongoose.Schema({
 status: String,
 message: String,

 data : {
   id: Number,
   amount: Number,
   currency : String,
   created_at : String,
   customer: {
     id: Number,
     name: String,
     email: String
   },
 }});

module.exports = mongoose.model('Payment', PaymentSchema);