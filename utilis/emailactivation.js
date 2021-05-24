const activationData = (email, req) => {
  const data = {
    to: email,
    from: 'fisayo@foodcrowdy.com',
    subject: 'Confirmation Email',
    html: `<p> Welcome to E-commerce Website, Do proceed to the <a href = "https://${req.headers.host}/login">Login Page</a></p>`,
  };
  return data;
};

module.exports = activationData;
