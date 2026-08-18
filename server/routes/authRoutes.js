const express = require('express');
const router = express.Router();
const { checkPhone, login, register, getUsers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/check-phone', checkPhone);
router.post('/login', login);
router.post('/register', protect, adminOnly, register);
router.get('/users', protect, adminOnly, getUsers);

module.exports = router;
