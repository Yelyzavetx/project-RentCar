const prisma = require('../models/prisma');
const { APIError } = require('../middlewares/error');

/**
 * Отримання усіх елементів каталогу з пагінацією
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
    
    // Формируем условия фильтрации
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
    
    // Получаем элементы каталога с пагинацией и фильтрацией
    const [items, totalItems] = await Promise.all([
      prisma.catalogItem.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          [sortBy]: order.toLowerCase()
        }
      }),
      prisma.catalogItem.count({ where })
    ]);
    
    // Вычисляем общее количество страниц
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
      data: items
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ОТримання одного елементу каталогу за ID
 */
const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const item = await prisma.catalogItem.findUnique({
      where: { id },
      include: {
        rates: true,
      }
    });
    
    if (!item) {
      throw new APIError('Елемент каталогу не знайдено', 404);
    }
    
    res.status(200).json({
      status: 'success',
      data: item
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Створення нового елементу каталогу
 */
const createItem = async (req, res, next) => {
  try {
    const { title, description, price, imageUrl, isAvailable, category } = req.body;
    
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
 * Оновлення елементу каталогу
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
    
    // Оновлюємо елемент
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
 * Видалення елементу каталогу
 */
const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Перевіряємо, чи існує елемент
    const existingItem = await prisma.catalogItem.findUnique({
      where: { id }
    });
    
    if (!existingItem) {
      throw new APIError('Елемент каталогу не знайдено', 404);
    }
    
    // Видаляємо елемент
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