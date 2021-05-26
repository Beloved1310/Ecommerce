/* eslint-disable camelcase */
/* eslint consistent-return: "off" */

const multer = require('multer');
const express = require('express');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();

const auth = require('../middleware/auth');
const Product = require('../Model/Products');
const cloudinary = require('../utilis/cloudinary');
const storage = require('../utilis/multer');

const upload = multer({ storage });

const newProduct = require('../validation/newProduct');
const putproduct = require('../validation/putprodut');

// ...........get all Products..........
router.get('/', async (req, res) => {
  const data = await Product.find();
  res.send({ message: 'Products', data });
});

// ...........get one Product .......

router.get(
  '/:id',
  asyncMiddleware(async (req, res) => {
    const data = await Product.findById(req.params.id).populate(
      'fullname email -_id'
    );
    if (!data) return res.status(404).send({ error: 'Product Not Found' });

    res.send({ message: 'Product', data });
  })
);

router.post(
  '/product',
  auth,
  upload.single('image'),
  asyncMiddleware(async (req, res) => {
    const { error } = newProduct(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    const { name, price, quantity } = req.body;

    const {
      secure_url: image,
      public_id: cloudinary_id,
    } = await cloudinary.uploader.upload(req.file.path);
    await Product.create({
      image,
      cloudinary_id,
      name,
      price,
      quantity,
      user: req.user._id,
    });

    const data = {
      image,
      cloudinary_id,
      name,
      price,
      quantity,
    };
    res.send({ message: 'Created Product', data });
  })
);

router.put(
  '/product/:id',
  upload.single('image'),
  asyncMiddleware(async (req, res) => {
    const { error } = putproduct(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    const product = await Product.findById(req.params.id);
    if (req.file) {
      await cloudinary.uploader.destroy(product.cloudinary_id);
      const {
        secure_url: image,
        public_id: cloudinary_id,
      } = await cloudinary.uploader.upload(req.file.path);
      await Product.updateOne(
        { _id: req.params.id },
        {
          $set: {
            image,
            cloudinary_id,
          },
        }
      );
    }

    const { name, price, quantity } = req.body;
    await Product.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name,
          price,
          quantity,
        },
      }
    );

    const data = await Product.find({ _id: req.params.id });
    res.status(200).json({ message: 'Product updated', data });
  })
);

module.exports = router;
