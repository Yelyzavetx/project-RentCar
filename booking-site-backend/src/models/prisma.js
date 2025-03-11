const { PrismaClient } = require('@prisma/client');
const logger = require('../config/logger');

const prisma = new PrismaClient({
  log: [
    { 
      emit: 'event', 
      level: 'query' 
    },
    { 
      emit: 'stdout', 
      level: 'error' 
    },
    { 
      emit: 'stdout', 
      level: 'info' 
    },
    { 
      emit: 'stdout', 
      level: 'warn' 
    },
  ],
});

// Логування запитів у режимі розробки
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });
}

// Глобальний обробний помилок для Prisma
prisma.$on('error', (e) => {
  logger.error(`Prisma Error: ${e.message}`);
});

// Експорт екземпляру Prisma для використання у застосунку
module.exports = prisma;