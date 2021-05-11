/* eslint consistent-return: "off" */
const asyncMiddleware = require('../middleware/async');
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../Model/User');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();

const validate = require('../validation/signupValidation');
const loginvalidate = require('../validation/loginValidate');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SEND_EMAIL,
    },
  })
);

router.post(
  '/signup',
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const {
      fullname,
      email,
      password,
      age,
      gender,
      education,
      experience,
    } = req.body;

    const user = await User.findOne({ email });
    if (user)
      return res.status(400).send({ message: 'User already registered' });

    const token = jwt.sign(
      { fullname, email, password, age, gender, education, experience },
      process.env.ACCTIVATION_KEY
    );

    const data = {
      to: email,
      from: 'fisayo@foodcrowdy.com',
      subject: 'Email Activation',
      html: `<h2> Please Click on this link to verify your email </h2>
      <p> Click on this <a href = "http://localhost:7000/authentication/activate/${token}">link </a>to reset password</p>
      `,
    };
    transporter.sendMail(data, function (error, body) {
      if (error) {
        return res.send({ error: err.message });
      }
      const data = { user };
      return res.send({
        message: 'Email has been sent, kindly activate your email',
        data,
      });
    });
  })
);

router.post(
  '/authentication/activate',
  asyncMiddleware(async (req, res) => {
    const { token } = req.body;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.ACCTIVATION_KEY);
      const {
        fullname,
        email,
        password,
        age,
        gender,
        education,
        experience,
      } = decodedToken;
      const user = await User.findOne({ email });
      if (user)
        return res.status(400).send({ message: 'User already registered' });
      const createdUser = new User({
        fullname,
        email,
        password,
        age,
        gender,
        education,
        experience,
      });

      const salt = await bcrypt.genSalt(10);
      createdUser.password = await bcrypt.hash(createdUser.password, salt);

      const savedUser = await createdUser.save();
      if (savedUser) {
        const data = {
          to: email,
          from: 'fisayo@foodcrowdy.com',
          subject: 'Confirmation Email',
          html: `<p> Welcome to E-commerce Website, Do proceed to the <a href = "https://${req.headers.host}/login">Login Page</a></p>`,
        };
        transporter.sendMail(data);
      }
      const data = { fullname, email };
      res.status(200).send({ message: 'Registered User', data });
    } else {
      return res.send({ error: 'Something went wrong' });
    }
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
    const { email } = req.body;

    await User.findOne({ email }, (err, user) => {
      if (err || !user) {
        return res
          .status(400)
          .send({ error: 'User with this email does not exists' });
      }

      const token = jwt.sign({ _id: user.id }, process.env.FORGOT_PASSWORD, {
        expiresIn: '20m',
      });

      const mailData = {
        to: email,
        from: 'fisayo@foodcrowdy.com',
        subject: 'Password reset',
        html: `
        <h1> You requested for password reset</h1>
        <p> Click on this <a href = "http://localhost:7000/forgotpassword/${token}">link </a>to reset password</p>
        `,
      };

      return user.updateOne({ resetLink: token }, function (err, sucess) {
        if (err) {
          return res.status(400).send({ error: 'reset password link error' });
        } else {
          transporter.sendMail(mailData);
        }
        const data = { email };
        return res.send({
          message: 'Email has been sent, kindly follow the instructions',
          data,
        });
      });
    });
  })
);

router.post(
  '/newpassword',
  asyncMiddleware(async (req, res) => {
    const { Link, newPass } = req.body;
    let user = await User.findOne({ resetLink: Link });
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
