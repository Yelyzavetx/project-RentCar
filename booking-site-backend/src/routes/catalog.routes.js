const express = require('express');
const catalogController = require('../controllers/catalog.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @route GET /api/catalog
 * @desc Отримання усіх елементів каталогу
 * @access Public
 */
router.get('/', catalogController.getAllItems);

/**
 * @route GET /api/catalog/:id
 * @desc Отримання елементу каталогу за ID
 * @access Public
 */
router.get('/:id', catalogController.getItemById);

/**
 * @route POST /api/catalog
 * @desc Створення нового елементу каталогу
 * @access Private (тільки для адміністраторів)
 */
router.post('/', authenticate, authorize('ADMIN'), catalogController.createItem);

/**
 * @route PUT /api/catalog/:id
 * @desc Оновлення елементу каталогу
 * @access Private (тільки для адміністраторів)
 */
router.put('/:id', authenticate, authorize('ADMIN'), catalogController.updateItem);

/**
 * @route DELETE /api/catalog/:id
 * @desc Видалення елементу каталога
 * @access Private (тільки для адміністраторів)
 */
router.delete('/:id', authenticate, authorize('ADMIN'), catalogController.deleteItem);

module.exports = router;