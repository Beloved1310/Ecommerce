const express = require('express');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const checkout = require('../controller/orders/checkout');
const webhook = require('../controller/orders/webhook');
const getOrder = require('../controller/orders/getOrder');
const adminGetUserOrder = require('../controller/orders/adminGetUserOrder');
const adminGetOneUserOrder = require('../controller/orders/adminGetOneUserOrder');

router.get('/order/me', auth, asyncMiddleware(getOrder));
router.get('/order/admin', auth, isAdmin, asyncMiddleware(adminGetUserOrder));
router.get(
  '/order/admin/getoneuser/:id',
  auth,
  isAdmin,
  asyncMiddleware(adminGetOneUserOrder)
);

router.post('/checkout', auth, asyncMiddleware(checkout));

router.post('/webhook/details', asyncMiddleware(webhook));

module.exports = router;
