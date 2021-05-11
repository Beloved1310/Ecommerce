const express = require('express');
require('dotenv').config();
const debug = require('debug')('app');
const app = express();
require('./startup/db')();

const user = require('./Routes/user');
const product = require('./Routes/product');
const purchase = require('./Routes/order');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', product);
app.use('/', user);
app.use('/', purchase);
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.message });
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  debug(`Web server is running ${PORT}`);
});
