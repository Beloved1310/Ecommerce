const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required : true,
  },
  email: {
    type: String,
    required : true,
  },
  password: {
    type: String,
    required : true,
  },
  gender: String,
  age: Number,
  education : {
    grade: String,
    
  },
  experience: {
    position: String,
    company: String,
    location: String,
  },
  resetLink: {
    date: String,
    default: "",
  },
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id ,fullname: this._fullname,
    email: this.email}, process.env.JWT_KEY);
  return token;
};

module.exports = mongoose.model("User", UserSchema);
