const Order = require('../../Model/Order');

module.exports = async (req, res) => {
  const data = await Order.find({ 'user._id': req.params.id });
  return res.send({ message: 'Order', data });
};
