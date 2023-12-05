const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

categorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// now we need to enable the virtuals
categorySchema.set('toJSON', {
  virtuals: true,
});

// Model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
