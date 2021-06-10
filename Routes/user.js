/* eslint consistent-return: "off" */

const express = require('express');
const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

const signUp = require('../controller/users/signUp');
const emailActivation = require('../controller/users/emailActivation');
const login = require('../controller/users/login');
const forgotPassword = require('../controller/users/forgotPassword');
const newPassword = require('../controller/users/newPassword');
const userProfile = require('../controller/users/userProfile');
const adminCheckUserProfile = require('../controller/users/adminCheckUserProfile');

router.post('/signup', asyncMiddleware(signUp));

router.post('/authentication/activate', asyncMiddleware(emailActivation));

router.post('/login', asyncMiddleware(login));

router.post('/forgotpassword', asyncMiddleware(forgotPassword));

router.post('/newpassword', asyncMiddleware(newPassword));

router.get('/me/profile', auth, asyncMiddleware(userProfile));

router.get(
  '/profile/admin/:id',
  auth,
  isAdmin,
  asyncMiddleware(adminCheckUserProfile)
);

module.exports = router;
