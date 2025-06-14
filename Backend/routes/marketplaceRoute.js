const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getMarketplaceItems,
  purchaseItem,
  getUserInventory,
  toggleEquipItem,
  getEquippedItems
} = require('../controllers/marketplaceController');

// Public routes (no auth required)
router.get('/items', getMarketplaceItems);

// Protected routes (auth required)
router.use(auth);

router.post('/purchase', purchaseItem);
router.get('/inventory', getUserInventory);
router.get('/equipped', getEquippedItems);
router.put('/equip/:inventoryId', toggleEquipItem);

module.exports = router; 