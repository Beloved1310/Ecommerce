const bcrypt = require('bcrypt');
const User = require('../../Model/User');
const newPassword = require('../../validation/newPassword');

module.exports = async (req, res) => {
  const { value, error } = newPassword(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });
  const { link, resetPassword } = value;
  const user = await User.findOne({ resetLink: link });
  if (!user) return res.status(422).send({ error: 'Try Again' });

  const hashedPassword = await bcrypt.hash(resetPassword, 12);

  user.password = hashedPassword;
  user.resetLink = '';

  user.save();
  const data = { resetPassword };
  return res.send({ message: 'Password Updated', data });
};
