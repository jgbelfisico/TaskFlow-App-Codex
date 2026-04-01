import { prisma } from '../config/prisma.js'

const taskSelect = {
  id: true,
  title: true,
  description: true,
  completed: true,
  createdAt: true,
  updatedAt: true
}

export function listTasks (userId, { limit, offset }) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    select: taskSelect
  })
}

export function createTask (userId, data) {
  return prisma.task.create({
    data: {
      ...data,
      userId
    },
    select: taskSelect
  })
}

export async function updateTask (userId, taskId, data) {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId }, select: { id: true } })

  if (!task) {
    return null
  }

  return prisma.task.update({
    where: { id: taskId },
    data,
    select: taskSelect
  })
}

export async function deleteTask (userId, taskId) {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId }, select: { id: true } })

  if (!task) {
    return false
  }

  await prisma.task.delete({ where: { id: taskId } })
  return true
}
