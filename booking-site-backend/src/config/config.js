require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  rateLimit: {
    max: process.env.RATE_LIMIT || 100,
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes by default
  },
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },
  db: {
    url: process.env.DATABASE_URL,
  },
};

module.exports = config;