const express = require('express');
const authRoutes = require('./auth.routes');
const catalogRoutes = require('./catalog.routes');
const bookingRoutes = require('./booking.routes');
const rateRoutes = require('./rate.routes');
const reviewRoutes = require('./review.routes');
const contactRoutes = require('./contact.routes');

const router = express.Router();

/**
 * Маршрути API
 */
router.use('/auth', authRoutes);
router.use('/catalog', catalogRoutes);
router.use('/bookings', bookingRoutes);
router.use('/rates', rateRoutes);
router.use('/reviews', reviewRoutes);
router.use('/contacts', contactRoutes);

module.exports = router;