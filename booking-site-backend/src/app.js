const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const config = require('./config/config');
const { errorConverter, errorHandler } = require('./middlewares/error');
const logger = require('./config/logger');

const app = express();

// Встановлення довірених проксі для коректної роботи у production
if (config.env === 'production') {
  app.set('trust proxy', 1);
}

// Логування запитів
if (config.env !== 'test') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Налаштування базової безпеки за допомогою helmet
app.use(helmet());

// Парсинг JSON та URL-encoded даних
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Зжимання відповідей для підвищення продуктивності
app.use(compression());

// Налаштування CORS
app.use(cors());

// Обмеження кількості запитів для захисту від DDoS та брутфорс атак
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Забагато запитів, будь ласка, спробуйте пізніше.'
  }
});
app.use('/api/', limiter);

// Префікс для всіх маршрутів API
app.use('/api', routes);

// Перевірка стану програми
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API працює нормально',
    timestamp: new Date().toISOString(),
    environment: config.env
  });
});

// Обробка неіснуючих маршрутів
app.use((req, res, next) => {
  const err = new Error(`Не знайдено - ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

// Конвертація помилок
app.use(errorConverter);

// Обробка помилок
app.use(errorHandler);

module.exports = app;