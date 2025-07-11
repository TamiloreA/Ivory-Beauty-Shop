const cartSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    //   unique: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', // Add this line
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ]
  }, { timestamps: true });  // Better than manually adding createdAt
  
  module.exports = mongoose.model('Cart', cartSchema);
  