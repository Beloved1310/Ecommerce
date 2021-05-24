const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { SEND_EMAIL } = require('../config');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SEND_EMAIL,
    },
  })
);

module.exports = transporter;
