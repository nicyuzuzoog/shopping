const express = require('express');
const router = express.Router();
const { createSale, getSales, getDashboardSummary } = require('../controllers/saleController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSale);
router.get('/', protect, getSales);

module.exports = router;
