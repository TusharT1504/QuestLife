const MarketplaceItem = require('../models/marketplaceModel');
const UserInventory = require('../models/userInventoryModel');
const User = require('../models/userModel');

// Get all marketplace items
const getMarketplaceItems = async (req, res) => {
  try {
    const items = await MarketplaceItem.find({ isActive: true }).sort({ price: 1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    res.status(500).json({ message: 'Error fetching marketplace items' });
  }
};

// Purchase an item
const purchaseItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user.id;

    // Find the item
    const item = await MarketplaceItem.findById(itemId);
    if (!item || !item.isActive) {
      return res.status(404).json({ message: 'Item not found or not available' });
    }

    // Check if user has enough coins
    const user = await User.findById(userId);
    if (user.coins < item.price) {
      return res.status(400).json({ message: 'Insufficient coins' });
    }

    // Check if user meets level requirement
    if (user.level < item.levelRequired) {
      return res.status(400).json({ message: `Level ${item.levelRequired} required to purchase this item` });
    }

    // Check stock availability
    if (item.stock !== -1 && item.stock <= 0) {
      return res.status(400).json({ message: 'Item out of stock' });
    }

    // Deduct coins from user
    user.coins -= item.price;
    await user.save();

    // Reduce stock if not unlimited
    if (item.stock !== -1) {
      item.stock -= 1;
      await item.save();
    }

    // Add item to user inventory
    const inventoryItem = new UserInventory({
      userId,
      itemId,
    });
    await inventoryItem.save();

    res.json({
      message: 'Item purchased successfully',
      remainingCoins: user.coins,
      item: item
    });

  } catch (error) {
    console.error('Error purchasing item:', error);
    res.status(500).json({ message: 'Error purchasing item' });
  }
};

// Get user inventory
const getUserInventory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const inventory = await UserInventory.find({ userId })
      .populate('itemId')
      .sort({ purchasedAt: -1 });

    res.json(inventory);
  } catch (error) {
    console.error('Error fetching user inventory:', error);
    res.status(500).json({ message: 'Error fetching inventory' });
  }
};

// Equip/unequip item
const toggleEquipItem = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const userId = req.user.id;

    const inventoryItem = await UserInventory.findOne({ _id: inventoryId, userId });
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Item not found in inventory' });
    }

    inventoryItem.isEquipped = !inventoryItem.isEquipped;
    await inventoryItem.save();

    res.json({
      message: inventoryItem.isEquipped ? 'Item equipped' : 'Item unequipped',
      isEquipped: inventoryItem.isEquipped
    });

  } catch (error) {
    console.error('Error toggling item equip:', error);
    res.status(500).json({ message: 'Error toggling item equip' });
  }
};

// Get equipped items
const getEquippedItems = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const equippedItems = await UserInventory.find({ userId, isEquipped: true })
      .populate('itemId');

    res.json(equippedItems);
  } catch (error) {
    console.error('Error fetching equipped items:', error);
    res.status(500).json({ message: 'Error fetching equipped items' });
  }
};

module.exports = {
  getMarketplaceItems,
  purchaseItem,
  getUserInventory,
  toggleEquipItem,
  getEquippedItems
}; 