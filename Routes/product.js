const asyncMiddleware = require("../middleware/async");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const auth = require('../middleware/auth')
const Product = require("../Model/Products");
const cloudinary = require("../utilis/cloudinary");
const storage = require('../utilis/multer')

const upload = multer({ storage });

// ...........get all Products..........
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ...........get one Product .......

router.get("/:id", asyncMiddleware(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('user', 'fullname email -_id');
  if (product) {
  res.json(product);
  }else{
    res.status(404).send({ message : 'Product Not Found'})
  }
}));

router.post("/product", auth, upload.single("image"), asyncMiddleware(async (req, res) => {
  const { name, price, quantity } = req.body;

  const { secure_url: image, public_id: cloudinary_id } = await cloudinary.uploader.upload(req.file.path);
  const createdProduct = await Product.create({

    image,
    cloudinary_id,
    name,
    price,
    quantity,
    user: req.user._id,
  });

  res.json(createdProduct);
}));



router.put('/product/:id',upload.single('image'),asyncMiddleware( async (req, res) => {
  const product = await Product.findById(req.params.id);
  await cloudinary.uploader.destroy(product.cloudinary_id);
  const { secure_url: image, public_id: cloudinary_id } = await cloudinary.uploader.upload(req.file.path);
  const { name, price, quantity} = req.body;
  await Product.updateOne({ _id: req.params.id },
    {
      $set: {
        image,
        cloudinary_id,
        name,
        price,
        quantity,
      },
    });
  res.status(200).json({ message: 'Updated!' });
}));

module.exports = router;
