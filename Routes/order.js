/* eslint consistent-return: "off" */

const express = require('express');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();
const auth = require('../middleware/auth');
const checkout = require('../controller/orders/checkout');
const webhook = require('../controller/orders/webhook');
const getOrder = require('../controller/orders/getOrder');

router.get('/order/:id', auth, asyncMiddleware(getOrder));

router.post('/checkout', auth, asyncMiddleware(checkout));

router.post('/webhook/details', asyncMiddleware(webhook));

module.exports = router;
