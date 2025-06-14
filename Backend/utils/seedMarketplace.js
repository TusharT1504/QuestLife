const MarketplaceItem = require('../models/marketplaceModel');

const seedMarketplaceItems = async () => {
  try {
    const items = [
      {
        name: 'Golden Avatar Frame',
        description: 'A beautiful golden frame for your profile picture',
        price: 100,
        category: 'avatar',
        rarity: 'rare',
        imageUrl: 'https://via.placeholder.com/150/FFD700/000000?text=Golden+Frame',
        levelRequired: 5
      },
      {
        name: 'Dragon Badge',
        description: 'Show off your legendary status with this dragon badge',
        price: 500,
        category: 'badge',
        rarity: 'legendary',
        imageUrl: 'https://via.placeholder.com/150/FF4500/FFFFFF?text=Dragon',
        levelRequired: 15
      },
      {
        name: 'Dark Theme',
        description: 'Switch to a sleek dark theme for better eye comfort',
        price: 75,
        category: 'theme',
        rarity: 'common',
        imageUrl: 'https://via.placeholder.com/150/2C2C2C/FFFFFF?text=Dark+Theme',
        levelRequired: 3
      },
      {
        name: 'XP Boost (1 Hour)',
        description: 'Double your XP earnings for 1 hour',
        price: 50,
        category: 'boost',
        rarity: 'epic',
        imageUrl: 'https://via.placeholder.com/150/32CD32/FFFFFF?text=XP+Boost',
        levelRequired: 1,
        stock: 10
      },
      {
        name: 'Coffee Gift Card',
        description: 'Real $5 coffee gift card for your hard work',
        price: 200,
        category: 'real',
        rarity: 'epic',
        imageUrl: 'https://via.placeholder.com/150/8B4513/FFFFFF?text=Coffee',
        levelRequired: 10,
        stock: 5
      },
      {
        name: 'Rainbow Avatar Frame',
        description: 'Colorful rainbow frame to brighten your profile',
        price: 150,
        category: 'avatar',
        rarity: 'epic',
        imageUrl: 'https://via.placeholder.com/150/FF69B4/FFFFFF?text=Rainbow',
        levelRequired: 8
      },
      {
        name: 'Achievement Hunter Badge',
        description: 'For those who complete every task',
        price: 300,
        category: 'badge',
        rarity: 'rare',
        imageUrl: 'https://via.placeholder.com/150/9370DB/FFFFFF?text=Achievement',
        levelRequired: 12
      },
      {
        name: 'Neon Theme',
        description: 'Bright neon colors for a vibrant experience',
        price: 120,
        category: 'theme',
        rarity: 'rare',
        imageUrl: 'https://via.placeholder.com/150/00FF00/000000?text=Neon',
        levelRequired: 6
      },
      {
        name: 'Coin Multiplier (30 min)',
        description: 'Earn 1.5x coins for 30 minutes',
        price: 80,
        category: 'boost',
        rarity: 'rare',
        imageUrl: 'https://via.placeholder.com/150/FFD700/000000?text=Coin+Boost',
        levelRequired: 4,
        stock: 15
      },
      {
        name: 'Amazon Gift Card',
        description: 'Real $10 Amazon gift card',
        price: 400,
        category: 'real',
        rarity: 'legendary',
        imageUrl: 'https://via.placeholder.com/150/FF9900/FFFFFF?text=Amazon',
        levelRequired: 20,
        stock: 3
      }
    ];

    // Clear existing items
    await MarketplaceItem.deleteMany({});

    // Insert new items
    await MarketplaceItem.insertMany(items);

    console.log('✅ Marketplace seeded successfully with', items.length, 'items');
  } catch (error) {
    console.error('❌ Error seeding marketplace:', error);
  }
};

module.exports = { seedMarketplaceItems }; 