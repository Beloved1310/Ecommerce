const express = require("express");
const Webhook = require("../Model/Webhook");
const Product = require("../Model/Products");
const Order = require("../Model/Order");
const auth = require("../middleware/auth");
const router = express.Router();
const mongoose = require("mongoose");

const axios = require("axios");

// ....................pass order id
router.get("/order/:id", auth, async (req, res) => {
  const order = await Order.findById(req.params.id).populate("product");
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ message: "Order Not Found" });
  }
});

// >>>>>>>>>>>>>pass user token
// >>>>>>>>>>>>>>> see my purchase product
router.get("/order/user/mine", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "user",
    "fullname email -_id"
  );
  console.log(orders);
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

router.post("/webhook/details", async (req, res) => {
  var hash = req.headers["verify-hash"];
  if (hash !== process.env.MY_HASH) {
    res.send(401, "Unauthorized User");
  } else {
    const { data, status, message } = req.body;
    const createdWebhook = await Webhook.create({
      status,
      message,
      data,
    });
    res.send(createdWebhook);
  }
});

router.get("/verify/flutterwave/verify/:ref", async (req, res) => {
  const ref = req.params.ref;
  const response = await axios.get(
    `https://api.flutterwave.com/v3/transactions/${ref}/verify/`,
    {
      headers: {
        authorization: process.env.SECRET_KEY,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
    }
  );
  if (response) {
    res.send(response.data);
  } else {
    res.send(error);
  }
});

module.exports = router;
