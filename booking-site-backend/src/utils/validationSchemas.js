const Joi = require('joi');

/**
 * Схемы валидации для различных запросов в приложении
 */
const validationSchemas = {
  // Схемы для аутентификации
  auth: {
    register: {
      body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6),
        name: Joi.string().required()
      })
    },
    login: {
      body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required()
      })
    }
  },
  
  // Схемы для каталога
  catalog: {
    create: {
      body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().allow('', null),
        price: Joi.number().required().min(0),
        imageUrl: Joi.string().uri().allow('', null),
        isAvailable: Joi.boolean(),
        category: Joi.string().allow('', null)
      })
    },
    update: {
      params: Joi.object().keys({
        id: Joi.string().uuid().required()
      }),
      body: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string().allow('', null),
        price: Joi.number().min(0),
        imageUrl: Joi.string().uri().allow('', null),
        isAvailable: Joi.boolean(),
        category: Joi.string().allow('', null)
      }).min(1)
    },
    get: {
      params: Joi.object().keys({
        id: Joi.string().uuid().required()
      })
    },
    getAll: {
      query: Joi.object().keys({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
        category: Joi.string(),
        isAvailable: Joi.boolean(),
        search: Joi.string(),
        sortBy: Joi.string().valid('title', 'price', 'createdAt', 'updatedAt'),
        order: Joi.string().valid('asc', 'desc')
      })
    }
  },
  
  // Схемы для бронирований
  booking: {
    create: {
      body: Joi.object().keys({
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required().greater(Joi.ref('startDate')),
        catalogItemId: Joi.string().uuid().required(),
        notes: Joi.string().allow('', null)
      })
    },
    updateStatus: {
      params: Joi.object().keys({
        id: Joi.string().uuid().required()
      }),
      body: Joi.object().keys({
        status: Joi.string().valid('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED').required()
      })
    },
    get: {
      params: Joi.object().keys({
        id: Joi.string().uuid().required()
      })
    },
    getAll: {
      query: Joi.object().keys({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
        status: Joi.string().valid('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso(),
        userId: Joi.string().uuid(),
        sortBy: Joi.string().valid('startDate', 'endDate', 'status', 'totalPrice', 'createdAt', 'updatedAt'),
        order: Joi.string().valid('asc', 'desc')
      })
    }
  },
  
  // Схемы для тарифов
  rate: {
    create: {
      body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().allow('', null),
        price: Joi.number().required().min(0),
        validFrom: Joi.date().iso().allow(null),
        validTo: Joi.date().iso().greater(Joi.ref('validFrom')).allow(null),
        conditions: Joi.string().allow('', null),
        catalogItemId: Joi.string().uuid().required()
      })
    },
    update: {
      params: Joi.object().keys({
        id: Joi.string().uuid().required()
      }),
      body: Joi.object().keys({
        name: Joi.string(),
        description: Joi.string().allow('', null),
        price: Joi.number().min(0),
        validFrom: Joi.date().iso().allow(null),
        validTo: Joi.date().iso().greater(Joi.ref('validFrom')).allow(null),
        conditions: Joi.string().allow('', null)
      }).min(1)
    },
    get: {
      params: Joi.object().keys({
        id: Joi.string().uuid().required()
      })
    },
    getAll: {
      query: Joi.object().keys({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
        catalogItemId: Joi.string().uuid(),
        sortBy: Joi.string().valid('name', 'price', 'validFrom', 'validTo', 'createdAt', 'updatedAt'),
        order: Joi.string().valid('asc', 'desc')
      })
    }
  },
  
  // Схемы для отзывов
  review: {
    create: {
      body: Joi.object().keys({
        rating: Joi.number().integer().min(1).max(5).required(),
        comment: Joi.string().allow('', null)
      })
    },
    update: {
      params: Joi.object().keys({
        id: Joi.string().uuid().required()
      }),
      body: Joi.object().keys({
        rating: Joi.number().integer().min(1).max(5),
        comment: Joi.string().allow('', null)
      }).min(1)
    },
    get: {
      params: Joi.object().keys({
        id: Joi.string().uuid().required()
      })
    },
    getAll: {
      query: Joi.object().keys({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
        rating: Joi.number().integer().min(1).max(5),
        userId: Joi.string().uuid(),
        sortBy: Joi.string().valid('rating', 'createdAt', 'updatedAt'),
        order: Joi.string().valid('asc', 'desc')
      })
    }
  },
  
  // Схемы для контактов
  contact: {
    create: {
      body: Joi.object().keys({
        type: Joi.string().valid('EMAIL', 'PHONE', 'ADDRESS', 'WEBSITE', 'SOCIAL').required(),
        value: Joi.string().required(),
        isMain: Joi.boolean()
      })
    },
    update: {
      params: Joi.object().keys({
        id: Joi.string().uuid().required()
      }),
      body: Joi.object().keys({
        value: Joi.string(),
        isMain: Joi.boolean()
      }).min(1)
    },
    get: {
      params: Joi.object().keys({
        id: Joi.string().uuid().required()
      })
    },
    getByType: {
      params: Joi.object().keys({
        type: Joi.string().valid('EMAIL', 'PHONE', 'ADDRESS', 'WEBSITE', 'SOCIAL').required()
      })
    }
  }
};

module.exports = validationSchemas;