const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../models/prisma');
const { APIError } = require('../middlewares/error');
const config = require('../config/config');

/**
 * Реєстрація нового користувача
 */
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    // Перевіряємо, чи існує користувач з таким email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      throw new APIError('Користувач з таким email вже існує', 400);
    }
    
    // Хешуємо пароль перед зберіганням
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Створюємо нового користувача
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    
    // Генеруємо JWT токен
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
    
    // Прибираємо пароль з відповіді
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      status: 'success',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Авторизація користувача
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Находим пользователя по email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new APIError('Невірний email або пароль', 401);
    }
    
    // Перевіряємо пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new APIError('Невірний email або пароль', 401);
    }
    
    // Генеруємо JWT токен
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
    
    // Прибираємо пароль з відповіді
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      status: 'success',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Отримання інформації про поточного користувача
 */
const me = async (req, res, next) => {
  try {
    //Користувач вже доступний з middleware authenticate
    const { password: _, ...userWithoutPassword } = req.user;
    
    res.status(200).json({
      status: 'success',
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  me,
};