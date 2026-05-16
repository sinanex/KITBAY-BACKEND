const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  imageUrl: { type: String, required: true },
  buttonText: { type: String, default: 'Shop Now' },
  linkUrl: { type: String, default: '/' }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
