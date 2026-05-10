const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { upload } = require('../config/cloudinary');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const productData = { ...req.body };
  
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => file.path);
    }

    if (typeof productData.sizes === 'string') {
      try {
        productData.sizes = JSON.parse(productData.sizes);
      } catch (e) {}
    }
    if (typeof productData.colors === 'string') {
      try {
        productData.colors = JSON.parse(productData.colors);
      } catch (e) {}
    }

    // Cast numbers and handle empty optional fields to prevent Mongoose validation/casting errors
    if (productData.price !== undefined && productData.price !== '') {
      productData.price = Number(productData.price);
    }

    if (productData.discount_price === '' || productData.discount_price === null || productData.discount_price === undefined) {
      delete productData.discount_price;
    } else {
      productData.discount_price = Number(productData.discount_price);
    }

    if (productData.stock === '' || productData.stock === null || productData.stock === undefined) {
      productData.stock = 0;
    } else {
      productData.stock = Number(productData.stock);
    }

    // Remove other empty optional fields so we don't save empty strings in MongoDB
    const optionalStringFields = ['brand', 'team', 'subcategory'];
    optionalStringFields.forEach(field => {
      if (productData[field] === '') {
        delete productData[field];
      }
    });

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const productData = { ...req.body };

    if (typeof productData.sizes === 'string') {
      try {
        productData.sizes = JSON.parse(productData.sizes);
      } catch (e) {}
    }
    if (typeof productData.colors === 'string') {
      try {
        productData.colors = JSON.parse(productData.colors);
      } catch (e) {}
    }

    if (productData.imageSlots) {
      const slots = JSON.parse(productData.imageSlots);
      const newFiles = req.files || [];
      let fileIndex = 0;
      
      const finalImages = [];
      for (const slot of slots) {
        if (slot.startsWith('new_')) {
          if (newFiles[fileIndex]) {
            finalImages.push(newFiles[fileIndex].path);
            fileIndex++;
          }
        } else if (slot !== 'empty') {
          finalImages.push(slot);
        }
      }
      productData.images = finalImages;
    } else if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => file.path);
    }

    // Cast numbers and handle empty strings to prevent Mongoose validation/casting errors
    const updateQuery = { ...productData };
    const unsetFields = {};

    if (updateQuery.price !== undefined && updateQuery.price !== '') {
      updateQuery.price = Number(updateQuery.price);
    }

    if (updateQuery.discount_price === '' || updateQuery.discount_price === null || updateQuery.discount_price === undefined) {
      delete updateQuery.discount_price;
      unsetFields.discount_price = 1;
    } else {
      updateQuery.discount_price = Number(updateQuery.discount_price);
    }

    if (updateQuery.stock === '' || updateQuery.stock === null || updateQuery.stock === undefined) {
      updateQuery.stock = 0;
    } else {
      updateQuery.stock = Number(updateQuery.stock);
    }

    // Unset other empty string optional fields to keep DB clean and prevent cast issues
    const optionalStringFields = ['brand', 'team', 'subcategory'];
    optionalStringFields.forEach(field => {
      if (updateQuery[field] === '') {
        delete updateQuery[field];
        unsetFields[field] = 1;
      }
    });

    if (Object.keys(unsetFields).length > 0) {
      updateQuery.$unset = unsetFields;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      updateQuery, 
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
