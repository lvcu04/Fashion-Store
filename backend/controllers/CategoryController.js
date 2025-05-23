const { get } = require('http');
const Category = require('../models/Category');

const categoriesController = {
    getAllcategories: async (req, res) => {
        try {
            const categories = await Category.find();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching category' });
        }
    },
    getCategoriesById: async (req, res) => {
        const { category_id } = req.params;
        try {
            const categories = await Category.findOne({category_id});
            if (!categories) {     
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching category' });
        }
    },
    // createCategories, updateCategories, deleteCategories...


    // createCategories
    addCategories: async (req, res) => {
        const { category_id, categoryName, slug, status}= req.body;
        try {
             if (!category_id || !categoryName) {
                  return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
                }
            
                const exists = await Category.findOne({ category_id });
                if (exists) {
                  return res.status(409).json({ message: 'Mã loại hàng đã tồn tại' });
                }
            
            const newCategories = new Category({ category_id, categoryName, slug, status });
            await newCategories.save();
            res.status(201).json(newCategories);
        } catch (error) {
            res.status(500).json({ error: 'Error creating categories' });
        }
    },
    //editCategories
    editCategories: async (req, res) => {
        const { category_id, categoryName, slug, status } = req.body;
        try {
            const updatedCategories = await Category.findOneAndUpdate(
                { category_id },
                { categoryName, slug, status  },
                { new: true }
            );
            if (!updatedCategories) {
                return res.status(404).json({ message: 'Categories not found' });
            }
            res.status(200).json(updatedCategories);
        } catch (error) {
            res.status(500).json({ error: 'Error updating categories' });
        }
    },
    //deleteCategories
    deleteCategories: async (req, res) => {
        const { category_id } = req.params;
        try {
            const deletedCategories = await Category.findOneAndDelete( category_id );
            if (!deletedCategories) {
                return res.status(404).json({ message: 'Category not found' });
            }   
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting category' });
        }
    },
}
module.exports = categoriesController;