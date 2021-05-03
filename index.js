// const error = require('./middleware/error');
const express = require("express");
const app = express();

require("dotenv").config();
const mongoose = require("mongoose");
const user = require("./Routes/user");
const product = require("./Routes/product");
const purchase = require('./Routes/order')
const debug = require("debug")("app");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err))

app.use("/", user);
app.use("/", product);
app.use("/", purchase);
// app.use(error);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  debug(`Web server is running ${PORT}`);
});
