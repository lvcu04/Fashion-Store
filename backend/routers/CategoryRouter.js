const express = require('express');
const CategoryController = require('../controllers/CategoryController');

const router = express.Router();

router.get('/allCategory', CategoryController.getAllcategories); // http://localhost:5000/api/category/allCategory
router.get('/:category_id', CategoryController.getCategoriesById); // http://localhost:5000/api/category/:category_id
router.post('/addCategory', CategoryController.addCategories); // http://localhost:5000/api/category/addCategory
router.put('/editCategory/:category_id', CategoryController.editCategories); // http://localhost:5000/api/category/editCategory/:category_id
router.delete('/deleteCategory/:category_id', CategoryController.deleteCategories); // http://localhost:5000/api/category/deleteCategory/:category_id
module.exports = router;