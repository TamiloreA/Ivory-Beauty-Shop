const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    priceAtPurchase: Number // Store price at time of purchase
  }],
  shippingInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    shippingMethod: String,
    shippingCost: Number,
    deliveryInstructions: String
  },
  paymentInfo: {
    method: String,
    cardLast4: String, // For card payments
    transactionId: String // For payment processors
  },
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  total: Number,
  status: {
    type: String,
    enum: [
      'pending-payment', // New status
      'processing', 
      'shipped', 
      'delivered', 
      'cancelled',
      'failed' // New status for failed payments
    ],
    default: 'pending-payment'
  },
  paymentReference: String, // To store Paystack reference
  paymentMethod: {
    type: String,
    default: 'paystack'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);