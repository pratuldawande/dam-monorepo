const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const buildAssetListFilter = ({ search, status, type, userId }) => {
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

  if (userId) {
    filter.$and = [
      {
        $or: [{ userId }, { sharedWith: userId }],
      },
    ]
  }

  return filter
}

export default buildAssetListFilter
