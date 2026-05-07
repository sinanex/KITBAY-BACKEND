const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  sport: { type: String, required: true, trim: true },
  type: { type: String, enum: ['Club', 'International'], required: true },
  logo: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
