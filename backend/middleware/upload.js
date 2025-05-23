const multer = require('multer');
const { storage } = require('../config/cloudinary'); // phải đúng

const upload = multer({ storage });

module.exports = upload;
