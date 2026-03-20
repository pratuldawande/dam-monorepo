const fs = require("fs");
const path = require("path");
const Asset = require("../models/asset");
const { minioClient } = require("../config/minio");
const { publishAssetMessage } = require("../config/rabbitmq");
const {
  MINIO_BUCKET,
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_USE_SSL,
} = require("../config/env");

const buildObjectUrl = (objectName) => {
  const protocol = MINIO_USE_SSL ? "https" : "http";
  return `${protocol}://${MINIO_ENDPOINT}:${MINIO_PORT}/${MINIO_BUCKET}/${objectName}`;
};

const buildObjectName = (originalName) =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${originalName}`;

const uploadAsset = async (file) => {
  const objectName = buildObjectName(file.originalname);
  const metaData = {
    "Content-Type": file.mimetype,
  };
  try {
    const stream = fs.createReadStream(file.path);
    await minioClient.putObject(MINIO_BUCKET, objectName, stream, file.size, metaData);

    const asset = await Asset.create({
      originalName: file.originalname,
      filename: objectName,
      bucket: MINIO_BUCKET,
      url: buildObjectUrl(objectName),
      type: file.mimetype,
      size: file.size,
      tags: [file.mimetype.split("/")[0]],
      metadata: {
        fieldName: file.fieldname,
      },
      status: "queued",
    });

    await publishAssetMessage({
      assetId: asset._id.toString(),
      bucket: MINIO_BUCKET,
      objectName,
      mimeType: file.mimetype,
      originalName: file.originalname,
      size: file.size,
    });

    return asset;
  } finally {
    if (file.path) {
      fs.promises.unlink(file.path).catch(() => {});
    }
  }
};

const listAssets = async () => {
  const assets = await Asset.find().sort({ createdAt: -1 }).lean();

  return {
    success: true,
    data: assets,
  };
};

const processAsset = async ({ assetId }) => {
  const asset = await Asset.findById(assetId);

  if (!asset) {
    throw new Error(`Asset ${assetId} not found`);
  }

  await Asset.findByIdAndUpdate(assetId, {
    status: "processing",
    metadata: {
      ...(asset.metadata || {}),
      processingStartedAt: new Date().toISOString(),
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 250));

  await Asset.findByIdAndUpdate(assetId, {
    status: "completed",
    metadata: {
      ...(asset.metadata || {}),
      processingCompletedAt: new Date().toISOString(),
      extension: path.extname(asset.originalName || asset.filename || ""),
    },
  });
};

module.exports = {
  listAssets,
  processAsset,
  uploadAsset,
};
