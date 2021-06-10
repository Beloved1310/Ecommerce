/* eslint camelcase: "off" */

const Order = require('../../Model/Order');
const webhookValidation = require('../../validation/webhookValidation');
const Payment = require('../../Model/Payment');
const { MY_HASH } = require('../../config');

module.exports = async (req, res) => {
  const { value, error } = webhookValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });
  const { data } = value;
  const hash = req.headers['verify-hash'];
  if (hash !== MY_HASH) return res.send(401, 'Unauthorized User');
  if (data.status !== 'successful') return res.status(400).send();

  await Order.updateOne({ orderNumber: value.data.tx_ref }, { isPaid: true });

  await Payment.create({
    data,
  });

  return res.status(200).send();
};
