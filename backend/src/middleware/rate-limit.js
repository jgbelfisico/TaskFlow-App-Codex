import { AppError } from '../utils/app-error.js'

const WINDOW_MS = 60 * 1000
const MAX_REQUESTS = 120
const requestBuckets = new Map()

export function basicRateLimit (req, _res, next) {
  const ip = req.ip ?? 'unknown'
  const now = Date.now()
  const bucket = requestBuckets.get(ip)

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    requestBuckets.set(ip, { count: 1, windowStart: now })
    return next()
  }

  if (bucket.count >= MAX_REQUESTS) {
    return next(new AppError('Too many requests, please try again in a minute', 429))
  }

  bucket.count += 1
  return next()
}
