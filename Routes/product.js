const multer = require('multer');
const express = require('express');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();

const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const storage = require('../utilis/multer');

const upload = multer({ storage });

const uploadProduct = require('../controller/products/uploadProduct');
const editProduct = require('../controller/products/editProduct');
const getOneProduct = require('../controller/products/getOneProduct');
const getAllProduct = require('../controller/products/getAllProduct');

router.get('/', asyncMiddleware(getAllProduct));

router.get('/:id', asyncMiddleware(getOneProduct));

router.post(
  '/product',
  auth,
  isAdmin,
  upload.single('image'),
  asyncMiddleware(uploadProduct)
);

router.put(
  '/product/:id',
  auth,
  isAdmin,
  upload.single('image'),
  asyncMiddleware(editProduct)
);

module.exports = router;
