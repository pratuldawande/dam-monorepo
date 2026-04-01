import passport from '@/config/passport'

const authMiddleware = passport.authenticate('jwt', { session: false })

export default authMiddleware
