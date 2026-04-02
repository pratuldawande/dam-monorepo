import passport from '@/config/passport'
import { AUTH_FIELDS } from '@/constants'

const authMiddleware = passport.authenticate(AUTH_FIELDS.jwtStrategy, { session: false })

export default authMiddleware
