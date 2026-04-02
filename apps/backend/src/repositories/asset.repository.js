import Asset from '@/models/Asset'

const createMany = (documents) => Asset.insertMany(documents)

const findById = (assetId) => Asset.findById(assetId)

const findByIdLean = (assetId) => Asset.findById(assetId).lean()

const findByIdPopulated = (assetId) =>
  Asset.findById(assetId)
    .populate('userId', 'name email')
    .populate('sharedWith', 'name email')
    .lean()

const findMany = (filter, { page, limit } = {}) =>
  Asset.find(filter)
    .populate('userId', 'name email')
    .populate('sharedWith', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

const count = (filter) => Asset.countDocuments(filter)

const deleteById = (assetId) => Asset.findByIdAndDelete(assetId)

const deleteManyByIds = (assetIds) =>
  Asset.deleteMany({
    _id: { $in: assetIds },
  })

const updateById = (assetId, update) => Asset.findByIdAndUpdate(assetId, update)

export {
  count,
  createMany,
  deleteById,
  deleteManyByIds,
  findById,
  findByIdLean,
  findByIdPopulated,
  findMany,
  updateById,
}
