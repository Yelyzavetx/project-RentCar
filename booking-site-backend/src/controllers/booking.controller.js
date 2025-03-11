const prisma = require('../models/prisma');
const { APIError } = require('../middlewares/error');

/**
 * Отримання усіх бронювань з можливістю фільтрації
 *
 **/
const getAllBookings = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      status,
      startDate,
      endDate,
      userId,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    
    // Формируем условия фильтрации
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
    
    // Перевіряємо роль користувача, звичайним користувачам показуємо лише їх бронювання
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
          catalogItem: true
        }
      }),
      prisma.booking.count({ where })
    ]);
    
    // Обраховуємо загальну кількість сторінок
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
 * Отримання одного бронювання по ID
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
        catalogItem: true
      }
    });
    
    if (!booking) {
      throw new APIError('Бронювання не знайдено', 404);
    }
    
    // Проверяем, имеет ли пользователь доступ к этому бронированию
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
      where: { id: catalogItemId }
    });
    
    if (!catalogItem) {
      throw new APIError('Елемент каталогу не знайдено', 404);
    }
    
    if (!catalogItem.isAvailable) {
      throw new APIError('Цей елемент каталогу недоступний для бронювання', 400);
    }
    
    // Перевіряємо, чи немає вже бронювання на ці дати
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
      throw new APIError('Вже є бронювання на обрані дати', 400);
    }
    
    // Розраховуємо загальну ціну
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    const days = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24));
    const totalPrice = days * parseFloat(catalogItem.price);
    
    // Створюємо нове бронювання
    const newBooking = await prisma.booking.create({
      data: {
        startDate: startDateTime,
        endDate: endDateTime,
        totalPrice,
        notes,
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
    
    // Перевіряємо, чи існує бронювання
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
    
    // Користувачі могуть лише відмінити бронювання, а не змінювати його статус на інший
    if (req.user.role !== 'ADMIN' && status !== 'CANCELLED') {
      throw new APIError('У вас немає прав для зміни статусу на вказаний', 403);
    }
    
    // Оновлюємо статус бронювання
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
    
    // Перевіряємо, чи існує бронювання
    const existingBooking = await prisma.booking.findUnique({
      where: { id }
    });
    
    if (!existingBooking) {
      throw new APIError('Бронюванння не знайдено', 404);
    }
    
    // Видаляємо бронювання
    await prisma.booking.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking
};