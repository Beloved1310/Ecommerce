const User = require('../../Model/User');

module.exports = async (req, res) => {
  const data = await User.findOne({ _id: req.params.id }).select(
    '-password -_id'
  );
  res.send({ message: 'Your information', data });
};
