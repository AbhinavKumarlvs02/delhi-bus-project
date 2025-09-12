const express = require('express');
const router = express.Router();
const { getBuses, addBus, updateBus, deleteBus } = require('../controllers/busController');
const { protect, admin } = require('../Middlewares/authMiddleware');

router.route('/')
  .get(protect, getBuses)
  .post(protect, admin, addBus);

router.route('/:id')
  .put(protect, admin, updateBus)
  .delete(protect, admin, deleteBus);

module.exports = router;