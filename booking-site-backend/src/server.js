const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const prisma = require('./models/prisma');

// Обробка необроблених винятків
process.on('uncaughtException', (error) => {
  logger.error('Необроблений виняток:', error);
  process.exit(1);
});

// Ініціалізація сервера
const server = app.listen(config.port, () => {
  logger.info(`Сервер запущено на порту ${config.port} у ${config.env} режимі`);
});

// Перевірка з'єднання з базою даних
const checkDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    logger.info('З\'єднання з базою даних встановлено успішно');
  } catch (error) {
    logger.error('Помилка з\'єднання з базою даних:', error);
    process.exit(1);
  }
};

checkDatabaseConnection();

// Обробка необроблених відхилень промісів
process.on('unhandledRejection', (error) => {
  logger.error('Необроблене відхилення промісу:', error);
  // Коректне завершення сервера перед виходом
  server.close(() => {
    process.exit(1);
  });
});

// Обробка сигналів завершення для коректного завершення програми
process.on('SIGTERM', () => {
  logger.info('SIGTERM отримано, коректне завершення роботи...');
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('З\'єднання з базою даних закрито.');
    process.exit(0);
  });
});

// Експортуємо сервер для тестування
module.exports = server;