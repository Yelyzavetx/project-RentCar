const express = require('express');
const contactController = require('../controllers/contact.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @route GET /api/contacts
 * @desc Отримання усіх контактів
 * @access Public
 */
router.get('/', contactController.getAllContacts);

/**
 * @route GET /api/contacts/type/:type
 * @desc Отримання контактів за типом
 * @access Public
 */
router.get('/type/:type', contactController.getContactsByType);

/**
 * @route GET /api/contacts/:id
 * @desc Отримання контакту за ID
 * @access Public
 */
router.get('/:id', contactController.getContactById);

/**
 * @route POST /api/contacts
 * @desc Створення нового контакту
 * @access Private (тільки для адміністраторів)
 */
router.post('/', authenticate, authorize('ADMIN'), contactController.createContact);

/**
 * @route PUT /api/contacts/:id
 * @desc Оновлення контакту
 * @access Private (тільки для адміністраторів)
 */
router.put('/:id', authenticate, authorize('ADMIN'), contactController.updateContact);

/**
 * @route DELETE /api/contacts/:id
 * @desc Видалення контакта
 * @access Private (тільки для адміністраторів)
 */
router.delete('/:id', authenticate, authorize('ADMIN'), contactController.deleteContact);

module.exports = router;