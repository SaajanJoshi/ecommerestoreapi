const mongoose = require('mongoose');

const orderitemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    required: true,
  },
});

// Model
const OrderItem = mongoose.model('OrderItem', orderitemSchema);

module.exports = OrderItem;
