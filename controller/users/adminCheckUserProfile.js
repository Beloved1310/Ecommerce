const User = require('../../Model/User');

module.exports = async (req, res) => {
  const data = await User.findById({ _id: req.params.id }).select('-password ');
  res.send({ message: 'Users Profile', data });
};
