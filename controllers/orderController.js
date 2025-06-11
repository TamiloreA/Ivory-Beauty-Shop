const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');

// Calculate shipping cost based on method
const calculateShipping = (method) => {
  const rates = {
    standard: 0,
    express: 9.99,
    overnight: 24.99
  };
  return rates[method] || 0;
};

// Calculate tax (simplified - adjust for your location)
const calculateTax = (subtotal, country) => {
  // Example rates - adjust based on your business location
  const taxRates = {
    US: 0.08, // 8%
    CA: 0.13, // 13% HST in some provinces
    UK: 0.2,  // 20% VAT
    // Add other countries as needed
  };
  const rate = taxRates[country] || 0;
  return subtotal * rate;
};

exports.getCheckout = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) return res.redirect('/login');
  
      // Get cart with populated products
      const cart = await Cart.findOne({ user: userId })
        .populate('items.product');
  
      if (!cart || cart.items.length === 0) {
        return res.redirect('/cart');
      }
  
      // Calculate order summary
      const subtotal = cart.items.reduce(
        (sum, item) => sum + (item.product.price * item.quantity), 
        0
      );
  
      res.render('order', {
        cartItems: cart.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          total: item.product.price * item.quantity
        })),
        subtotal,
        total: subtotal, // Initial total before shipping/tax
        user: req.session.user
      });
  
    } catch (err) {
      console.error('Checkout error:', err);
      res.status(500).send('Error loading checkout page');
    }
};

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // 1. Get cart and verify items
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 2. Process form data
    const { 
      firstName, lastName, email, phone,
      address, city, state, zipCode, country,
      shipping, payment, cardNumber, expiryDate, cvv, cardName,
      instructions 
    } = req.body;

    // 3. Validate stock and calculate totals
    const items = [];
    let subtotal = 0;
    
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || product.quantity < item.quantity) {
        return res.status(400).json({ 
          error: `"${product.name}" is out of stock or quantity unavailable` 
        });
      }
      
      items.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });
      
      subtotal += product.price * item.quantity;
    }

    const shippingCost = calculateShipping(shipping);
    const tax = calculateTax(subtotal, country);
    const total = subtotal + shippingCost + tax;

    // 4. Create order
    const order = new Order({
      user: userId,
      items,
      shippingInfo: {
        firstName, lastName, email, phone,
        address, city, state, zipCode, country,
        shippingMethod: shipping,
        shippingCost,
        deliveryInstructions: instructions
      },
      paymentInfo: {
        method: payment,
        ...(payment === 'card' && { 
          cardLast4: cardNumber.slice(-4) 
        })
      },
      subtotal,
      tax,
      shippingCost,
      total,
      status: 'processing'
    });

    await order.save();

    // 5. Update product quantities
    await Promise.all(cart.items.map(async (item) => {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { quantity: -item.quantity }
      });
    }));

    // 6. Clear cart
    await Cart.findOneAndDelete({ user: userId });

    // 7. Redirect to confirmation
    res.json({ 
      success: true, 
      orderId: order._id 
    });

  } catch (err) {
    console.error('Order placement error:', err);
    res.status(500).json({ 
      error: 'Failed to place order',
      message: err.message 
    });
  }
};

exports.getOrderConfirmation = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user')
      .populate('items.product');

    if (!order) return res.status(404).render('404');

    // Set default values if missing
    const orderWithDefaults = {
      shippingCost: order.shippingCost || 0,
      tax: order.tax || 0,
      subtotal: order.subtotal || 0,
      total: order.total || 0,
      paymentInfo: order.paymentInfo || {
        method: 'paystack',
        reference: 'N/A'
      },
      shippingInfo: order.shippingInfo || {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        shippingMethod: 'Standard'
      },
      ...order.toObject() // Spread the original order data
    };

    res.render('orderConfirmation', {
      order: orderWithDefaults,
      user: req.session.user,
      formattedDate: new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    });

  } catch (err) {
    console.error('Order confirmation error:', err);
    res.status(500).send('Error loading order confirmation');
  }
};