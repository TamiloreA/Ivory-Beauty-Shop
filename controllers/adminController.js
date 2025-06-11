const Collection = require('../models/collection');
const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const ExcelJS = require('exceljs');

exports.addCollection = async (req, res) => {
  try {
    const { name, description } = req.body;
    await Collection.create({ name, description });
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).send('Error creating collection');
  }
};

exports.addProduct = async (req, res) => {
    try {
      const { name, description, price, imageUrl, quantity, collectionId } = req.body;
      await Product.create({
        name,
        description,
        price,
        imageUrl,
        quantity: parseInt(quantity, 10),
        collectionRef: collectionId
      });      
      res.redirect('/admin/dashboard');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error adding product');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.redirect('/admin/dashboard');
    } catch (err) {
      res.status(500).send('Error deleting product');
    }
};
  
exports.deleteCollection = async (req, res) => {
    try {
      await Collection.findByIdAndDelete(req.params.id);
      res.redirect('/admin/dashboard');
    } catch (err) {
      res.status(500).send('Error deleting collection');
    }
};

exports.updateProduct = async (req, res) => {
    const { name, description, price, imageUrl, quantity } = req.body;
    try {
      await Product.findByIdAndUpdate(req.params.id, {
        name,
        description,
        price,
        imageUrl,
        quantity: parseInt(quantity, 10)
      });
      res.redirect('/admin/dashboard');
    } catch (err) {
      res.status(500).send('Failed to update product');
    }
};

exports.updateCollection = async (req, res) => {
    const { name, description } = req.body;
    try {
      await Collection.findByIdAndUpdate(req.params.id, { name, description });
      res.redirect('/admin/dashboard');
    } catch (err) {
      res.status(500).send('Failed to update collection');
    }
};    

exports.adminDashboard = async (req, res) => {
    try {
      const collections = await Collection.find();
      const products = await Product.find().populate('collectionRef');
  
      // Count products per collection
      const collectionCounts = {};
      collections.forEach(c => collectionCounts[c._id] = 0);
      products.forEach(p => collectionCounts[p.collection._id]++);

      for (const collection of collections) {
        const count = await Product.countDocuments({ collectionRef: collection._id });
        collectionCounts[collection._id] = count;
      }
  
      // Real stats
      const totalProducts = await Product.countDocuments();
      const totalCollections = await Collection.countDocuments();
      const totalOrders = await Order.countDocuments();
      const totalCustomers = await User.countDocuments();
  
      // Calculate total sales from all orders
      const orders = await Order.find();
      const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

      // Fetch recent orders (last 5 orders)
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
            path: 'user',
            select: 'name email phone address'
        })
          .populate({
            path: 'items.product',
            select: 'name'
          })
        .lean();

        // Add formatted date and process items
    recentOrders.forEach(order => {
        order.formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        
        // Ensure product names are available
        order.items.forEach(item => {
          if (item.product && item.product.name) {
            item.name = item.product.name;
          } else {
            item.name = 'Unknown Product';
          }
        });
      });
  
      res.render('adminDashboard', {
        collections,
        products,
        collectionCounts,
        totalProducts,
        totalCollections,
        totalOrders,
        totalCustomers,
        totalSales,
        recentOrders
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Dashboard error');
    }
};

