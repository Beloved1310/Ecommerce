/* eslint consistent-return: "off" */
const asyncMiddleware = require("../middleware/async");
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../Model/User");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

const router = express.Router();

const validate = require("../validation/signupValidation");
const loginvalidate = require("../validation/loginValidate");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SEND_EMAIL,
    },
  })
);

router.post(
  "/signup",
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const { fullname, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) return res.status(400).send("User already registered");

    const createdUser = new User({ fullname, email, password });

    const salt = await bcrypt.genSalt(10);
    createdUser.password = await bcrypt.hash(createdUser.password, salt);

    await createdUser.save();
    const response = { fullname, email };
    res.status(200).send({ message: "Registered User", response });
  })
);

router.post(
  "/login",
  asyncMiddleware(async (req, res) => {
    const { error } = loginvalidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("username or password not found ");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(404).send("username or password not found ");

    const token = user.generateAuthToken();
    res.header("x-auth-token", token);
    const response = { email, token };
    res.send({ message: "Login Successful", response });
  })
);

router.post(
  "/forgotpassword",
  asyncMiddleware(async (req, res) => {
    const { email } = req.body;

    await User.findOne({ email }, (err, user) => {
      if (err || !user) {
        return res
          .status(400)
          .json({ error: "User with this email does not exists" });
      }

      const token = jwt.sign({ _id: user.id }, process.env.FORGOT_PASSWORD, {
        expiresIn: "20m",
      });
      // const token = jwt.sign({ _id: user.id }, process.env.FORGOT_PASSWORD);

      const data = {
        to: email,
        from: "fisayo@foodcrowdy.com",
        subject: "Password reset",
        html: `
        <h1> You requested for password reset</h1>
        <p> Click on this <a href = "http://localhost:7000/forgotpassword/${token}">link </a>to reset password</p>
        `,
      };

      return user.updateOne({ resetLink: token }, function (err, sucess) {
        if (err) {
          return res.status(400).json({ error: "reset password link error" });
        } else {
          transporter.sendMail(data);
        }
        return res.json({
          message: "Email has been sent, kindly follow the instructions",
        });
      });
    });
  })
);

router.post(
  "/newpassword",
  asyncMiddleware(async (req, res) => {
    const { Link, newPass } = req.body;
    let user = await User.findOne({ resetLink: Link });
    if (!user) return res.status(422).json({ error: "Try again" });

    const hashedpassword = await bcrypt.hash(newPass, 12);
    if (hashedpassword) {
      user.password = hashedpassword;
      user.resetLink = "";
    }
    user.save();
    res.json({ message: "password updated" });
  })
);

router.get(
  "/profile/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const userProfile = await User.findOne({ _id: req.params.id }).select(
      "-password -_id"
    );
    res.json(userProfile);
  })
);

module.exports = router;
