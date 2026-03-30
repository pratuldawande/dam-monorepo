const fs = require('fs')
const path = require('path')
const os = require('os')
const sharp = require('sharp')
const ffmpeg = require('fluent-ffmpeg')
const { pipeline } = require('stream/promises')
const Asset = require('../models/asset')
const User = require('../models/User')
const { minioClient } = require('../config/minio')
const { publishAssetMessage } = require('../config/rabbitmq')
const {
  MINIO_BUCKET,
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_PUBLIC_BASE_URL,
  MINIO_USE_SSL,
} = require('../config/env')

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '')

const buildObjectUrl = (objectName) => {
  if (MINIO_PUBLIC_BASE_URL) {
    return `${trimTrailingSlash(MINIO_PUBLIC_BASE_URL)}/${MINIO_BUCKET}/${objectName}`
  }

  const protocol = MINIO_USE_SSL ? 'https' : 'http'
  return `${protocol}://${MINIO_ENDPOINT}:${MINIO_PORT}/${MINIO_BUCKET}/${objectName}`
}

const buildObjectName = (originalName) =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${originalName}`

const isImage = (mimeType = '') => mimeType.startsWith('image/')
const isVideo = (mimeType = '') => mimeType.startsWith('video/')
const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const uploadBufferToMinio = async ({ objectName, buffer, contentType }) => {
  await minioClient.putObject(MINIO_BUCKET, objectName, buffer, buffer.length, {
    'Content-Type': contentType,
  })

  return {
    bucket: MINIO_BUCKET,
    objectName,
    url: buildObjectUrl(objectName),
    contentType,
    size: buffer.length,
  }
}

const uploadFileToMinio = async ({ objectName, filePath, contentType }) => {
  const stats = await fs.promises.stat(filePath)
  const stream = fs.createReadStream(filePath)

  await minioClient.putObject(MINIO_BUCKET, objectName, stream, stats.size, {
    'Content-Type': contentType,
  })

  return {
    bucket: MINIO_BUCKET,
    objectName,
    url: buildObjectUrl(objectName),
    contentType,
    size: stats.size,
  }
}

const downloadObjectToFile = async ({ objectName, destinationPath }) => {
  const objectStream = await minioClient.getObject(MINIO_BUCKET, objectName)
  const fileStream = fs.createWriteStream(destinationPath)
  await pipeline(objectStream, fileStream)
}

const ffprobeAsync = (filePath) =>
  new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (error, metadata) => {
      if (error) {
        reject(error)
        return
      }

      resolve(metadata)
    })
  })

const transcodeVideo = ({ inputPath, outputPath, height, includeAudio }) =>
  new Promise((resolve, reject) => {
    const command = ffmpeg(inputPath)
      .outputOptions(['-movflags +faststart', '-preset veryfast', '-crf 23'])
      .videoCodec('libx264')
      .format('mp4')
      .size(`?x${height}`)
      .on('end', resolve)
      .on('error', reject)

    if (includeAudio) {
      command.audioCodec('aac')
    } else {
      command.noAudio()
    }

    command.save(outputPath)
  })

const captureVideoThumbnail = ({ inputPath, outputPath, timestamp }) =>
  new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions(['-frames:v 1'])
      .on('end', resolve)
      .on('error', reject)
      .screenshots({
        timestamps: [timestamp],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
      })
  })

const generateImageDerivatives = async ({ asset, objectName }) => {
  const sourceBuffer = await minioClient
    .getObject(MINIO_BUCKET, objectName)
    .then(async (stream) => {
      const chunks = []

      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      return Buffer.concat(chunks)
    })

  const thumbnailSizes = [320, 640]
  const thumbnails = []

  for (const width of thumbnailSizes) {
    const buffer = await sharp(sourceBuffer)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer()

    const thumbnailObjectName = buildObjectName(
      `${path.parse(asset.originalName || asset.filename).name}-thumb-${width}.jpg`
    )

    thumbnails.push(
      await uploadBufferToMinio({
        objectName: thumbnailObjectName,
        buffer,
        contentType: 'image/jpeg',
      })
    )
  }

  return { thumbnails }
}

const generateVideoDerivatives = async ({ asset, objectName, tempDir }) => {
  const sourceExtension = path.extname(asset.originalName || asset.filename || '') || '.bin'
  const inputPath = path.join(tempDir, `source${sourceExtension}`)
  await downloadObjectToFile({ objectName, destinationPath: inputPath })

  const metadata = await ffprobeAsync(inputPath)
  const videoStream = metadata.streams?.find((stream) => stream.codec_type === 'video')

  if (!videoStream) {
    throw new Error(`Video stream missing for asset ${asset._id}`)
  }

  const sourceHeight = Number(videoStream.height) || 0
  const duration = Number(metadata.format?.duration) || 0
  const includeAudio = metadata.streams?.some((stream) => stream.codec_type === 'audio')
  const targetHeights = [1080, 720, 480, 360, 240, 144].filter(
    (height) => sourceHeight === 0 || height <= sourceHeight
  )
  const variants = []
  const thumbnails = []

  for (const width of [320, 640]) {
    const thumbnailPath = path.join(tempDir, `video-thumb-${width}.jpg`)
    const thumbnailTimestamp = duration > 0 ? Math.min(duration * 0.25, 3) : 0

    await captureVideoThumbnail({
      inputPath,
      outputPath: thumbnailPath,
      timestamp: thumbnailTimestamp,
    })

    const resizedThumbnailBuffer = await sharp(thumbnailPath)
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer()

    const thumbnailObjectName = buildObjectName(
      `${path.parse(asset.originalName || asset.filename).name}-thumb-${width}.jpg`
    )

    thumbnails.push(
      await uploadBufferToMinio({
        objectName: thumbnailObjectName,
        buffer: resizedThumbnailBuffer,
        contentType: 'image/jpeg',
      })
    )
  }

  for (const height of targetHeights) {
    const outputPath = path.join(tempDir, `${height}p.mp4`)
    await transcodeVideo({ inputPath, outputPath, height, includeAudio })

    const transcodedObjectName = buildObjectName(
      `${path.parse(asset.originalName || asset.filename).name}-${height}p.mp4`
    )

    const uploadedVariant = await uploadFileToMinio({
      objectName: transcodedObjectName,
      filePath: outputPath,
      contentType: 'video/mp4',
    })

    variants.push({
      ...uploadedVariant,
      resolution: `${height}p`,
    })
  }

  return {
    thumbnails,
    variants,
    source: {
      width: Number(videoStream.width) || undefined,
      height: sourceHeight || undefined,
      duration: duration || undefined,
    },
  }
}

const removeObjectIfExists = async (objectName) => {
  if (!objectName) {
    return
  }

  try {
    await minioClient.removeObject(MINIO_BUCKET, objectName)
  } catch (error) {
    if (error.code !== 'NoSuchKey' && error.code !== 'NotFound') {
      throw error
    }
  }
}

const uploadAsset = async ({ file, userId }) => {
  const objectName = buildObjectName(file.originalname)
  const metaData = {
    'Content-Type': file.mimetype,
  }
  try {
    const stream = fs.createReadStream(file.path)
    await minioClient.putObject(MINIO_BUCKET, objectName, stream, file.size, metaData)

    const asset = await Asset.create({
      userId,
      originalName: file.originalname,
      filename: objectName,
      bucket: MINIO_BUCKET,
      url: buildObjectUrl(objectName),
      type: file.mimetype,
      size: file.size,
      tags: [file.mimetype.split('/')[0]],
      metadata: {
        fieldName: file.fieldname,
      },
      status: 'queued',
    })

    await publishAssetMessage({
      assetId: asset._id.toString(),
      userId: userId.toString(),
      bucket: MINIO_BUCKET,
      objectName,
      mimeType: file.mimetype,
      originalName: file.originalname,
      size: file.size,
    })

    return asset
  } finally {
    if (file.path) {
      fs.promises.unlink(file.path).catch(() => {})
    }
  }
}

const buildAssetListFilter = ({ search, status, type }) => {
  const filter = {}

  if (status) {
    filter.status = status
  }

  if (type === 'image') {
    filter.type = { $regex: /^image\// }
  } else if (type === 'video') {
    filter.type = { $regex: /^video\// }
  } else if (type === 'other') {
    filter.type = { $not: /^(image|video)\// }
  }

  if (search) {
    const searchRegex = new RegExp(escapeRegExp(search), 'i')
    filter.$or = [
      { originalName: searchRegex },
      { filename: searchRegex },
      { type: searchRegex },
      { tags: searchRegex },
    ]
  }

  return filter
}

const listAssets = async ({ page = 1, limit = 10, search, status, type, userId } = {}) => {
  const normalizedPage = Number(page) || 1
  const normalizedLimit = Number(limit) || 10
  const filter = buildAssetListFilter({ search, status, type })

  if (userId) {
    filter.$and = [
      ...(filter.$and || []),
      {
        $or: [{ userId }, { sharedWith: userId }],
      },
    ]
  }

  const [assets, total] = await Promise.all([
    Asset.find(filter)
      .populate('userId', 'name email')
      .populate('sharedWith', 'name email')
      .sort({ createdAt: -1 })
      .skip((normalizedPage - 1) * normalizedLimit)
      .limit(normalizedLimit)
      .lean(),
    Asset.countDocuments(filter),
  ])

  return {
    success: true,
    data: assets,
    meta: {
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / normalizedLimit),
      search: search || '',
      status: status || 'all',
      type: type || 'all',
    },
  }
}

const deleteAsset = async ({ assetId, userId }) => {
  const asset = await Asset.findById(assetId).lean()

  if (!asset) {
    const error = new Error('Asset not found')
    error.status = 404
    throw error
  }

  if (asset.userId?.toString() !== userId?.toString()) {
    const error = new Error('You are not allowed to delete this asset')
    error.status = 403
    throw error
  }

  const derivedObjects = [
    ...(asset.metadata?.thumbnails || []).map((item) => item.objectName),
    ...(asset.metadata?.variants || []).map((item) => item.objectName),
  ]

  await Promise.all([
    removeObjectIfExists(asset.filename),
    ...derivedObjects.map((objectName) => removeObjectIfExists(objectName)),
  ])

  await Asset.findByIdAndDelete(assetId)

  return {
    success: true,
    message: 'Asset deleted successfully',
  }
}

const shareAssetWithUser = async ({ assetId, ownerId, targetUserId }) => {
  const [asset, userToShare] = await Promise.all([
    Asset.findById(assetId),
    User.findById(targetUserId).select('_id name email'),
  ])

  if (!asset) {
    const error = new Error('Asset not found')
    error.status = 404
    throw error
  }

  if (asset.userId?.toString() !== ownerId?.toString()) {
    const error = new Error('You are not allowed to share this asset')
    error.status = 403
    throw error
  }

  if (!userToShare) {
    const error = new Error('Selected user does not exist')
    error.status = 404
    throw error
  }

  if (userToShare._id.toString() === ownerId?.toString()) {
    const error = new Error('You already own this asset')
    error.status = 400
    throw error
  }

  const alreadyShared = asset.sharedWith?.some(
    (sharedUserId) => sharedUserId.toString() === userToShare._id.toString()
  )

  if (alreadyShared) {
    const populatedAsset = await Asset.findById(assetId)
      .populate('userId', 'name email')
      .populate('sharedWith', 'name email')
      .lean()

    return {
      success: true,
      message: 'Asset already shared with this user',
      data: populatedAsset,
    }
  }

  asset.sharedWith = [...(asset.sharedWith || []), userToShare._id]
  await asset.save()

  const populatedAsset = await Asset.findById(assetId)
    .populate('userId', 'name email')
    .populate('sharedWith', 'name email')
    .lean()

  return {
    success: true,
    message: 'Asset shared successfully',
    data: populatedAsset,
  }
}

const processAsset = async ({ assetId }) => {
  const asset = await Asset.findById(assetId)

  if (!asset) {
    throw new Error(`Asset ${assetId} not found`)
  }

  const baseMetadata = {
    ...(asset.metadata || {}),
    processingStartedAt: new Date().toISOString(),
  }

  await Asset.findByIdAndUpdate(assetId, {
    status: 'processing',
    metadata: baseMetadata,
  })

  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'asset-processing-'))

  try {
    let derivedMetadata = {}

    if (isImage(asset.type)) {
      derivedMetadata = await generateImageDerivatives({
        asset,
        objectName: asset.filename,
      })
    } else if (isVideo(asset.type)) {
      derivedMetadata = await generateVideoDerivatives({
        asset,
        objectName: asset.filename,
        tempDir,
      })
    }

    await Asset.findByIdAndUpdate(assetId, {
      status: 'completed',
      metadata: {
        ...baseMetadata,
        ...derivedMetadata,
        processingCompletedAt: new Date().toISOString(),
        extension: path.extname(asset.originalName || asset.filename || ''),
      },
    })
  } catch (error) {
    await Asset.findByIdAndUpdate(assetId, {
      status: 'failed',
      metadata: {
        ...baseMetadata,
        processingFailedAt: new Date().toISOString(),
        processingError: error.message,
        extension: path.extname(asset.originalName || asset.filename || ''),
      },
    })
    throw error
  } finally {
    await fs.promises.rm(tempDir, { recursive: true, force: true })
  }
}

module.exports = {
  deleteAsset,
  listAssets,
  processAsset,
  shareAssetWithUser,
  uploadAsset,
}
