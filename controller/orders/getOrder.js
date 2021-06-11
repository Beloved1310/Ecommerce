const Order = require('../../Model/Order');

module.exports = async (req, res) => {
  const data = await Order.find({ 'user._id': req.user._id });

  return res.send({ message: 'Your Order', data });
};
