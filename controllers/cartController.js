const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Product = require('../models/product');

exports.addToCart = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.session.userId;
  
      // Validate product ID
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).send("Invalid product ID");
      }
  
      // Find product and cart
      const product = await Product.findById(productId);
      if (!product) return res.status(404).send("Product not found");
  
      let cart = await Cart.findOne({ user: userId });
  
      // Create new cart if none exists
      if (!cart) {
        cart = await Cart.create({
          user: userId,
          items: [{ product: productId, quantity: parseInt(quantity) }]
        });
      } else {
        // Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(
          item => item.product.toString() === productId
        );
  
        if (existingItemIndex !== -1) {
          // Increment quantity if product exists
          cart.items[existingItemIndex].quantity += parseInt(quantity);
        } else {
          // Add new item if product doesn't exist
          cart.items.push({ product: productId, quantity: parseInt(quantity) });
        }
  
        await cart.save();
        const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        
         res.json({ 
             success: true, 
             cartCount  // Send back the updated cart count
         });
      }
  
      res.redirect('/cart');
    } catch (err) {
      console.error("Error adding to cart:", err);
      res.status(500).send("Server error");
    }
};

exports.viewCart = async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.redirect('/login');

  try {
    const cart = await Cart.findOne({ user: userId })
    .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name price imageUrl'
  });
    console.log("Populated Cart:", JSON.stringify(cart, null, 2)); // Add this line
    console.log("Cart Data:", cart);

    if (!cart || cart.items.length === 0) {
      return res.render('cart', { cartItems: [], total: 0, cartCount: 0 });
    }

    const cartItems = cart.items.map(item => ({
        name: item.product?.name || "Product Unavailable",
        price: item.product?.price || 0,
        quantity: item.quantity,
        total: (item.product?.price || 0) * item.quantity,
        product: item.product?._id,
        imageUrl: item.product?.imageUrl || "/images/default-product.jpg"
    }));

    const total = cartItems.reduce((acc, item) => acc + item.total, 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    res.render('cart', { cartItems, total, cartCount,  });

  } catch (err) {
    console.error("Error loading cart:", err);
    res.status(500).send("Server error");
  }
};

exports.removeItem = async (req, res) => {
    try {
      const { productId } = req.body;
      const userId = req.session.userId;
  
      const cart = await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { product: productId } } },
        { new: true }
      ).populate({
        path: 'items.product',
        model: 'Product',
        select: 'price'
      });
  
      if (!cart) return res.status(404).json({ error: "Cart not found" });
  
      const cartItems = cart.items.map(item => ({
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity
      }));
  
      res.json({
        success: true,
        cartTotal: cartItems.reduce((sum, item) => sum + item.total, 0).toFixed(2),
        cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      });
  
    } catch (err) {
      console.error("Error removing item:", err);
      res.status(500).json({ 
        success: false,
        error: "Server error",
        message: err.message 
      });
    }
  };

exports.updateQuantity = async (req, res) => {
    try {
      const { productId, action } = req.body;
      const userId = req.session.userId;
  
      // Validate product ID
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
  
      // Find cart with populated products
      const cart = await Cart.findOne({ user: userId })
        .populate({
          path: 'items.product',
          model: 'Product',
          select: 'price'
        });
  
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
  
      // Find item index
      const itemIndex = cart.items.findIndex(
        item => item.product._id.toString() === productId
      );
  
      if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found in cart" });
      }
  
      // Handle quantity changes
      const currentItem = cart.items[itemIndex];
      
      if (action === "increase") {
        currentItem.quantity += 1;
      } else if (action === "decrease") {
        currentItem.quantity = Math.max(1, currentItem.quantity - 1);
      } else {
        return res.status(400).json({ error: "Invalid action" });
      }
  
      // Remove item if quantity reaches 0
      if (currentItem.quantity < 1) {
        cart.items.splice(itemIndex, 1);
      }
  
      // Save changes
      await cart.save();
  
      // Calculate updated values
      const cartItems = cart.items.map(item => ({
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity
      }));
  
      const responseData = {
        success: true,
        newQuantity: currentItem.quantity,
        itemTotal: (currentItem.product.price * currentItem.quantity).toFixed(2),
        cartTotal: cartItems.reduce((sum, item) => sum + item.total, 0).toFixed(2),
        cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      };
  
      // If item was removed
      if (currentItem.quantity < 1) {
        responseData.removed = true;
        responseData.newQuantity = 0;
      }
  
      res.json(responseData);
  
    } catch (err) {
      console.error("Error updating quantity:", err);
      res.status(500).json({ 
        success: false,
        error: "Server error",
        message: err.message 
      });
    }
};

