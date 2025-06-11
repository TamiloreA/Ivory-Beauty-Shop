exports.validateShipping = (req, res, next) => {
    const validMethods = ['standard', 'express', 'overnight'];
    if (!validMethods.includes(req.body.shippingMethod)) {
      return res.status(400).json({ error: 'Invalid shipping method' });
    }
    next();
  };