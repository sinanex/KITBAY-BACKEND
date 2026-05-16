const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Create Order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount, shippingCharge, subtotal } = req.body;
    
    const newOrder = new Order({
      user: req.user.userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      shippingCharge,
      subtotal
    });

    const savedOrder = await newOrder.save();

    // Clear user cart after successful order
    await User.findByIdAndUpdate(req.user.userId, { $set: { cart: [] } });

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get User Orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get All Orders
router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'phone name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update Order Status
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
