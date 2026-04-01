import passport from 'passport'
import * as passportJwt from 'passport-jwt'
import { JWT_SECRET } from '@/config/env'

const { Strategy: JwtStrategy, ExtractJwt } = passportJwt

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

export default passport
