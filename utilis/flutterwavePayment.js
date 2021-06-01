const axios = require('axios');

const { SECRET_KEY } = require('../config');

const flutterwave = async (orderNumber, totalPrice, userdetail) => {
  const headers = {
    authorization: SECRET_KEY,
    'content-type': 'application/json',
    'cache-control': 'no-cache',
  };
  const response = await axios.post(
    'https://api.flutterwave.com/v3/payments',
    {
      tx_ref: orderNumber,
      currency: 'NGN',
      amount: totalPrice,
      redirect_url: 'https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc',
      payment_options: 'card',
      customer: userdetail,
    },
    { headers }
  );

  return response.data;
};

module.exports = flutterwave;
