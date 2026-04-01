import { z } from 'zod'
import { createTask, deleteTask, listTasks, updateTask } from '../services/task-service.js'

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional()
})

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  completed: z.boolean().optional()
})

export async function getTasks (req, res) {
  const tasks = await listTasks(req.userId)
  return res.status(200).json(tasks)
}

export async function createTaskHandler (req, res) {
  const parsed = createTaskSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() })
  }

  const task = await createTask(req.userId, parsed.data)
  return res.status(201).json(task)
}

export async function updateTaskHandler (req, res) {
  const parsed = updateTaskSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() })
  }

  const task = await updateTask(req.userId, req.params.id, parsed.data)

  if (!task) {
    return res.status(404).json({ message: 'Task not found' })
  }

  return res.status(200).json(task)
}

export async function deleteTaskHandler (req, res) {
  const deleted = await deleteTask(req.userId, req.params.id)

  if (!deleted) {
    return res.status(404).json({ message: 'Task not found' })
  }

  return res.status(204).send()
}
