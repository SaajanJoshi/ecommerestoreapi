const mongoose = require('mongoose');
const OrderItem = require('../models/orderitem');

const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderItem',
      required: true,
    },
  ],
  city: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    default: 'pending',
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

// Model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
