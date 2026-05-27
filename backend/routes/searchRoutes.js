const express = require('express');
const router = express.Router();
const { searchCustomers } = require('../controllers/searchController');
const { searchLimiter } = require('../middleware/rateLimiter');

router.use(searchLimiter);

router.get('/customers', searchCustomers);

// OPTIONS
router.options('/customers', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').json({ methods: ['GET', 'OPTIONS'] });
});

module.exports = router;
