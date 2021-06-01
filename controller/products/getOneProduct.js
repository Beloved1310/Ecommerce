const Product = require('../../Model/Products');

module.exports = async (req, res) => {
  const data = await Product.findById(req.params.id);
  if (!data) return res.status(404).send({ error: 'Product Not Found' });

  return res.send({ message: 'Product', data });
};
