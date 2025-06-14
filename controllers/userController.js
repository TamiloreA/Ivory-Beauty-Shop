
const mongoose = require("mongoose");
const Users = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const bcrypt = require("bcryptjs");

exports.landingPage = async (req, res) => {
  try {
    const products = await Product.find();
    const cart = await Cart.findOne({ user: req.session.userId });
    const cartCount = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    res.render("index", {
      products,
      cartCount,
      userId: req.session.userId
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load homepage");
  }
};

exports.getSignup = (req, res) => {
  res.render("userSignup");
};

exports.signup = async (req, res) => {
  const { name, email, address, phone, password } = req.body;

  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) return res.status(400).send("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await Users.create({ name, email, address, phone, password: hashedPassword });

    req.session.userId = user._id;
    req.session.user = user;
    console.log("SESSION SET:", req.session.userId);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Signup error");
  }
};

exports.getLogin = (req, res) => {
  res.render("userLogin");
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid credentials");
    }

    req.session.userId = user._id;
    req.session.user = user;
    console.log("SESSION SET:", req.session.userId);
    await new Promise((resolve, reject) => {
        req.session.save(err => {
          if (err) reject(err);
          resolve();
        });
      });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Login failed");
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

exports.about = async (req, res) => {
    try {
      res.render('about');
    } catch (err) {
      console.error('Error loading about page:', err);
      res.status(500).send('Error loading about page');
    }
}

exports.getCartCount = async (userId) => {
    try {
        if (!userId) return 0;
        const cart = await Cart.findOne({ user: userId });
        return cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    } catch (err) {
        console.error("Error getting cart count:", err);
        return 0;
    }
};