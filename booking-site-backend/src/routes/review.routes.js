const express = require('express');
const reviewController = require('../controllers/review.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @route GET /api/reviews
 * @desc Отримання усіх відгуків
 * @access Public
 */
router.get('/', reviewController.getAllReviews);

/**
 * @route GET /api/reviews/:id
 * @desc Отримання відгуку за ID
 * @access Public
 */
router.get('/:id', reviewController.getReviewById);

/**
 * @route POST /api/reviews
 * @desc Створення нового відгуку
 * @access Private
 */
router.post('/', authenticate, reviewController.createReview);

/**
 * @route GET /api/reviews/catalog/:catalogItemId
 * @desc Отримання відгуків для конкретного автомобиля
 * @access Public
 */
router.get('/catalog/:catalogItemId', (req, res, next) => {
    req.query.catalogItemId = req.params.catalogItemId;
    reviewController.getAllReviews(req, res, next);
});

/**
 * @route PUT /api/reviews/:id
 * @desc Оновлення відгуку
 * @access Private (користувачі можуть редагувати лише свої відгуки, адміністратори - будь-які)
 */
router.put('/:id', authenticate, reviewController.updateReview);

/**
 * @route DELETE /api/reviews/:id
 * @desc Видалення відгуку
 * @access Private (користувачі можуть видаляти лише свої відгуки, адміністратори - будь-які)
 */
router.delete('/:id', authenticate, reviewController.deleteReview);

module.exports = router;