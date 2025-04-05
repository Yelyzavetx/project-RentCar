const prisma = require('../models/prisma');
const { APIError } = require('../middlewares/error');

/**
 * Отримання всіх відгуків з можливістю фільтраціїОтримання всіх відгуків з можливістю фільтрації
 */
const getAllReviews = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      rating,
      userId,
      catalogItemId, // Доданий параметр для фільтрації автомобілем
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Формуємо умови фільтрації
    const where = {};

    if (rating) {
      where.rating = parseInt(rating, 10);
    }

    if (userId) {
      where.userId = userId;
    }

    // Додаємо фільтрацію за catalogItemId
    if (catalogItemId) {
      where.catalogItemId = catalogItemId;
    }

    //Отримуємо відгуки з пагінацією та фільтрацією
    const [reviews, totalReviews] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          [sortBy]: order.toLowerCase()
        },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          },
          catalogItem: { // Додаємо пов'язані дані автомобіля
            select: {
              id: true,
              title: true,
              category: true
            }
          }
        }
      }),
      prisma.review.count({ where })
    ]);

    // Обчислюємо загальну кількість сторінок
    const totalPages = Math.ceil(totalReviews / limitNumber);

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalReviews,
        hasNext: pageNumber < totalPages,
        hasPrev: pageNumber > 1
      },
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Отримання одного відгуку за ID
 */
const getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
          catalogItem: { // Додаємо пов'язані дані автомобіля
          select: {
            id: true,
            title: true,
            category: true,
            imageUrl: true
          }
        }
      }
    });

    if (!review) {
      throw new APIError('Відгук не знайдено', 404);
    }

    res.status(200).json({
      status: 'success',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Створення нового відгуку
 */
const createReview = async (req, res, next) => {
  try {
    const { rating, comment, catalogItemId, bookingId } = req.body;

    // Перевіряємо, що рейтинг знаходиться у допустимому діапазоні (1-5)
    if (rating < 1 || rating > 5) {
      throw new APIError('Рейтинг має бути від 1 до 5', 400);
    }

    // Перевіряємо існування автомобіля, якщо ID надано
    if (catalogItemId) {
      const catalogItem = await prisma.catalogItem.findUnique({
        where: { id: catalogItemId }
      });

      if (!catalogItem) {
        throw new APIError('Автомобіль не знайдено', 404);
      }
    }

    // Якщо надано ID бронювання, оновлюємо прапор hasReview
    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
      });

      if (!booking) {
        throw new APIError('Бронювання не знайдено', 404);
      }

      // Перевіряємо, чи належить бронювання поточному користувачеві
      if (booking.userId !== req.user.id) {
        throw new APIError('Ви можете залишати відгуки лише на свої бронювання', 403);
      }

      // Оновлюємо прапор hasReview у бронюванні
      await prisma.booking.update({
        where: { id: bookingId },
        data: { hasReview: true }
      });

      // Якщо catalogItemId не надано, беремо його з бронювання
      if (!catalogItemId) {
        catalogItemId = booking.catalogItemId;
      }
    }

    // Створюємо новий відгук
    const newReview = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: req.user.id,
        catalogItemId // Зв'язуємо відгук із автомобілем
      }
    });

    res.status(201).json({
      status: 'success',
      data: newReview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Оновлення відгуку (тільки свої відгуки або адмін)
 */
const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment, catalogItemId } = req.body;

    // Проверяем, существует ли отзыв
    const existingReview = await prisma.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      throw new APIError('Відгук не знайдено', 404);
    }

    // Перевіряємо, чи має користувач доступ до цього відгуку
    if (req.user.role !== 'ADMIN' && existingReview.userId !== req.user.id) {
      throw new APIError('У вас немає прав для редагування цього відгуку', 403);
    }

    // Проверяем, что рейтинг находится в допустимом диапазоне (1-5)
    if (rating && (rating < 1 || rating > 5)) {
      throw new APIError('Рейтинг має бути від 1 до 5', 400);
    }

    // Перевіряємо існування автомобіля, якщо ID надано для оновлення
    if (catalogItemId) {
      const catalogItem = await prisma.catalogItem.findUnique({
        where: { id: catalogItemId }
      });

      if (!catalogItem) {
        throw new APIError('Автомобиль не знайдено', 404);
      }
    }

    // Оновлюємо відгук
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating,
        comment,
        catalogItemId
      }
    });

    res.status(200).json({
      status: 'success',
      data: updatedReview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Видалення відгуку (тільки свої відгуки або адмін)
 */
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Перевіряємо, чи існує відгук
    const existingReview = await prisma.review.findUnique({
      where: { id },
      include: {
        user: true
      }
    });

    if (!existingReview) {
      throw new APIError('Відгук не знайдено', 404);
    }

    // Перевіряємо, чи має користувач доступ до цього відгуку
    if (req.user.role !== 'ADMIN' && existingReview.userId !== req.user.id) {
      throw new APIError('У вас немає прав для видалення цього відгуку', 403);
    }

    // Удаляем отзыв
    await prisma.review.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};