const express = require('express');
const bookingController = require('../controllers/booking.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @route GET /api/bookings
 * @desc Отримання усіх бронювань
 * @access Private (користувачі бачать тільки свої, адміністратори - все)
 */
router.get('/', authenticate, bookingController.getAllBookings);

/**
 * @route GET /api/bookings/:id
 * @desc Отримання бронювання за ID
 * @access Private (користувачі бачать тільки свої, адміністратори - все)
 */
router.get('/:id', authenticate, bookingController.getBookingById);

/**
 * @route POST /api/bookings
 * @desc Створення нового бронювання
 * @access Private
 */
router.post('/', authenticate, bookingController.createBooking);

/**
 * @route PATCH /api/bookings/:id/status
 * @desc Оновлення статусу бронювання
 * @access Private (користувачі могуть тільки відмінити свої бронювання, адміністратори - будь-які зміни)
 */
router.patch('/:id/status', authenticate, bookingController.updateBookingStatus);

/**
 * @route DELETE /api/bookings/:id
 * @desc Видалення бронювання
 * @access Private (тільки для адміністраторів)
 */
router.delete('/:id', authenticate, authorize('ADMIN'), bookingController.deleteBooking);

module.exports = router;