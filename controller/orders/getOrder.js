const Order = require('../../Model/Order');

module.exports = async (req, res) => {
  const data = await Order.find({ 'user._id': req.user._id });

  if (!data) return res.status(404).send({ error: 'Order Not Found' });

  return res.send({ message: 'Your Order', data });
};
