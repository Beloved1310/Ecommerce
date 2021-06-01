const jwt = require('jsonwebtoken');
const { ACCTIVATION_KEY } = require('../../config');
const activatePassword = require('../../validation/activatePassword');
const activationData = require('../../utilis/emailActivation');

module.exports = async (req, res) => {
  const { value, error } = activatePassword(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });
  const { token } = value;

  const decodedToken = jwt.verify(token, ACCTIVATION_KEY);
  const { email } = decodedToken;

  activationData(email, req);

  return res.status(200).send({ message: 'Email Activated', data: null });
};
