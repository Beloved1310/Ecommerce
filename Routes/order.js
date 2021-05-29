/* eslint consistent-return: "off" */
/* eslint-disable camelcase */

// const mongoose = require('mongoose');
const axios = require('axios');
// const multer = require('multer');
const express = require('express');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();
const { SECRET_KEY, SECRETKEY, MY_HASH } = require('../config');
const Payment = require('../Model/Payment');
// const User = require('../Model/User');
// const Product = require('../Model/Products');
const Order = require('../Model/Order');
const auth = require('../middleware/auth');
// const cloudinary = require('../utilis/cloudinary');
// const storage = require('../utilis/multer');

// const upload = multer({ storage });

// const newOrder = require('../validation/newOrder');
const Webhook = require('../validation/Webhook');

// ....................pass order id
router.get(
  '/order/:id',
  auth,
  asyncMiddleware(async (req, res) => {
    const data = await Order.findById(req.params.id).populate('orderId');

    if (!data) return res.status(404).send({ error: 'Order Not Found' });
    res.send({ message: 'Order', data });
  })
);

// ...................pass user token
// ...................see my purchase product

router.post(
  '/checkout',
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      req.body.delivery = JSON.parse(req.body.delivery);
    } catch (e) {
      req.body.delivery = {};
    }
    // const { error } = newOrder(req.body);
    // if (error) return res.status(400).send({ error: error.details[0].message });
    const { name, price, quantity, delivery } = req.body;
    console.log(req.body);

    const order = new Order({
      products: [{ quantity, name, price }],
      delivery,
    });
    const createdOrder = await order.save();
    res.status(200).send({
      message: 'New Order',
      createdOrder,
    });
  })
);

// router.post(
//   '/checkout',
//   auth,
//   upload.single('image'),
//   asyncMiddleware(async (req, res) => {
//     try{

//       req.body.delivery = JSON.parse(req.body.delivery)
//     }catch(e){
//       req.body.delivery = {}

//     }
//     const { error } = newOrder(req.body);
//     if (error) return res.status(400).send({ error: error.details[0].message });
//     const userdetail = await User.findOne({ _id:req.user._id }).select('fullname email _id')

//     const randomId = Math.random().toString(36).substring(2);
//     const summ = req.body.price * req.body.quantity
//     const {
//       secure_url: image,
//       public_id: cloudinary_id,
//     } = await cloudinary.uploader.upload(req.file.path);
//     const {
//       name,
//       price,
//       quantity,
//       delivery,

//     } = req.body;

//     const updateproduct = await Order.findOne({user: req.user._id });

//     if(!updateproduct ){

//       const order = new Order({
//         user: req.user._id,
//         orderNumber: randomId,
//         products: [{image, cloudinary_id, quantity, name, price }],
//         delivery,
//         totalPrice:summ ,

//       });
//       const  createdOrder = await order.save();

//       const headers = {
//         authorization: SECRET_KEY,
//         'content-type': 'application/json',
//         'cache-control': 'no-cache',
//       };
//       const response = await axios.post(
//         'https://api.flutterwave.com/v3/payments',
//        {
//           "tx_ref": createdOrder.orderNumber,
//          "currency":"NGN",
//          "amount":createdOrder.totalPrice,
//          "redirect_url":"https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
//          "payment_options":"card",
//          "customer":userdetail

//       },

//         { headers }
//       );
//       const paymentId = response.data;

//       const data = {
//         user: userdetail,
//        products: createdOrder.products,
//        delivery: createdOrder.delivery,
//        totalPrice: createdOrder.totalPrice,
//        orderNumber: createdOrder.orderNumber,
//         paymentId,
//         deliveryDate: createdOrder.deliveredAt
//       };
//         return res.status(201).send({
//         message: 'New Order Created',
//        data,

//       });
//     }

//    updateproduct.products.push({image, cloudinary_id, quantity, name, price });
//    await updateproduct.save();

//    const getproduct = await Order.findOne({ user:req.user._id }).select('products')

//     const calc = getproduct.products.map(e =>
//           e.price * e.quantity
//       )

//       const sum = calc.reduce((a, b) => { return  a + b; }, 0);

//        await Order.updateOne({ user:req.user._id }, {$set:{totalPrice: sum}})

//       const moreproduct = await Order.findOne({ user:req.user._id })

//       const headers = {
//         authorization: SECRET_KEY,
//         'content-type': 'application/json',
//         'cache-control': 'no-cache',
//       };
//       const response = await axios.post(
//         'https://api.flutterwave.com/v3/payments',
//        {
//           "tx_ref": moreproduct.orderNumber,
//          "currency":"NGN",
//          "amount":moreproduct.totalPrice,
//          "redirect_url":"https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
//          "payment_options":"card",
//          "customer":userdetail

//       },

//         { headers }
//       );
//       const paymentId = response.data;
//      const data = {
//       user: userdetail,
//       products: moreproduct.products,
//       delivery: moreproduct.delivery,
//       totalPrice: moreproduct.totalPrice,
//       orderNumber: moreproduct.orderNumber,
//        paymentId,
//        deliveryDate: moreproduct.deliveredAt
//     };
//     res.status(200).send({
//       message: 'More Product Added',
//       data,

//     })

//   })
// );

router.post(
  '/payment',
  auth,
  asyncMiddleware(async (req, res) => {
    const headers = {
      authorization: SECRET_KEY,
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    };
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref: 'eau6jzfqu2c',
        currency: 'NGN',
        amount: 9,
        redirect_url:
          'https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc',
        payment_options: 'card',
        customer: {
          email: 'adeoluwafisayomi@gmail.com',
          phonenumber: '08160750829',
          name: 'Adejumo Adefisayo',
        },
      },

      { headers }
    );
    const responseLink = response.data;

    res.send(responseLink);
  })
);

router.post(
  '/webhook/details',
  asyncMiddleware(async (req, res) => {
    const { error } = Webhook(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    const hash = req.headers['verify-hash'];
    if (hash !== MY_HASH) return res.send(401, 'Unauthorized User');

    const { data, status, message } = req.body;
    const createdWebhook = await Payment.create({
      status,
      message,
      data,
    });
    res.send({ message: 'Transaction Stored', data: createdWebhook });
  })
);

router.get(
  '/verify/flutterwave/verify/:ref',
  asyncMiddleware(async (req, res) => {
    const { ref } = req.params;
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
    if (response.data.status !== 'success')
      return res.send({ message: 'Transaction not Verified' });
    await Order.updateOne({}, { isPaid: true });
    res.send({ message: 'Paid', data: response.data });
  })
);

module.exports = router;
