const Order = require('../../Model/Order');

module.exports = async (req, res) => {
  const data = await Order.findById(req.params.id);

  if (!data) return res.status(404).send({ error: 'Order Not Found' });
  return res.send({ message: 'Order', data });
};
