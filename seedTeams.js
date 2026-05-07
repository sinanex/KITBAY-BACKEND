const mongoose = require('mongoose');
require('dotenv').config();
const Team = require('./models/Team');

const seedTeams = [
  // FOOTBALL - European Clubs
  { name: 'Manchester United', sport: 'Football', type: 'Club' },
  { name: 'Manchester City', sport: 'Football', type: 'Club' },
  { name: 'Liverpool FC', sport: 'Football', type: 'Club' },
  { name: 'Chelsea FC', sport: 'Football', type: 'Club' },
  { name: 'Arsenal FC', sport: 'Football', type: 'Club' },
  { name: 'Tottenham Hotspur', sport: 'Football', type: 'Club' },
  { name: 'Real Madrid CF', sport: 'Football', type: 'Club' },
  { name: 'FC Barcelona', sport: 'Football', type: 'Club' },
  { name: 'Atletico Madrid', sport: 'Football', type: 'Club' },
  { name: 'Bayern Munich', sport: 'Football', type: 'Club' },
  { name: 'Borussia Dortmund', sport: 'Football', type: 'Club' },
  { name: 'Paris Saint-Germain', sport: 'Football', type: 'Club' },
  { name: 'Juventus FC', sport: 'Football', type: 'Club' },
  { name: 'AC Milan', sport: 'Football', type: 'Club' },
  { name: 'Inter Milan', sport: 'Football', type: 'Club' },
  
  // FOOTBALL - Global Clubs
  { name: 'Al Nassr FC', sport: 'Football', type: 'Club' },
  { name: 'Al Hilal SFC', sport: 'Football', type: 'Club' },
  { name: 'Inter Miami CF', sport: 'Football', type: 'Club' },
  { name: 'LA Galaxy', sport: 'Football', type: 'Club' },

  // FOOTBALL - National Teams
  { name: 'Argentina (Football)', sport: 'Football', type: 'International' },
  { name: 'Brazil (Football)', sport: 'Football', type: 'International' },
  { name: 'France (Football)', sport: 'Football', type: 'International' },
  { name: 'England (Football)', sport: 'Football', type: 'International' },
  { name: 'Germany (Football)', sport: 'Football', type: 'International' },
  { name: 'Spain (Football)', sport: 'Football', type: 'International' },
  { name: 'Portugal (Football)', sport: 'Football', type: 'International' },
  { name: 'Italy (Football)', sport: 'Football', type: 'International' },
  { name: 'Belgium (Football)', sport: 'Football', type: 'International' },
  { name: 'Netherlands (Football)', sport: 'Football', type: 'International' },

  // CRICKET - National Teams
  { name: 'India (Cricket)', sport: 'Cricket', type: 'International' },
  { name: 'Australia (Cricket)', sport: 'Cricket', type: 'International' },
  { name: 'England (Cricket)', sport: 'Cricket', type: 'International' },
  { name: 'Pakistan (Cricket)', sport: 'Cricket', type: 'International' },
  { name: 'South Africa (Cricket)', sport: 'Cricket', type: 'International' },
  { name: 'New Zealand (Cricket)', sport: 'Cricket', type: 'International' },
  { name: 'West Indies (Cricket)', sport: 'Cricket', type: 'International' },

  // CRICKET - IPL Clubs
  { name: 'Mumbai Indians', sport: 'Cricket', type: 'Club' },
  { name: 'Chennai Super Kings', sport: 'Cricket', type: 'Club' },
  { name: 'Royal Challengers Bengaluru', sport: 'Cricket', type: 'Club' },
  { name: 'Kolkata Knight Riders', sport: 'Cricket', type: 'Club' },
  { name: 'Rajasthan Royals', sport: 'Cricket', type: 'Club' },
  { name: 'Gujarat Titans', sport: 'Cricket', type: 'Club' },
  { name: 'Lucknow Super Giants', sport: 'Cricket', type: 'Club' },
  { name: 'Sunrisers Hyderabad', sport: 'Cricket', type: 'Club' },
  { name: 'Delhi Capitals', sport: 'Cricket', type: 'Club' },
  { name: 'Punjab Kings', sport: 'Cricket', type: 'Club' },

  // BASKETBALL - NBA Clubs
  { name: 'Los Angeles Lakers', sport: 'Basketball', type: 'Club' },
  { name: 'Golden State Warriors', sport: 'Basketball', type: 'Club' },
  { name: 'Boston Celtics', sport: 'Basketball', type: 'Club' },
  { name: 'Chicago Bulls', sport: 'Basketball', type: 'Club' },
  { name: 'Miami Heat', sport: 'Basketball', type: 'Club' },
  { name: 'Milwaukee Bucks', sport: 'Basketball', type: 'Club' },

  // BASKETBALL - National Teams
  { name: 'USA (Basketball)', sport: 'Basketball', type: 'International' },
  { name: 'Spain (Basketball)', sport: 'Basketball', type: 'International' }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing teams
    console.log('Clearing existing teams...');
    await Team.deleteMany({});
    console.log('Cleared existing teams.');

    // Insert seeded teams
    console.log('Seeding 50+ professional sports teams...');
    const created = await Team.insertMany(seedTeams);
    console.log(`Successfully seeded ${created.length} teams in the database!`);

    mongoose.disconnect();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.error('Seeding teams failed:', error);
    process.exit(1);
  }
}

seed();
