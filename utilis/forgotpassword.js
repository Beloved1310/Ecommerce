const transporter = require('./mail');

const emailData = (email, token, req) => {
  const mailData = {
    to: email,
    from: 'fisayo@foodcrowdy.com',
    subject: 'Password reset',
    html: `
        <h1> You requested for password reset</h1>
        <p> Click on this <a href = "https://${req.headers.host}/forgotpassword/${token}">link </a>to reset password</p>
        `,
  };
  return mailData;
};

const forgotpassword = async (email, token, req) => {
  await transporter.sendMail(emailData(email, token, req));
};
module.exports = forgotpassword;
