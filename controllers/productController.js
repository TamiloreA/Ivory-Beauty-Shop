const Collection = require('../models/collection');
const Product = require('../models/product');

exports.showCollections = async (req, res) => {
  const collections = await Collection.find();
  res.render('collections', { collections });
};

exports.showCollectionProducts = async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  const products = await Product.find({ collectionRef: collection._id });
  res.render('products', { collection, products });
};

exports.searchProducts = async (req, res) => {
  const query = req.query.query;
  const products = await Product.find({
    $or: [
      { name: new RegExp(query, 'i') },
      { description: new RegExp(query, 'i') }
    ]
  }).populate('collection');
  res.render('searchResults', { query, products });
};
