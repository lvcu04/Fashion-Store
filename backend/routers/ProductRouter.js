const express = require('express');
// const verifyToken = require('../middleware/authMiddleware');
const ProductController = require('../controllers/ProductController');
const upload = require('../middleware/upload');
const multer = require('multer');


const router = express.Router();

router.get('/allProduct', ProductController.getAllProducts);// http://localhost:5000/api/product/allProduct
router.get('/allProductHot', ProductController.getAllProductsHot);// http://localhost:5000/api/product/allProductHot
router.get('/:product_id', ProductController.getProductById);// http://localhost:5000/api/product/:id
router.post('/addProduct',upload.single('image'), ProductController.addProduct);// http://localhost:5000/api/product/addProduct
router.put('/editProduct/:product_id', upload.single('image'), ProductController.editProduct);// http://localhost:5000/api/product/editProduct
router.delete('/deleteProduct/:id', ProductController.deleteProduct);// http://localhost:5000/api/product/deleteProduct/:id
module.exports = router;
