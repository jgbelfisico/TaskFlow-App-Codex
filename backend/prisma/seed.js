import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main () {
  const password = await bcrypt.hash('password123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'demo@taskflow.dev' },
    update: {},
    create: {
      email: 'demo@taskflow.dev',
      password,
      tasks: {
        create: [
          { title: 'Set up TaskFlow project', completed: true },
          { title: 'Build first feature', description: 'Create task CRUD endpoints' }
        ]
      }
    }
  })

  console.log('Seeded demo user:', user.email)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
