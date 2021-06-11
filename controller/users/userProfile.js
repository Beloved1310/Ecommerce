const User = require('../../Model/User');

module.exports = async (req, res) => {
  const data = await User.findOne({ _id: req.user._id }).select(
    '-password -_id'
  );
  res.send({ message: 'Your information', data });
};
