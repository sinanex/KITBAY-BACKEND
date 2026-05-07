const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String },
  team: { type: String },
  category: { type: String, required: true },
  subcategory: { type: String },
  price: { type: Number, required: true },
  discount_price: { type: Number },
  currency: { type: String, default: 'INR' },
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  customNameNumber: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviews_count: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Product', productSchema);
