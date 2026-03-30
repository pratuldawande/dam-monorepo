const passport = require('passport')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const { JWT_SECRET } = require('./env')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
}

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // attach user data
      return done(null, { userId: jwt_payload.userId })
    } catch (err) {
      return done(err, false)
    }
  })
)

module.exports = passport
