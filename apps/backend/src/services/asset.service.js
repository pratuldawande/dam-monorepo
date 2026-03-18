const Asset = require('../models/asset');
const minioClient = require('../config/minio');
const assetQueue = require('../queues/asset.queue');
const { MINIO_ENDPOINT,MINIO_PORT,MINIO_BUCKET } = require("../config/env");


exports.uploadAsset = async (file) => {
  const objectName = `${Date.now()}-${file.originalname}`;

  // Upload to MinIO
  await minioClient.putObject(MINIO_BUCKET, objectName, file.buffer);

  const url = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${MINIO_BUCKET}/${objectName}`;

  const asset = await Asset.create({
    filename: objectName,
    url,
    type: file.mimetype,
    size: file.size,
    tags: [file.mimetype.split('/')[0]],
  });

  // Push to queue
//   await assetQueue.add('process-asset', {
//     assetId: asset._id,
//     fileName: objectName,
//     mimeType: file.mimetype,
//   });

  return asset;
};
