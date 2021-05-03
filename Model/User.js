const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      
    },

    email: {
      type: String,
      
    },
    password: {
      type: String, 
    },
    resetLink: {
      date:String,
      default:''
    },
  }, 
);

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY);
  return token;
};

module.exports = mongoose.model('User', UserSchema);