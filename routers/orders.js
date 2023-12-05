const Order = require('../models/order');
const express = require('express');
const OrderItem = require('../models/orderitem');
const router = express.Router();

// get method (ADMIN)
router.get(`/admin/`, async (req, res) => {
  const order = await Order.find()
    .populate('user', 'name')
    .sort({ dateOrdered: -1 });

  if (!order) {
    return res.status(500).json({ success: false });
  }

  return res.status(200).send(order);
});

//by ID (ADMIN)
router.get(`/admin/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({
      path: 'orderItems',
      populate: { path: 'product', populate: 'category' },
    });

  if (!order) {
    return res.status(500).json({ success: false });
  }

  return res.status(200).send(order);
});

// post method (USER)
router.post(`/`, async (req, res) => {
  try {
    const orderItemsids = await Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let neworderItem = new OrderItem({
          product: orderItem.product,
          quantity: orderItem.quantity,
        });

        neworderItem = await neworderItem.save();

        return neworderItem._id;
      })
    );

    // never calculate total price in client side
    const totalPrices = await Promise.all(
      orderItemsids.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          'product',
          'price'
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
        //returning an array with price * quantity according to total number of producys
      })
    );

    // console.log(totalPrices);

    // reduce method of array
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    let order = new Order({
      orderItems: orderItemsids,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      totalPrice: totalPrice,
      user: req.body.user,
    });

    order = await order.save();

    if (!order) {
      return res.status(404).send('the order cannot be created');
    }

    return res.send(order);
  } catch (error) {
    // Handle errors appropriately, you might want to log the error
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

//update order for status only (ADMIN)
router.put('/admin/:id', async (req, res) => {
  // parameter and updated data, 2 parameters, third paramerte is {new : true} meaning return new updated data.
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) {
    return res.status(404).send('the order cannot be updated');
  }

  return res.send(order);
});

//delete order (USER)
router.delete('/:id', (req, res) => {
  // findByIdAndRemove is deprecated dont use.
  Order.findByIdAndDelete(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndDelete(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: 'Order is Deleted' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'order not found' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

// Get user orders (USERS)
router.get(`/get/userorders/:userID`, async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userID }).populate({
    path: 'orderItems',
    populate: { path: 'product', populate: 'category' },
  });

  if (!userOrderList) {
    return res.status(500).json({ success: false });
  }

  return res.status(200).send(userOrderList);
});

module.exports = router;
