const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../Model/User');
const { ACTIVATION_KEY } = require('../../config');
const signUpValidate = require('../../validation/signupValidation');
const emailData = require('../../utilis/activation');

module.exports = async (req, res) => {
  const { value, error } = signUpValidate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const { fullname, email, password, gender } = value;

  const createdUser = new User({
    fullname,
    email,
    password,
    gender,
  });

  const user = await User.findOne({ email });
  if (user) return res.status(400).send({ error: 'User already registered' });
  const salt = await bcrypt.genSalt(10);
  createdUser.password = await bcrypt.hash(createdUser.password, salt);
  const savedUser = await createdUser.save();
  if (!savedUser) return res.status(422).send({ error: 'Unsaved User' });

  const token = jwt.sign({ email }, ACTIVATION_KEY);
  const sendEmail = emailData(email, token, req);

  if (!sendEmail) return res.send({ error: error.message });
  const data = { fullname, email };
  return res.send({
    message: 'Email has been sent, kindly activate your email',
    data,
  });
};
