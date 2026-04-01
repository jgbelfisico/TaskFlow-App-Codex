import { prisma } from '../config/prisma.js'

export function listTasks (userId) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })
}

export function createTask (userId, data) {
  return prisma.task.create({
    data: {
      ...data,
      userId
    }
  })
}

export async function updateTask (userId, taskId, data) {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } })

  if (!task) {
    return null
  }

  return prisma.task.update({
    where: { id: taskId },
    data
  })
}

export async function deleteTask (userId, taskId) {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } })

  if (!task) {
    return false
  }

  await prisma.task.delete({ where: { id: taskId } })
  return true
}
