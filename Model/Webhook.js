const mongoose = require('mongoose');
 const WebtokenSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Webtoken', WebtokenSchema);