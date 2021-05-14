const mongoose = require('mongoose');
const debug = require('debug')('app');
const { MONGODBURI } = require('../config');

module.exports = async () => {
  const mongooseConnect = await mongoose.connect(MONGODBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  if (mongooseConnect) {
    debug('Connected to Database');
  } else {
    debug('Not Connected to Database');
  }
};
