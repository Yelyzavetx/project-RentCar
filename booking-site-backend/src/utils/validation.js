const Joi = require('joi');
const { APIError } = require('../middlewares/error');

/**
 * Валідація запиту з використанням Joi
 * @param {Object} schema - Схема валідації Joi
 * @returns {Function} Middleware для валідації
 */
const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ');
    return next(new APIError(errorMessage, 400));
  }
  
  // Заменяем валидированными значениями
  Object.assign(req, value);
  return next();
};

/**
 * Створює об'єкт, який містить лише запитані поля
 * @param {Object} object - Вихідний об'єкт
 * @param {string[]} keys - Ключі, які потрібно отримати
 * @returns {Object} Новий об'єкт із витягнутими ключами
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = {
  validate,
  pick
};