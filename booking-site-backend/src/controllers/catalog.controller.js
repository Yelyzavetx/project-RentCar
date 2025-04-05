const prisma = require('../models/prisma');
const { APIError } = require('../middlewares/error');

/**
 * Отримання всіх елементів каталогу з пагінацією
 */
const getAllItems = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      isAvailable,
      search,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Формуємо умови фільтрації
    const where = {};

    if (category) {
      where.category = category; // Тепер категорія відповідає перерахунку CarCategory
    }

    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable === 'true';
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Отримуємо елементи каталогу з пагінацією та фільтрацією
    const [items, totalItems] = await Promise.all([
      prisma.catalogItem.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          [sortBy]: order.toLowerCase()
        },
        include: {
          // Додаємо підрахунок кількості відгуків та середнього рейтингу
          _count: {
            select: {
              reviews: true
            }
          }
        }
      }),
      prisma.catalogItem.count({ where })
    ]);

    // Отримуємо середній рейтинг для кожного елемента каталогу
    const itemsWithRating = await Promise.all(
        items.map(async (item) => {
          const averageRating = await prisma.review.aggregate({
            where: {
              catalogItemId: item.id
            },
            _avg: {
              rating: true
            }
          });

          return {
            ...item,
            reviewsCount: item._count.reviews,
            averageRating: averageRating._avg.rating || 0,
            _count: undefined // Удаляем ненужное поле
          };
        })
    );

    // Обчислюємо загальну кількість сторінок
    const totalPages = Math.ceil(totalItems / limitNumber);

    res.status(200).json({
      status: 'success',
      results: items.length,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalItems,
        hasNext: pageNumber < totalPages,
        hasPrev: pageNumber > 1
      },
      data: itemsWithRating
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Отримання одного елемента каталогу за ID
 */
const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await prisma.catalogItem.findUnique({
      where: { id },
      include: {
        rates: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Обмежуємо кількість відгуків для попереднього перегляду
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    });

    if (!item) {
      throw new APIError('Елемент каталогу не знайдено', 404);
    }

    // Отримуємо середній рейтинг
    const averageRating = await prisma.review.aggregate({
      where: {
        catalogItemId: id
      },
      _avg: {
        rating: true
      }
    });

    // Форматуємо відповідь
    const formattedItem = {
      ...item,
      reviewsCount: item._count.reviews,
      averageRating: averageRating._avg.rating || 0,
      _count: undefined // Видаляємо непотрібне поле
    };

    res.status(200).json({
      status: 'success',
      data: formattedItem
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Створення нового елемента каталогу
 */
const createItem = async (req, res, next) => {
  try {
    const { title, description, price, imageUrl, isAvailable, category } = req.body;

    // Перевіряємо, чи категорія є допустимим значенням перерахування CarCategory
    if (category && !['ECONOMY', 'COMFORT', 'BUSINESS', 'ELITE'].includes(category)) {
      throw new APIError('Неприпустима категорія автомобіля', 400);
    }

    const newItem = await prisma.catalogItem.create({
      data: {
        title,
        description,
        price,
        imageUrl,
        isAvailable,
        category
      }
    });

    res.status(201).json({
      status: 'success',
      data: newItem
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Оновлення елемента каталогу
 */
const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price, imageUrl, isAvailable, category } = req.body;

    // Перевіряємо, чи існує елемент
    const existingItem = await prisma.catalogItem.findUnique({
      where: { id }
    });

    if (!existingItem) {
      throw new APIError('Елемент каталогу не знайдено', 404);
    }

    // Проверяем, является ли категория допустимым значением перечисления CarCategory
    if (category && !['ECONOMY', 'COMFORT', 'BUSINESS', 'ELITE'].includes(category)) {
      throw new APIError('Неприпустима категорія автомобіля', 400);
    }

    // Обновляем элемент
    const updatedItem = await prisma.catalogItem.update({
      where: { id },
      data: {
        title,
        description,
        price,
        imageUrl,
        isAvailable,
        category
      }
    });

    res.status(200).json({
      status: 'success',
      data: updatedItem
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Видалення елемента каталогу
 */
const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Проверяем, существует ли элемент
    const existingItem = await prisma.catalogItem.findUnique({
      where: { id }
    });

    if (!existingItem) {
      throw new APIError('Елемент каталогу не знайдено', 404);
    }

    // Удаляем элемент
    await prisma.catalogItem.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};