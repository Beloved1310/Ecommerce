const Order = require('../../Model/Order');
const webhookValidation = require('../../validation/webhookValidation');
const Payment = require('../../Model/Payment');
const { MY_HASH } = require('../../config');

module.exports = async (req, res) => {
  const { value, error } = webhookValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const hash = req.headers['verify-hash'];
  if (hash !== MY_HASH) return res.send(401, 'Unauthorized User');

  await Order.updateOne({}, { isPaid: true });
  const { data, status, message } = value;
  const createdWebhook = await Payment.create({
    status,
    message,
    data,
  });
  return res.send({ message: 'Transaction Successful', data: createdWebhook });
};
