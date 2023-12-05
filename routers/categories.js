const Category = require('../models/category');
const express = require('express');
const router = express.Router();

// get
router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    return res.status(500).json({ success: false });
  }

  return res.status(200).send(categoryList);
});

// get by ID
router.get(`/:id`, async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(500).json({ success: false });
  }

  return res.status(200).send(category);
});

// post method
router.post(`/`, async (req, res) => {
  let category = new Category({
    name: req.body.name,
  });

  category = await category.save();

  if (!category) {
    return res.status(404).send('the category cannot be created');
  }

  return res.send(category);
});

// update category
router.put('/:id', async (req, res) => {
  // parameter and updated data, 2 parameters, third paramerte is {new : true} meaning return new updated data.
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (!category) {
    return res.status(404).send('the category cannot be updated');
  }

  return res.send(category);
});

// delete method
//params name could be anything and same should be placed in req.params.<idName>
router.delete('/:id', (req, res) => {
  // findByIdAndRemove is deprecated dont use.
  Category.findByIdAndDelete(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: 'Category is deleted' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'Category not found' });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
