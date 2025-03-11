const express = require('express');
const rateController = require('../controllers/rate.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @route GET /api/rates
 * @desc Отримання усіх тарифів
 * @access Public
 */
router.get('/', rateController.getAllRates);

/**
 * @route GET /api/rates/:id
 * @desc Отримання тарифу за ID
 * @access Public
 */
router.get('/:id', rateController.getRateById);

/**
 * @route POST /api/rates
 * @desc Створення нового тарифу
 * @access Private (тільки для адміністраторів)
 */
router.post('/', authenticate, authorize('ADMIN'), rateController.createRate);

/**
 * @route PUT /api/rates/:id
 * @desc Оновлення тарифу
 * @access Private (тільки для адміністраторів)
 */
router.put('/:id', authenticate, authorize('ADMIN'), rateController.updateRate);

/**
 * @route DELETE /api/rates/:id
 * @desc Видалення тарифу
 * @access Private (тільки для адміністраторів)
 */
router.delete('/:id', authenticate, authorize('ADMIN'), rateController.deleteRate);

module.exports = router;