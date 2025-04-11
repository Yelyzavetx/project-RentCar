const prisma = require('../models/prisma');
const { APIError } = require('../middlewares/error');

/**
 * Отримання всіх бронювань з можливістю фільтрації
 */
const getAllBookings = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      startDate,
      endDate,
      userId,
      hasReview, // Доданий параметр для фільтрації за відкликанням
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Формуємо умови фільтрації
    const where = {};

    if (status) {
      where.status = status;
    }

    if (startDate) {
      where.startDate = {
        gte: new Date(startDate)
      };
    }

    if (endDate) {
      where.endDate = {
        lte: new Date(endDate)
      };
    }

    if (userId) {
      where.userId = userId;
    }

    // Додаємо фільтрацію по наявності відгуку
    if (hasReview !== undefined) {
      where.hasReview = hasReview === 'true';
    }

    // Перевіряємо роль користувача, звичайним користувачам показуємо лише їхнє бронювання
    if (req.user && req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }

    // Отримуємо бронювання з пагінацією та фільтрацією
    const [bookings, totalBookings] = await Promise.all([
      prisma.booking.findMany({
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
              name: true,
              email: true
            }
          },
          catalogItem: {
            select: {
              id: true,
              title: true,
              description: true,
              price: true,
              imageUrl: true,
              category: true // Додаємо категорію автомобіля
            }
          }
        }
      }),
      prisma.booking.count({ where })
    ]);

    // Обчислюємо загальну кількість сторінок
    const totalPages = Math.ceil(totalBookings / limitNumber);

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalBookings,
        hasNext: pageNumber < totalPages,
        hasPrev: pageNumber > 1
      },
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Отримання одного бронювання за ID
 */
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        catalogItem: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            imageUrl: true,
            category: true // Додаємо категорію автомобіля
          }
        }
      }
    });

    if (!booking) {
      throw new APIError('Бронювання не знайдено', 404);
    }

    // Перевіряємо, чи має користувач доступ до цього бронювання
    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.id) {
      throw new APIError('У вас немає доступу до цього бронювання', 403);
    }

    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Створення нового бронювання
 */
const createBooking = async (req, res, next) => {
  try {
    const { startDate, endDate, catalogItemId, notes } = req.body;

    // Перевіряємо, чи існує елемент каталогу
    const catalogItem = await prisma.catalogItem.findUnique({
      where: {
        id: catalogItemId  // Исправлено: явно указываем id
      }
    });

    if (!catalogItem) {
      throw new APIError('Елемент каталогу не знайдено', 404);
    }

    if (!catalogItem.isAvailable) {
      throw new APIError('Цей елемент каталогу недоступний для бронювання', 400);
    }

    // Перевіряємо, чи вже немає бронювань на ці дати
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        catalogItemId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) }
          }
        ]
      }
    });

    if (overlappingBooking) {
      throw new APIError('Вже є бронювання на вибрані дати', 400);
    }

    // Рассчитываем общую стоимость
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    const days = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24));
    const totalPrice = days * parseFloat(catalogItem.price);

    // Создаем новое бронирование
    const newBooking = await prisma.booking.create({
      data: {
        startDate: startDateTime,
        endDate: endDateTime,
        totalPrice,
        notes,
        hasReview: false,
        userId: req.user.id,
        catalogItemId
      }
    });

    res.status(201).json({
      status: 'success',
      data: newBooking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Оновлення статусу бронювання
 */
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Проверяем, существует ли бронирование
    const existingBooking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!existingBooking) {
      throw new APIError('Бронювання не знайдено', 404);
    }

    // Перевіряємо, чи має користувач доступ до цього бронювання
    if (req.user.role !== 'ADMIN' && existingBooking.userId !== req.user.id) {
      throw new APIError('У вас немає доступу до цього бронювання', 403);
    }

    // Користувачі можуть лише скасувати бронювання, а не змінити статус на інший
    if (req.user.role !== 'ADMIN' && status !== 'CANCELLED') {
      throw new APIError('У вас немає прав для зміни статусу на вказаний', 403);
    }

    // Обновляем статус бронирования
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({
      status: 'success',
      data: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Видалення бронювання (тільки для адміністраторів)
 */
const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Проверяем, существует ли бронирование
    const existingBooking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!existingBooking) {
      throw new APIError('Бронювання не знайдено', 404);
    }

    // Удаляем бронирование
    await prisma.booking.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Перевірка доступності дат для бронювання
 */
const checkAvailability = async (req, res, next) => {
  try {
    const { carId, startDate, endDate } = req.body;

    // Перевіряємо, чи існує автомобіль
    const car = await prisma.catalogItem.findUnique({
      where: { id: carId }
    });

    if (!car) {
      throw new APIError('Автомобіль не знайдено', 404);
    }

    if (!car.isAvailable) {
      throw new APIError('Цей автомобіль недоступний для бронювання', 400);
    }

    // Перевіряємо, чи немає пересічних бронювань
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        catalogItemId: carId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) }
          }
        ]
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        available: !overlappingBooking,
        message: overlappingBooking
            ? 'Вибрані дати вже заброньовані'
            : 'Автомобіль доступний для бронювання'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  checkAvailability
};