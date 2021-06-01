const bcrypt = require('bcrypt');

const User = require('../../Model/User');
const loginValidate = require('../../validation/loginValidate');

module.exports = async (req, res) => {
  const { value, error } = loginValidate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });
  const { email, password } = value;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).send({ error: 'username or password not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(404).send({ error: 'username or password not found ' });

  const token = user.generateAuthToken();
  res.header('x-auth-token', token);
  const data = { email, token };
  return res.send({ message: 'Login Successful', data });
};
