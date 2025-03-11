const prisma = require('../models/prisma');
const { APIError } = require('../middlewares/error');

/**
 * Отримання усіх тарифів з можливістю фільтрації
 */
const getAllRates = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      catalogItemId,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    
    // Формуємо умови фільтрації
    const where = {};
    
    if (catalogItemId) {
      where.catalogItemId = catalogItemId;
    }
    
    // Отримуємо тарифи з пагінацією та фільтрацією
    const [rates, totalRates] = await Promise.all([
      prisma.rate.findMany({
        where,
        skip,
        take: limitNumber,
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
      }),
      prisma.rate.count({ where })
    ]);
    
    // Обраховуємо загальну кількість сторінок
    const totalPages = Math.ceil(totalRates / limitNumber);
    
    res.status(200).json({
      status: 'success',
      results: rates.length,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalRates,
        hasNext: pageNumber < totalPages,
        hasPrev: pageNumber > 1
      },
      data: rates
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Отримання одного тарифу за ID
 */
const getRateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const rate = await prisma.rate.findUnique({
      where: { id },
      include: {
        catalogItem: {
          select: {
            id: true,
            title: true,
            description: true
          }
        }
      }
    });
    
    if (!rate) {
      throw new APIError('Тариф не найден', 404);
    }
    
    res.status(200).json({
      status: 'success',
      data: rate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Створення нового тарифу (тільки для адміністраторів)
 */
const createRate = async (req, res, next) => {
  try {
    const { name, description, price, validFrom, validTo, conditions, catalogItemId } = req.body;
    
    // Перевіряємо, чи існує елемент каталогу
    const catalogItem = await prisma.catalogItem.findUnique({
      where: { id: catalogItemId }
    });
    
    if (!catalogItem) {
      throw new APIError('Елемент каталогу не знайдено', 404);
    }
    
    // Створюємо новий тариф
    const newRate = await prisma.rate.create({
      data: {
        name,
        description,
        price,
        validFrom: validFrom ? new Date(validFrom) : null,
        validTo: validTo ? new Date(validTo) : null,
        conditions,
        catalogItemId
      }
    });
    
    res.status(201).json({
      status: 'success',
      data: newRate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Оновлення тарифу (тільки для адміністраторів)
 */
const updateRate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, validFrom, validTo, conditions } = req.body;
    
    // Перевіряємо, чи існує тариф
    const existingRate = await prisma.rate.findUnique({
      where: { id }
    });
    
    if (!existingRate) {
      throw new APIError('Тариф не найден', 404);
    }
    
    // Оновлюємо тариф
    const updatedRate = await prisma.rate.update({
      where: { id },
      data: {
        name,
        description,
        price,
        validFrom: validFrom ? new Date(validFrom) : null,
        validTo: validTo ? new Date(validTo) : null,
        conditions
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: updatedRate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Видалення тарифу (тільки для адміністраторів)
 */
const deleteRate = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Перевіряємо, чи існує тариф
    const existingRate = await prisma.rate.findUnique({
      where: { id }
    });
    
    if (!existingRate) {
      throw new APIError('Тариф не знайдено', 404);
    }
    
    // Видаляємо тариф
    await prisma.rate.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRates,
  getRateById,
  createRate,
  updateRate,
  deleteRate
};