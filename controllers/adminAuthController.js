const Admin = require('../models/admin');
const ADMIN_CODE = process.env.ADMIN_CODE || 'IVORYSECRET2025';

exports.getSignup = (req, res) => {
  res.render('adminSignup');
};

exports.signup = async (req, res) => {
    const { name, email, password, adminCode } = req.body;
  
    if (adminCode !== ADMIN_CODE) {
      return res.status(403).send('Invalid Admin Code');
    }
  
    try {
      await Admin.create({ name, email, password, adminCode });
      res.redirect('/admin/login');
    } catch (err) {
      res.status(400).send('Signup error: ' + err.message);
    }
  };

exports.getLogin = (req, res) => {
  res.render('adminLogin');
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).send('Invalid email or password');
  }
  req.session.adminId = admin._id;
  res.redirect('/admin/dashboard');
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
};

exports.requireAuth = (req, res, next) => {
  if (!req.session.adminId) return res.redirect('/admin/login');
  next();
};
