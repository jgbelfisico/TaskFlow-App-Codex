import { z } from 'zod'
import { createTask, deleteTask, listTasks, updateTask } from '../services/task-service.js'
import { AppError } from '../utils/app-error.js'
import { asyncHandler } from '../utils/async-handler.js'
import { sanitizeText } from '../utils/sanitize.js'

const taskIdSchema = z.string().uuid()

const createTaskSchema = z.object({
  title: z.string().min(1).max(120).transform(sanitizeText),
  description: z.string().max(500).optional().transform((value) => sanitizeText(value))
})

const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(120).optional().transform((value) => sanitizeText(value)),
    description: z.string().max(500).nullable().optional().transform((value) => (value === null ? null : sanitizeText(value))),
    completed: z.boolean().optional()
  })
  .refine((value) => Object.keys(value).length > 0, { message: 'At least one field is required' })

const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0)
})

export const getTasks = asyncHandler(async (req, res) => {
  const parsedQuery = paginationSchema.safeParse(req.query)

  if (!parsedQuery.success) {
    throw new AppError('Invalid query params', 400, parsedQuery.error.flatten())
  }

  const tasks = await listTasks(req.userId, parsedQuery.data)
  return res.status(200).json(tasks)
})

export const createTaskHandler = asyncHandler(async (req, res) => {
  const parsedBody = createTaskSchema.safeParse(req.body)

  if (!parsedBody.success) {
    throw new AppError('Invalid payload', 400, parsedBody.error.flatten())
  }

  const task = await createTask(req.userId, parsedBody.data)
  return res.status(201).json(task)
})

export const updateTaskHandler = asyncHandler(async (req, res) => {
  const parsedId = taskIdSchema.safeParse(req.params.id)
  const parsedBody = updateTaskSchema.safeParse(req.body)

  if (!parsedId.success || !parsedBody.success) {
    throw new AppError('Invalid payload', 400, {
      id: parsedId.success ? null : parsedId.error.flatten(),
      body: parsedBody.success ? null : parsedBody.error.flatten()
    })
  }

  const task = await updateTask(req.userId, parsedId.data, parsedBody.data)

  if (!task) {
    throw new AppError('Task not found', 404)
  }

  return res.status(200).json(task)
})

export const deleteTaskHandler = asyncHandler(async (req, res) => {
  const parsedId = taskIdSchema.safeParse(req.params.id)

  if (!parsedId.success) {
    throw new AppError('Invalid task id', 400, parsedId.error.flatten())
  }

  const deleted = await deleteTask(req.userId, parsedId.data)

  if (!deleted) {
    throw new AppError('Task not found', 404)
  }

  return res.status(204).send()
})
