require('dotenv').config();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Verify Cloudinary config
if (!process.env.CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary credentials missing in .env file');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create storage engine with explicit folder and format
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ivory-beauty/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    format: 'webp', // Convert to efficient format
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

// Add file validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 // Only one file
  }
});

module.exports = upload;