const axios = require('axios');
const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const BASE_URL = process.env.BASE_URL || 'http://localhost:5600';

// Initialize Paystack payment
exports.initiatePayment = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ error: 'Not authenticated' });
  
      // Get user with email
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      // Get cart with products
      const cart = await Cart.findOne({ user: userId }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ error: 'Your cart is empty' });
      }
  
      // Verify stock availability
      for (const item of cart.items) {
        if (item.product.quantity < item.quantity) {
          return res.status(400).json({
            error: `Not enough stock for ${item.product.name} (Available: ${item.product.quantity})`
          });
        }
      }
  
      // Calculate totals
      const subtotal = cart.items.reduce(
        (sum, item) => sum + (item.product.price * item.quantity), 
        0
      );
      const tax = subtotal * 0.075; // 7.5% tax
      const total = subtotal + tax;
  
      // Create order
      const order = await Order.create({
        user: userId,
        items: cart.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          priceAtPurchase: item.product.price
        })),
        subtotal,
        tax,
        total,
        status: 'pending-payment'
      });
  
      // Initialize Paystack payment
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: user.email,
          amount: Math.round(total * 100), // Convert to kobo
          currency: 'NGN',
          callback_url: `${BASE_URL}/payment/verify`,
          metadata: {
            orderId: order._id.toString(),
            userId: userId.toString(),
            cartId: cart._id.toString()
          }
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      res.json({
        authorization_url: response.data.data.authorization_url
      });
  
    } catch (error) {
      console.error('Payment initiation error:', error);
      res.status(500).json({ 
        error: 'Payment initialization failed',
        details: error.message 
      });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
      const { reference } = req.query;
  
      // Verify with Paystack
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
          }
        }
      );
  
      const payment = response.data.data;
      if (payment.status !== 'success') {
        await Order.findByIdAndUpdate(payment.metadata.orderId, {
          status: 'failed'
        });
        return res.redirect('/payment-failed');
      }
  
      // Update order
      const order = await Order.findByIdAndUpdate(
        payment.metadata.orderId,
        {
          status: 'processing',
          paymentReference: payment.reference,
          paymentDetails: {
            gateway: 'paystack',
            method: payment.channel,
            paidAt: payment.paid_at
          }
        },
        { new: true }
      ).populate('items.product');
  
      // Update product quantities
      await Promise.all(order.items.map(async item => {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { quantity: -item.quantity, salesCount: item.quantity }
        });
      }));
  
      // Clear cart
      await Cart.findByIdAndDelete(payment.metadata.cartId);
  
      res.redirect(`/orders/confirmation/${order._id}`);
  
    } catch (error) {
      console.error('Payment verification error:', error);
      
      // If we have reference, mark order as failed
      if (req.query.reference) {
        await Order.findOneAndUpdate(
          { paymentReference: req.query.reference },
          { status: 'failed' }
        );
      }
      
      res.redirect('/payment-failed');
    }
};

exports.webhookHandler = async (req, res) => {
    const signature = req.headers['x-paystack-signature'];
    if (!signature) return res.sendStatus(400);
  
    // Validate webhook signature
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (hash !== signature) return res.sendStatus(401);
  
    const event = req.body;
    if (event.event === 'charge.success') {
      try {
        const payment = event.data;
        await Order.findOneAndUpdate(
          { paymentReference: payment.reference },
          { 
            status: 'processing',
            paymentDetails: {
              gateway: 'paystack',
              method: payment.channel,
              paidAt: payment.paid_at
            }
          }
        );
      } catch (err) {
        console.error('Webhook processing error:', err);
      }
    }
  
    res.sendStatus(200);
};