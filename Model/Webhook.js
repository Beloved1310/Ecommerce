const mongoose = require('mongoose');
 const WebtokenSchema = new mongoose.Schema({
 status: String,
 data : {
   id: Number,
   amount: Number,
   customer: {
     id: Number,
     name: String,
     email: String
   },
 }});

module.exports = mongoose.model('Webtoken', WebtokenSchema);