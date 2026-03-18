const { Redis } = require('ioredis');
const { REDIS_HOST,REDIS_PORT } = require("./env");

const connection = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

module.exports = connection;
