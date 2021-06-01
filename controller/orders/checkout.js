const User = require('../../Model/User');
const checkoutValidation = require('../../validation/checkoutValidation');
const flutterwavePayment = require('../../utilis/flutterwavePayment');
const Order = require('../../Model/Order');

module.exports = async (req, res) => {
  const { value, error } = checkoutValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });
  const { products, delivery } = value;

  const randomId = Math.random().toString(36).substring(2);
  const userDetail = await User.findOne({ _id: req.user._id }).select(
    'fullname email _id'
  );

  const sumTotal = value.products.reduce(
    (cumm, e) => cumm + e.price * e.quantity,
    0
  );

  const order = new Order({
    user: userDetail,
    orderNumber: randomId,
    products,
    delivery,
    totalPrice: sumTotal,
  });
  const createdOrder = await order.save();

  const paymentId = await flutterwavePayment(randomId, sumTotal, userDetail);

  const data = {
    user: userDetail,
    products: createdOrder.products,
    delivery: createdOrder.delivery,
    totalPrice: createdOrder.totalPrice,
    orderNumber: createdOrder.orderNumber,
    paymentId,
    isDelivered: createdOrder.isDelivered,
    deliveryDate: createdOrder.deliveredAt,
  };
  return res.status(200).send({
    message: 'New Order',
    data,
  });
};
