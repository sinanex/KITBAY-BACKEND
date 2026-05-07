const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const authMiddleware = require('../middleware/authMiddleware');

// Get all categories and subcategories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new category
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({ name, subcategories: [] });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a subcategory to a category
router.post('/:id/subcategories', authMiddleware, async (req, res) => {
  try {
    const { subcategoryName } = req.body;
    if (!subcategoryName) {
      return res.status(400).json({ message: 'Subcategory name is required' });
    }

    const category = await Category.findById(req.id || req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if subcategory already exists (case-insensitive check)
    const exists = category.subcategories.some(
      sub => sub.toLowerCase() === subcategoryName.toLowerCase()
    );

    if (exists) {
      return res.status(400).json({ message: 'Subcategory already exists in this category' });
    }

    category.subcategories.push(subcategoryName);
    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a category
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a subcategory from a category
router.delete('/:id/subcategories/:subName', authMiddleware, async (req, res) => {
  try {
    const { id, subName } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.subcategories = category.subcategories.filter(
      sub => sub.toLowerCase() !== subName.toLowerCase()
    );

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
