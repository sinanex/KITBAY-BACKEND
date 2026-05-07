const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');

const seedCategories = [
  {
    name: 'Football Jerseys',
    subcategories: [
      'Premier League',
      'La Liga',
      'Serie A',
      'Bundesliga',
      'Ligue 1',
      'International Teams',
      'Retro Classics'
    ]
  },
  {
    name: 'Cricket Jerseys',
    subcategories: [
      'IPL (Indian Premier League)',
      'International T20',
      'ODI Kits',
      'Test Whites',
      'BBL (Big Bash League)'
    ]
  },
  {
    name: 'Basketball Jerseys',
    subcategories: [
      'NBA Clubs',
      'National Teams',
      'Retro Classics',
      'All-Star Kits'
    ]
  },
  {
    name: 'Retro & Vintage',
    subcategories: [
      '90s Football Classics',
      'Vintage Club Jerseys',
      'Historic World Cup Kits',
      'Legend Editions'
    ]
  },
  {
    name: 'Training & Activewear',
    subcategories: [
      'Training Tees',
      'Windbreakers & Jackets',
      'Track Pants',
      'Pre-Match Jerseys',
      'Compression Wear'
    ]
  },
  {
    name: 'Accessories & Merch',
    subcategories: [
      'Caps & Beanies',
      'Club Scarves',
      'Gym Bags',
      'Water Bottles',
      'Arm Sleeves & Socks'
    ]
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing categories
    console.log('Clearing existing categories...');
    await Category.deleteMany({});
    console.log('Cleared existing categories.');

    // Insert seeded categories
    console.log('Seeding sports categories & subcategories...');
    const created = await Category.insertMany(seedCategories);
    console.log(`Successfully seeded ${created.length} main categories and their subcategories!`);

    mongoose.disconnect();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
