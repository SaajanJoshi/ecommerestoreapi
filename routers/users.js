const User = require('../models/user');
const express = require('express');
const router = express.Router();

// npm bcrypt for password hash
const bcrypt = require('bcryptjs');

// json web token for authorization
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
  const userList = await User.find().select('-passwordHash');

  if (!userList) {
    return res.status(500).json({ success: false });
  }

  return res.send(userList);
});

// post method
router.post(`/`, async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10), //password secret second param
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  user = await user.save();

  if (!user) {
    return res.status(404).send('user cannot be created');
  }

  return res.send(user);
});

// get by ID
router.get(`/:id`, async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');

  if (!user) {
    return res.status(500).json({ success: false });
  }

  return res.status(200).send(user);
});

// register method
router.post(`/register`, async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10), //password secret second param
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  user = await user.save();

  if (!user) {
    return res.status(404).send('user cannot be created');
  }

  return res.send(user);
});

// login path
router.post('/login', async (req, res) => {
  const secret = process.env.secret;
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.status(400).send('User or Password does not match.');
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    // sign accept object payload secret or private key, // second param is secret
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      {
        expiresIn: '1d', //1d means 1 day
      }
    );

    return res
      .status(200)
      .send({ user: user.email, token: token, success: 'User Authenticated' });
  } else {
    return res.status(400).send('User or Password does not match.');
  }
});

module.exports = router;
