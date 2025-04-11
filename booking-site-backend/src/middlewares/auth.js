const jwt = require('jsonwebtoken');
const { APIError } = require('./error');
const config = require('../config/config');
const prisma = require('../models/prisma');

/**
 * Middleware для перевірки JWT токену
 */
const authenticate = async (req, res, next) => {
  try {
    // Отримуємо токен з заголовку Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new APIError('Не наданий токен аутентифікації', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new APIError('Не наданий токен аутентифікації', 401);
    }
    
    // Верифікуємо JWT токен
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Перевіряємо, чи існує користувач
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    
    if (!user) {
      throw new APIError('Користувач більше не існує', 401);
    }
    
    // Добавляємо інформацію про користувача в об'єкт запиту
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new APIError('Недійсний токен', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new APIError('Строк дійсності токена минув', 401));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware для перевірки ролі користувача
 */
const authorize = (roles = []) => {
  // Перетворимо стрічку у масив, якщо була передана одна роль
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return (req, res, next) => {
    if (!req.user) {
      return next(new APIError('Необхідна аутентифікація перед авторизацієй', 401));
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return next(new APIError('У вас немає прав для доступу до цього ресурсу', 403));
    }
    
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};