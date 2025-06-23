const MarketplaceItem = require('../models/marketplaceModel');
const path = require('path');

const seedMarketplaceItems = async () => {
  try {

    const items = [
      {
        name: 'Golden Avatar Frame',
        description: 'A beautiful golden frame for your profile picture',
        price: 100,
        category: 'avatar',
        rarity: 'rare',
        imageUrl: 'https://res.cloudinary.com/ds5mmgach/image/upload/v1750608564/QuestLife/89ba0252-3e2b-431f-a372-6700427c4507.png',
        levelRequired: 5,
     
      },
      {
        name: 'Dragon Badge',
        description: 'Show off your legendary status with this dragon badge',
        price: 500,
        category: 'badge',
        rarity: 'legendary',
        imageUrl: 'https://via.placeholder.com/150/FF4500/FFFFFF?text=Dragon',
        levelRequired: 15,
      
      },
      {
        name: 'Dark Theme',
        description: 'Switch to a sleek dark theme for better eye comfort',
        price: 75,
        category: 'theme',
        rarity: 'common',
        imageUrl: 'https://res.cloudinary.com/ds5mmgach/image/upload/v1750608159/QuestLife/4bd61adc-8298-485b-a263-42e0fda4f1dc.png',
        levelRequired: 3,
        
      },
      {
        name: 'XP Boost (1 Hour)',
        description: 'Double your XP earnings for 1 hour',
        price: 50,
        category: 'boost',
        rarity: 'epic',
        imageUrl: 'https://res.cloudinary.com/ds5mmgach/image/upload/v1750607467/QuestLife/xpBoost_ckrywd.webp',
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
        
      },
      {
        name: 'Rainbow Avatar Frame',
        description: 'Colorful rainbow frame to brighten your profile',
        price: 150,
        category: 'avatar',
        rarity: 'epic',
        imageUrl: 'https://via.placeholder.com/150/FF69B4/FFFFFF?text=Rainbow',
        levelRequired: 8,
       
      },
      {
        name: 'Achievement Hunter Badge',
        description: 'For those who complete every task',
        price: 300,
        category: 'badge',
        rarity: 'rare',
        imageUrl: 'https://via.placeholder.com/150/9370DB/FFFFFF?text=Achievement',
        levelRequired: 12,
      
      },
      {
        name: 'Neon Theme',
        description: 'Bright neon colors for a vibrant experience',
        price: 120,
        category: 'theme',
        rarity: 'rare',
        imageUrl: 'https://res.cloudinary.com/ds5mmgach/image/upload/v1750608501/QuestLife/17f0f287-f899-4491-a592-56757059f748.png',
        levelRequired: 6
      },
      {
        name: 'Coin Multiplier (30 min)',
        description: 'Earn 1.5x coins for 30 minutes',
        price: 80,
        category: 'boost',
        rarity: 'rare',
        imageUrl: 'https://res.cloudinary.com/ds5mmgach/image/upload/v1750608301/QuestLife/7a44d510-3c0e-4c49-96cc-7f552996f7b4.png',
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

    console.log('Marketplace seeded successfully with', items.length, 'items');
    
  } catch (error) {
    console.error('Error seeding marketplace:', error);
  }
};

module.exports = { seedMarketplaceItems };