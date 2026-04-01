import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { AppError } from '../utils/app-error.js'

export function requireAuth (req, _res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401))
  }

  const token = authHeader.slice(7).trim()

  if (!token) {
    return next(new AppError('Authentication required', 401))
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret)
    req.userId = payload.userId
    return next()
  } catch {
    return next(new AppError('Invalid token', 401))
  }
}
