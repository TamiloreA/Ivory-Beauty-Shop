const Collection = require('../models/collection');
const Product = require('../models/product');
const Cart = require('../models/cart');
const { getCartCount } = require('./userController');

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

exports.showAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('collectionRef');
        const collections = await Collection.find();
        
        // Use the helper function to get cart count
        const cartCount = await getCartCount(req.session.userId);
        
        res.render('products', {
            products,
            collections,
            cartCount,
            userId: req.session.userId
        });
    } catch (err) {
        console.error('Error loading products:', err);
        res.status(500).send('Error loading products');
    }
};