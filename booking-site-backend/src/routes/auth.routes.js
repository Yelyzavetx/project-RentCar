const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Реєстрація нового користувача
 * @access Public
 */
router.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @desc Авторизація користувача
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route GET /api/auth/me
 * @desc Отримання інформації про поточного користувача
 * @access Private
 */
router.get('/me', authenticate, authController.me);

module.exports = router;