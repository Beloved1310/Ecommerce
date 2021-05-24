/* eslint consistent-return: "off" */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const asyncMiddleware = require('../middleware/async');
const User = require('../Model/User');
const auth = require('../middleware/auth');

const router = express.Router();
const {
  SEND_EMAIL,
  FORGOT_PASSWORD,
  ACCTIVATION_KEY,
  ACTIVATION_KEY,
} = require('../config');
const validate = require('../validation/signupValidation');
const loginvalidate = require('../validation/loginValidate');
const forgetpassword = require('../validation/forgetPassword');
const newpassword = require('../validation/newPassword');
const activatePassword = require('../validation/activatePassword');
const emailData = require('../utilis/activation');
const activationData = require('../utilis/emailactivation');
const mailData = require('../utilis/forgotpassword');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SEND_EMAIL,
    },
  })
);

router.post(
  '/signup',
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const { fullname, email, password, gender } = req.body;

    const createdUser = new User({
      fullname,
      email,
      password,
      gender,
    });

    const user = await User.findOne({ email });
    if (user) {
      res.status(400).send({ error: 'User already registered' });
    } else {
      const salt = await bcrypt.genSalt(10);
      createdUser.password = await bcrypt.hash(createdUser.password, salt);
      const savedUser = await createdUser.save();
      if (savedUser) {
        const token = jwt.sign({ email }, ACTIVATION_KEY);
        const sendEmail = await transporter.sendMail(
          emailData(email, token, req)
        );

        if (!sendEmail) {
          res.send({ error: error.message });
        } else {
          const data = {
            fullname,
            email,
          };
          return res.send({
            message: 'Email has been sent, kindly activate your email',
            data,
          });
        }
      }
    }
  })
);

router.post(
  '/authentication/activate',
  asyncMiddleware(async (req, res) => {
    const { error } = activatePassword(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    const { token } = req.body;
    if (token) {
      const decodedToken = jwt.verify(token, ACCTIVATION_KEY);
      const { email } = decodedToken;

      transporter.sendMail(activationData(email, req));
    }

    res.status(200).send({ message: 'Email Activated', data: null });
  })
);

router.post(
  '/login',
  asyncMiddleware(async (req, res) => {
    const { error } = loginvalidate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .send({ message: 'username or password not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res
        .status(404)
        .send({ message: 'username or password not found ' });

    const token = user.generateAuthToken();
    res.header('x-auth-token', token);
    const data = { email, token };
    res.send({ message: 'Login Successful', data });
  })
);

router.post(
  '/forgotpassword',
  asyncMiddleware(async (req, res) => {
    const { error } = forgetpassword(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ error: 'User with this email does not exists' });
    }
    const token = jwt.sign({ _id: user._id }, FORGOT_PASSWORD, {
      expiresIn: '20m',
    });
    const update = await User.updateOne({ resetLink: token });
    if (!update) {
      return res.status(400).send({ error: 'reset password link error' });
    }
    transporter.sendMail(mailData(email, token, req));

    const data = { email };
    return res.send({
      message: 'Email has been sent, kindly follow the instructions',
      data,
    });
  })
);

router.post(
  '/newpassword',
  asyncMiddleware(async (req, res) => {
    const { error } = newpassword(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    const { Link, newPass } = req.body;
    const user = await User.findOne({ resetLink: Link });
    if (!user) return res.status(422).send({ error: 'Try Again' });

    const hashedpassword = await bcrypt.hash(newPass, 12);
    if (hashedpassword) {
      user.password = hashedpassword;
      user.resetLink = '';
    }
    user.save();
    const data = { newPass };
    res.send({ message: 'Password Updated', data });
  })
);

router.get(
  '/profile/:id',
  auth,
  asyncMiddleware(async (req, res) => {
    const data = await User.findOne({ _id: req.params.id }).select(
      '-password -_id'
    );
    res.send({ message: 'Profile', data });
  })
);

module.exports = router;
