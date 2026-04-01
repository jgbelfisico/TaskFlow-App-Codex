import bcrypt from 'bcryptjs'
import { prisma } from '../config/prisma.js'
import { createToken } from '../utils/create-token.js'

export async function registerUser ({ email, password }) {
  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    return { error: 'Email already in use', status: 409 }
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  })

  return {
    token: createToken(user.id),
    user: { id: user.id, email: user.email }
  }
}

export async function loginUser ({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return { error: 'Invalid credentials', status: 401 }
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return { error: 'Invalid credentials', status: 401 }
  }

  return {
    token: createToken(user.id),
    user: { id: user.id, email: user.email }
  }
}
