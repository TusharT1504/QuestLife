const mongoose = require("mongoose");

const marketplaceItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['avatar', 'badge', 'theme', 'boost', 'real'],
      required: true,
    },
    imageUrl: {
      type: String,
    },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: -1, // -1 means unlimited
    },
    levelRequired: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const MarketplaceItem = mongoose.model("MarketplaceItem", marketplaceItemSchema);
module.exports = MarketplaceItem; 