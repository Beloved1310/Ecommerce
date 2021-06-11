const Order = require('../../Model/Order');

module.exports = async (req, res) => {
  const data = await Order.find({});
  return res.send({ message: 'Order', data });
};
