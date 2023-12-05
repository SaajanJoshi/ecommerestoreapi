const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// in mongodb ID is shown as _id
// but what if we just want "id"
// converting _id to id
productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// now we need to enable the virtuals
productSchema.set('toJSON', {
  virtuals: true,
});

// Model
// To use our schema definition, we need to convert our blogSchema into a Model we can work with.
// To do so, we pass it into mongoose.model(modelName, schema):
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