exports.exportRecentOrders = async (req, res) => {
    try {
        const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .populate({
          path: 'user',
          select: 'name email phone address'
        })
        .populate({
          path: 'items.product',
          select: 'name'
        });
  
      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Recent Orders');
      
      // Add headers with new columns
      worksheet.columns = [
        { header: 'Order ID', key: 'id', width: 15 },
        { header: 'Date', key: 'date', width: 20 },
        { header: 'Customer', key: 'customer', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone', width: 20 },
        { header: 'Address', key: 'address', width: 40 },
        { header: 'Items', key: 'items', width: 40 },
        { header: 'Total (₦)', key: 'total', width: 15, style: { numFmt: '#,##0.00' } },
        { header: 'Status', key: 'status', width: 20 },
        { header: 'Payment Method', key: 'paymentMethod', width: 20 }
      ];
  
      // Add data rows
      recentOrders.forEach(order => {
        // Format items with product names
        const itemsString = order.items.map(item => {
          const productName = item.product?.name || 'Unknown Product';
          return `${productName} × ${item.quantity}`;
        }).join('\n');
  
        worksheet.addRow({
          id: order._id.toString(),
          date: order.createdAt.toLocaleString(),
          customer: order.user ? order.user.name : 'Guest',
          email: order.user ? order.user.email : 'N/A',
          phone: order.user ? order.user.phone : 'N/A',
          address: order.user ? order.user.address : 'N/A',
          items: itemsString,
          total: order.total,
          status: order.status,
          paymentMethod: order.paymentInfo.method || 'Paystack'
        });
        
        // Set row height to accommodate multiple items
        const row = worksheet.lastRow;
        row.height = Math.max(20, order.items.length * 15);
        
        // Enable text wrapping for items and address columns
        row.getCell('items').alignment = { wrapText: true };
        row.getCell('address').alignment = { wrapText: true };
      });
  
      // Style header row
      worksheet.getRow(1).eachCell(cell => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD1D1D1' }
        };
      });
  
      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=recent_orders.xlsx'
      );
  
      // Send the workbook
      await workbook.xlsx.write(res);
      res.end();
  
    } catch (err) {
      console.error('Export error:', err);
      res.status(500).send('Error generating export');
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
      const { orderId, status } = req.body;
      const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json({ 
        success: true, 
        status: updatedOrder.status,
        statusText: getStatusText(updatedOrder.status),
        statusClass: getStatusClass(updatedOrder.status)
      });
    } catch (err) {
      console.error('Status update error:', err);
      res.status(500).json({ error: 'Failed to update status' });
    }
};
  
  // Helper functions
function getStatusText(status) {
    const map = {
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return map[status] || status;
}
  
function getStatusClass(status) {
    const map = {
      'processing': 'processing',
      'shipped': 'shipped',
      'delivered': 'completed',
      'cancelled': 'cancelled'
    };
    return map[status] || 'processing';
}
  
exports.viewCollections = async (req, res) => {
    try {
      const collections = await Collection.find();
      
      // Get product counts for each collection
      const collectionCounts = {};
      for (const collection of collections) {
        const count = await Product.countDocuments({ collectionRef: collection._id });
        collectionCounts[collection._id] = count;
      }
      
      res.render('adminCollections', {
        collections,
        collectionCounts // Make sure this is passed to the view
      });
    } catch (err) {
      console.error('Error loading collections:', err);
      res.status(500).send('Error loading collections');
    }
};

exports.viewProducts = async (req, res) => {
    try {
      const products = await Product.find().populate('collectionRef');
      const collections = await Collection.find();
      
      res.render('adminProducts', {
        products,
        collections
      });
    } catch (err) {
      console.error('Error loading products:', err);
      res.status(500).send('Error loading products');
    }
};

exports.viewOrders = async (req, res) => {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate('user', 'name email phone address')
        .populate('items.product', 'name');
      
      // Format orders with contact information
      const formattedOrders = orders.map(order => {
        const contactAddress = order.user ? 
          order.user.address : 
          `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}`;
        
        return {
          ...order.toObject(),
          formattedDate: new Date(order.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          contactEmail: order.user ? order.user.email : order.shippingInfo.email,
          contactPhone: order.user ? order.user.phone : order.shippingInfo.phone,
          contactAddress
        };
      });
      
      res.render('adminOrders', {
        orders: formattedOrders
      });
    } catch (err) {
      console.error('Error loading orders:', err);
      res.status(500).send('Error loading orders');
    }
};

exports.viewCustomers = async (req, res) => {
    try {
      const customers = await User.find().sort({ createdAt: -1 });
      
      res.render('adminCustomers', {
        customers
      });
    } catch (err) {
      console.error('Error loading customers:', err);
      res.status(500).send('Error loading customers');
    }
};


