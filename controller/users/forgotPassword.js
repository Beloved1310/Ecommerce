const jwt = require('jsonwebtoken');
const User = require('../../Model/User');
const { FORGOT_PASSWORD } = require('../../config');
const forgetPassword = require('../../validation/forgetPassword');
const mailData = require('../../utilis/forgotpassword');

module.exports = async (req, res) => {
  const { value, error } = forgetPassword(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const { email } = value;
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .send({ error: 'User with this email does not exists' });

  const token = jwt.sign({ _id: user._id }, FORGOT_PASSWORD, {
    expiresIn: '20m',
  });
  const update = await User.updateOne({ resetLink: token });
  if (!update)
    return res.status(400).send({ error: 'reset password link error' });

  mailData(email, token, req);

  const data = { email };
  return res.send({
    message: 'Email has been sent, kindly follow the instructions',
    data,
  });
};
