const mongoose = require("mongoose");
const debug = require("debug")("app");

module.exports = async () => {
  mongoose
    .connect(process.env.MONGODBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => debug("Connected to MongoDB..."))
    .catch((err) => console.error("Could not connect to MongoDB...", err));
};
