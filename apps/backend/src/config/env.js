require("dotenv").config();
const env = {
  PORT: process.env.PORT || 5000,

  MONGO_URI: process.env.MONGO_URI || "mongodb://mongo:27017/dam",

  REDIS_HOST: process.env.REDIS_HOST || "redis",
  REDIS_PORT: process.env.REDIS_PORT || 6379,

  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || "minio",
  MINIO_PORT: process.env.MINIO_PORT || 9000,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || "admin",
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || "password",
  MINIO_BUCKET: process.env.MINIO_BUCKET || "assets",
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",   
};

module.exports = env;