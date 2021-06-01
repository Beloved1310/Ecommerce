const transporter = require('./mail');

const emailData = (email, token, req) => {
  const data = {
    to: email,
    from: 'fisayo@foodcrowdy.com',
    subject: 'Email Activation',
    html: `<h2> Please Click on this link to verify your email </h2>
    <p> Click on this <a href = "https://${req.headers.host}/authentication/activate/${token}">link </a>to reset password</p>
    `,
  };
  return data;
};

const sendEmail = async (email, token, req) => {
  await transporter.sendMail(emailData(email, token, req));
};
module.exports = sendEmail;
