  const express = require("express");
// const User = require("../Model/User");
const Product = require("../Model/Products");
const Order = require("../Model/Order");
const auth = require("../middleware/auth");
const router = express.Router();
// const multer = require("multer");
const mongoose = require("mongoose");

const axios = require("axios");

// ....................pass order id
router.get("/order/:id", auth, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('product')
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ message: "Order Not Found" });
  }
});

// >>>>>>>>>>>>>pass user token
// >>>>>>>>>>>>>>> see my purchase product
router.get("/order/user/mine", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('product').populate('user fullname email -_id');
  res.send(orders);
});

router.post("/order", auth, async (req, res) => {
  const existProduct = Product.findById(req.body.productId);
  if (!existProduct) {
    res.status(404).send({ message: "Product not found" });
  } else {
    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      product: req.body.productId,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });
    const createdOrder = await order.save();
    res.status(201).send({ message: "New Order Created", order: createdOrder });
  }
});
                           
// app.get('/order/product/flutterwave', (req, res) => {
//   res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
// });


// router.put( 'order/:id/pay',auth, (async (req, res) => {
//      if (order) {
//       order.isPaid = true;
//       order.paidAt = Date.now();
//       order.paymentResult = {
//         id: req.body.id,
//         status: req.body.status,
//         update_time: req.body.update_time,
//         email_address: req.body.email_address,
//       };
//       const updatedOrder = await order.save();
//       mailgun()
//         .messages()
//         .send(
//           {
//             from: 'Amazona <amazona@mg.yourdomain.com>',
//             to: `${order.user.name} <${order.user.email}>`,
//             subject: `New order ${order._id}`,
//             html: payOrderEmailTemplate(order),
//           },
//           (error, body) => {
//             if (error) {
//               console.log(error);
//             } else {
//               console.log(body);
//             }
//           }
//         );
//       res.send({ message: 'Order Paid', order: updatedOrder });
//     } else {
//       res.status(404).send({ message: 'Order Not Found' });
//     }
//   })
// );

router.post("/intialise/flutterwave", auth, async (req, res) => {
   
  const headers = {
    authorization: process.env.SECRET_KEY,
    "content-type": "application/json",
    "cache-control": "no-cache",
  };
  const response = await axios.post(
    "https://api.flutterwave.com/v3/payments",
    req.body,
    { headers }
  );
  res.send(response.data);
  console.log(response);
});

router.post("/webhook/details", auth, async (req, res) => {
  const {data, status, message}= req.body
  const createdWebhook = new Order({
    status,
    message,
    data 
  })

  await createdWebhook.save()
  res.send(createdWebhook)

});




router.get("/verify/flutterwave/verify/:ref", async (req, res) => {
  const ref = req.params.ref;
 const response =  await axios
    .get(`https://api.flutterwave.com/v3/transactions/${ref}/verify/`, {
      headers: {
        authorization: process.env.SECRET_KEY,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
    })
    if (response){
      console.log(response.data);
    }else{
      console.log(error);
    }
    
});

module.exports = router;
