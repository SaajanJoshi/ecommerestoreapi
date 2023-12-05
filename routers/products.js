const Product = require('../models/product');
const Category = require('../models/category');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//  get all products

router.get(`/`, async (req, res) => {
  // find returns a promise, hence it is waiting for the result.

  const productList = await Product.find().populate('category');

  // suppose I want to find only the names of the product
  // followed by space to add another attribute
  // add hypen (-) to remove any attribute
  // const productListNames = await Product.find().select('name image' -_id);

  if (!productList) {
    return res.status(500).json({ success: false });
  }

  return res.send(productList);
});

// get product by ID
router.get(`/:id`, async (req, res) => {
  // to check valid id or not
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send('Invalid Product ID');
  }

  // what populate does is, there is any other model referenced in this model,
  // it will populate data of that model data according to its corresponding ID.
  // NOTE: in product collection for category ID must be populated therefore.

  const product = await Product.findById(req.params.id).populate('category');

  if (!product) {
    return res.status(500).json({ success: false });
  }

  return res.status(200).send(product);
});

// post method
router.post(`/admin/`, async (req, res) => {
  // if category dont exist no product created
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send('Invalid Category');
  }

  // push data to databse
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
  });

  // Using regular promise
  // product
  //   .save()
  //   .then((createdProduct) => {
  //     res.status(201).json(createdProduct);
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       error: err,
  //       success: false,
  //     });
  //   });

  // using await
  product = await product.save();

  if (!product) {
    return res.status(404).send('the product cannot be created');
  }

  return res.send(product);
});

// update category
router.put('/admin/:id', async (req, res) => {
  // to check valid id or not
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send('Invalid Product ID');
  }

  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send('Invalid Category');
  }

  // parameter and updated data, 2 parameters, third paramerte is {new : true} meaning return new updated data.
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
    },
    { new: true }
  );

  if (!product) {
    return res.status(404).send('the product cannot be updated.');
  }

  return res.send(product);
});

// delete method
router.delete('/admin/:id', async (req, res) => {
  // to check valid id or not
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send('Invalid Product ID');
  }
  let product = await Product.findByIdAndDelete(req.params.id);

  if (product) {
    return res
      .status(200)
      .json({ success: true, message: 'product is deleted' });
  } else {
    return res
      .status(404)
      .json({ success: false, message: 'product not found' });
  }

  // Category.findByIdAndDelete(req.params.id)
  //   .then((category) => {
  //     if (category) {
  //       return res
  //         .status(200)
  //         .json({ success: true, message: 'Category is deleted' });
  //     } else {
  //       return res
  //         .status(404)
  //         .json({ success: false, message: 'Category not found' });
  //     }
  //   })
  //   .catch((err) => {
  //     return res.status(400).json({ success: false, error: err });
  //   });
});

// get count of products
router.get(`/admin/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments((count) => {});

  if (!productCount) {
    return res.status(500).json({ success: false });
  }

  return res.send(productCount);
});

// get products according to category
// locahost:3000/api/v1/products?categories=123,1343

router.get(`/`, async (req, res) => {
  let filer = {};

  // req.params.categories, this cateogies is coming from
  //api/v1/products?categories=123,1343

  if (req.params.categories) {
    // {} means object and if with the values inside
    // {category:<values, values>}

    filter = { category: req.query.categories.split(',') };
  }

  const productList = await Product.find(filter).populate('category');

  if (!productList) {
    return res.status(500).json({ success: false });
  }

  return res.send(productList);
});

module.exports = router;
