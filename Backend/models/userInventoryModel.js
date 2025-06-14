const mongoose = require("mongoose");

const userInventorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MarketplaceItem',
      required: true,
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
    isEquipped: {
      type: Boolean,
      default: false,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
userInventorySchema.index({ userId: 1, itemId: 1 });

const UserInventory = mongoose.model("UserInventory", userInventorySchema);
module.exports = UserInventory; 