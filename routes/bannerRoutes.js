const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { uploadBanner } = require('../config/cloudinary');
const authMiddleware = require('../middleware/authMiddleware');

// Get All Banners (Public)
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    if (banners.length === 0) {
      // Create a default banner if none exists
      const defaultBanner = new Banner({
        title: 'Wear Your Passion',
        subtitle: 'Experience the game in peak performance gear. Engineered for the fans, designed for the pros.',
        imageUrl: 'https://images.unsplash.com/photo-1541002442-9f5985aa8023',
        buttonText: 'Shop Now'
      });
      await defaultBanner.save();
      return res.status(200).json([defaultBanner]);
    }
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add New Banner (Admin Only)
router.post('/', authMiddleware, uploadBanner.single('image'), async (req, res) => {
  try {
    const { title, subtitle, buttonText, linkUrl } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Banner image is required' });
    }

    const newBanner = new Banner({ title, subtitle, buttonText, imageUrl, linkUrl });
    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Banner (Admin Only)
router.put('/:id', authMiddleware, uploadBanner.single('image'), async (req, res) => {
  try {
    const { title, subtitle, buttonText, linkUrl } = req.body;
    const updateData = { title, subtitle, buttonText, linkUrl };
    
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    
    res.status(200).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Banner (Admin Only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
