import { z } from 'zod'
import { getUserProfile, loginUser, registerUser } from '../services/auth-service.js'
import { AppError } from '../utils/app-error.js'
import { asyncHandler } from '../utils/async-handler.js'
import { sanitizeText } from '../utils/sanitize.js'

const authSchema = z.object({
  email: z.string().email().max(120).transform((value) => sanitizeText(value).toLowerCase()),
  password: z
    .string()
    .min(8)
    .max(72)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
})

export const register = asyncHandler(async (req, res) => {
  const parsed = authSchema.safeParse(req.body)

  if (!parsed.success) {
    throw new AppError('Invalid payload', 400, parsed.error.flatten())
  }

  const result = await registerUser(parsed.data)

  if (result.error) {
    throw new AppError(result.error, result.status)
  }

  return res.status(201).json(result)
})

export const login = asyncHandler(async (req, res) => {
  const parsed = authSchema.safeParse(req.body)

  if (!parsed.success) {
    throw new AppError('Invalid payload', 400, parsed.error.flatten())
  }

  const result = await loginUser(parsed.data)

  if (result.error) {
    throw new AppError(result.error, result.status)
  }

  return res.status(200).json(result)
})

export const me = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.userId)

  if (!user) {
    throw new AppError('User not found', 404)
  }

  return res.status(200).json(user)
})
