const forgotpassword = (email, token, req) => {
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

module.exports = forgotpassword;
