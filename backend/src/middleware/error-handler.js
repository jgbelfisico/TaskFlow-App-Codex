import { AppError } from '../utils/app-error.js'

export function errorHandler (error, _req, res, _next) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details
    })
  }

  console.error(error)

  return res.status(500).json({
    message: 'Internal server error'
  })
}
