const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  feature: {
    type: String,
    required: true
  },
  // tank: {
  //   type: String,
  //   require:true
  // },
  image1: {
    type: Buffer,

  }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
