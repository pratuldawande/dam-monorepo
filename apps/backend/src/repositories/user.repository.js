import User from '@/models/User'

const createUser = async (data) => {
  const user = new User(data)
  await user.save()
  return user
}

const findByEmail = (email, { includePassword = false } = {}) => {
  const query = User.findOne({ email })

  if (includePassword) {
    query.select('+password')
  }

  return query
}

const findById = (userId, projection = '_id name email') => User.findById(userId).select(projection)

const listExistingUsers = (filter) =>
  User.find(filter).select('_id name email').sort({ name: 1, email: 1 }).lean()

export { createUser, findByEmail, findById, listExistingUsers }
