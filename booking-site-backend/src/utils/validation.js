const Joi = require('joi');
const { APIError } = require('../middlewares/error');

/**
 * Валидация запроса с использованием Joi
 * @param {Object} schema - Схема валидации Joi
 * @returns {Function} Middleware для валидации
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
 * Создает объект, содержащий только запрошенные поля
 * @param {Object} object - Исходный объект
 * @param {string[]} keys - Ключи, которые нужно извлечь
 * @returns {Object} Новый объект с извлеченными ключами
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