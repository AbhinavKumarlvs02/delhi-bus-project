// server/routes/routeRoutes.js
const express = require('express');
const router = express.Router();
const { getRoutes, addRoute, updateRoute, deleteRoute } = require('../controllers/routeController');
const { protect, admin } = require('../Middlewares/authMiddleware');

router.route('/').get(protect, getRoutes).post(protect, admin, addRoute);
router.route('/:id').put(protect, admin, updateRoute).delete(protect, admin, deleteRoute);

module.exports = router;