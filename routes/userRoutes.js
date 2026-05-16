const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update User Profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add Address
router.post('/address', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.addresses.push(req.body);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// --- Cart Routes ---

// Get Cart
router.get('/cart', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('cart.product');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to Cart
router.post('/cart', authMiddleware, async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const user = await User.findById(req.user.userId);
    
    // Check if item already exists in cart
    const existingItem = user.cart.find(item => 
      item.product.toString() === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += (quantity || 1);
    } else {
      user.cart.push({ product: productId, size, quantity: quantity || 1 });
    }

    await user.save();
    const updatedUser = await User.findById(req.user.userId).populate('cart.product');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk Add to Cart
router.post('/cart/bulk', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    const user = await User.findById(req.user.userId);
    for (const item of items) {
      const existingItem = user.cart.find(ci => ci.product.toString() === item.productId && ci.size === item.size);
      if (existingItem) existingItem.quantity += (item.quantity || 1);
      else user.cart.push({ product: item.productId, size: item.size, quantity: item.quantity || 1 });
    }
    await user.save();
    const updatedUser = await User.findById(req.user.userId).populate('cart.product');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Cart Item Quantity
router.put('/cart/:itemId', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.userId);
    
    const cartItem = user.cart.id(req.params.itemId);
    if (!cartItem) return res.status(404).json({ message: 'Item not found' });
    
    cartItem.quantity = quantity;
    await user.save();
    
    const updatedUser = await User.findById(req.user.userId).populate('cart.product');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove from Cart
router.delete('/cart/:itemId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.cart.pull(req.params.itemId);
    await user.save();
    
    const updatedUser = await User.findById(req.user.userId).populate('cart.product');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Users (Admin Only)
router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
