const Minio = require('minio');
const { MINIO_ENDPOINT,MINIO_PORT,MINIO_ACCESS_KEY,MINIO_SECRET_KEY } = require("./env");

const minioClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: parseInt(MINIO_PORT),
  useSSL: false,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

module.exports = minioClient;
