const prisma = require('../models/prisma');
const { APIError } = require('../middlewares/error');

/**
 * Отримання всіх елементів каталогу з пагінацією
 */
const getAllItems = async (req, res, next) => {
  try {
    const {
      category,
      isAvailable,
      search,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const where = {};

    if (category) {
      where.category = category;
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

    const items = await prisma.catalogItem.findMany({
      where,
      orderBy: {
        [sortBy]: order.toLowerCase()
      },
      include: {
        _count: {
          select: {
            reviews: true
          }
        }
      }
    });

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
            _count: undefined
          };
        })
    );

    res.status(200).json({
      status: 'success',
      results: items.length,
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

const getAllRates = async (req, res, next) => {
  try {
    const {
      catalogItemId,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const where = {};

    if (catalogItemId) {
      where.catalogItemId = catalogItemId;
    }

    const rates = await prisma.rate.findMany({
      where,
      orderBy: {
        [sortBy]: order.toLowerCase()
      },
      include: {
        catalogItem: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(200).json({
      status: 'success',
      results: rates.length,
      data: rates
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getAllRates
};