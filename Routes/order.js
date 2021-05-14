const mongoose = require('mongoose');
const axios = require('axios');
const express = require('express');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();
const { SECRET_KEY, SECRETKEY, MY_HASH } = require('../config');
const Payment = require('../Model/Payment');
const Product = require('../Model/Products');
const Order = require('../Model/Order');
const auth = require('../middleware/auth');

// ....................pass order id
router.get(
  '/order/:id',
  auth,
  asyncMiddleware(async (req, res) => {
    const data = await Order.findById(req.params.id).populate('product');
    if (data) {
      res.send({ message: 'Order', data });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

// ...................pass user token
// ...................see my purchase product
router.get(
  '/order/user/mine',
  auth,
  asyncMiddleware(async (req, res) => {
    const data = await Order.find({ user: req.user._id }).populate(
      'user',
      'fullname email -_id'
    );
    res.send({ message: 'Order Made', data });
  })
);

router.post(
  '/order',
  auth,
  asyncMiddleware(async (req, res) => {
    const headers = {
      authorization: SECRET_KEY,
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    };
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      req.body,
      { headers }
    );
    const responseLink = response.data;
    const {
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    const existProduct = Product.findById(req.body.productId);
    if (!existProduct) {
      res.status(404).send({ message: 'Product not found' });
    } else {
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        user: req.user._id,
      });
      const createdOrder = await order.save();
      const data = {
        order: createdOrder._id,
        responseLink,
      };
      res.status(201).send({
        message: 'New Order Created',
        data,
      });
    }
  })
);

router.post(
  '/webhook/details',
  asyncMiddleware(async (req, res) => {
    const hash = req.headers['verify-hash'];
    if (hash !== MY_HASH) {
      res.send(401, 'Unauthorized User');
    } else {
      const { data, status, message } = req.body;
      const createdWebhook = await Payment.create({
        status,
        message,
        data,
      });
      res.send({ message: 'Transaction Stored', data: createdWebhook });
    }
  })
);

router.get(
  '/verify/flutterwave/verify/:ref',
  asyncMiddleware(async (req, res) => {
    const {ref} = req.params;
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${ref}/verify/`,
      {
        headers: {
          authorization: SECRETKEY,
          'content-type': 'application/json',
          'cache-control': 'no-cache',
        },
      }
    );

    if (response.data.status === 'success') {
      await Order.updateOne({}, { isPaid: true });
      res.send({ message: 'Paid', data: response.data });
    } else {
      res.send({ message: 'Transaction not Verified' });
    }
  })
);

module.exports = router;
