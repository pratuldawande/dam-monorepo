const passport = require('../config/passport')

const authMiddleware = passport.authenticate('jwt', { session: false })

module.exports = authMiddleware
