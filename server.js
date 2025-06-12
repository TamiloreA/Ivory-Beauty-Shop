const express = require('express')
      ejs = require('ejs')
      mongoose = require('mongoose')
      session = require('express-session')
      flash = require('connect-flash')
      require("dotenv").config();
const Cart = require('./models/cart');

const app = express()
app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database connected");
});

//EXPRESS SESSION MIDDLEWARE
app.use(session({
    secret: 'mysecretval',
    resave: false, 
    saveUninitialized: false, 
    cookie: { secure: false }
}))

app.use(async (req, res, next) => {
    if (req.session.userId) {
      const cart = await Cart.findOne({ user: req.session.userId });
      res.locals.cartCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) || 0;
    } else {
      res.locals.cartCount = 0;
    }
    next();
  });
  

//CONNECT FLASH TO HANDLE OUR MESSAGES
app.use(flash());
app.use((req, res, next)=> {
    res.locals.message = req.flash('message');
    res.locals.error_msg = req.flash('error_msg');

    next();
})

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      // Multer errors
      console.error('Multer error:', err);
      return res.status(400).send(`File upload error: ${err.message}`);
    } else if (err) {
      // Other errors
      console.error('Server error:', err);
      return res.status(500).send(`Internal server error: ${err.message}`);
    }
    next();
});


const adminRoute = require('./routes/adminRoute');
const orderRoute = require('./routes/orderRoute');
const cartRoute = require('./routes/cartRoute');
const paymentRoutes = require('./routes/payment');


//WE IMPORT THE ROUTE FILES
app.use('/', require('./routes/uRoute'));
app.use('/admin', adminRoute);
app.use('/orders', orderRoute);
app.use('/cart', cartRoute);
app.use('/payment', paymentRoutes);


app.listen(process.env.PORT || 5600, () =>
    console.log("Server Started on port " + (process.env.PORT || 5600))
);