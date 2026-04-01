import { z } from 'zod'
import { loginUser, registerUser } from '../services/auth-service.js'

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export async function register (req, res) {
  const parsed = authSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() })
  }

  const result = await registerUser(parsed.data)

  if (result.error) {
    return res.status(result.status).json({ message: result.error })
  }

  return res.status(201).json(result)
}

export async function login (req, res) {
  const parsed = authSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() })
  }

  const result = await loginUser(parsed.data)

  if (result.error) {
    return res.status(result.status).json({ message: result.error })
  }

  return res.status(200).json(result)
}
