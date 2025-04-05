const prisma = require('../models/prisma');
const { APIError } = require('../middlewares/error');

/**
 * Отримання всіх контактних даних
 */
const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        type: 'asc'
      }
    });
    
    res.status(200).json({
      status: 'success',
      results: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Отримання контактів за типом
 */
const getContactsByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    
    // Проверяем валидность типа контакта
    const validTypes = ['EMAIL', 'PHONE', 'ADDRESS', 'WEBSITE', 'SOCIAL'];
    if (!validTypes.includes(type)) {
      throw new APIError('Недопустимий тип контакту', 400);
    }
    
    const contacts = await prisma.contact.findMany({
      where: {
        type
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    res.status(200).json({
      status: 'success',
      results: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Отримання одного контакту за ID
 */
const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const contact = await prisma.contact.findUnique({
      where: { id }
    });
    
    if (!contact) {
      throw new APIError('Контакт не знайдено', 404);
    }
    
    res.status(200).json({
      status: 'success',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Створення нового контакту (тільки для адміністраторів)
 */
const createContact = async (req, res, next) => {
  try {
    const { type, value, isMain } = req.body;
    
    // Перевіряємо валідність типу контакту
    const validTypes = ['EMAIL', 'PHONE', 'ADDRESS', 'WEBSITE', 'SOCIAL'];
    if (!validTypes.includes(type)) {
      throw new APIError('Недопустимий тип контакту', 400);
    }
    
    // Якщо новий контакт відмічений як основний, то усі інші контакти того ж типу мають бути не основними
    if (isMain) {
      await prisma.contact.updateMany({
        where: {
          type,
          isMain: true
        },
        data: {
          isMain: false
        }
      });
    }
    
    // Створюємо новий контакт
    const newContact = await prisma.contact.create({
      data: {
        type,
        value,
        isMain
      }
    });
    
    res.status(201).json({
      status: 'success',
      data: newContact
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Оновлюємо контакт (тільки для адміністраторів)
 */
const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value, isMain } = req.body;
    
    // Перевіряємо, чи існує контакт
    const existingContact = await prisma.contact.findUnique({
      where: { id }
    });
    
    if (!existingContact) {
      throw new APIError('Контакт не знайдено', 404);
    }
    
    // Якщо контакт відмічений як основний, то усі інші контакти того ж типу мають бути не основними
    if (isMain) {
      await prisma.contact.updateMany({
        where: {
          type: existingContact.type,
          isMain: true,
          id: { not: id }
        },
        data: {
          isMain: false
        }
      });
    }
    
    // Оновлюємо контакт
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        value,
        isMain
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: updatedContact
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Видалення контакту (тільки для адміністраторів)
 */
const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Перевіряємо, чи існує контакт
    const existingContact = await prisma.contact.findUnique({
      where: { id }
    });
    
    if (!existingContact) {
      throw new APIError('Контакт не знайдено', 404);
    }
    
    // Видаляємо контакт
    await prisma.contact.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContactsByType,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};