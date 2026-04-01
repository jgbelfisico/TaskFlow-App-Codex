import { Router } from 'express'
import {
  createTaskHandler,
  deleteTaskHandler,
  getTasks,
  updateTaskHandler
} from '../controllers/task-controller.js'
import { requireAuth } from '../middleware/auth.js'

const taskRouter = Router()

taskRouter.use(requireAuth)
taskRouter.get('/', getTasks)
taskRouter.post('/', createTaskHandler)
taskRouter.patch('/:id', updateTaskHandler)
taskRouter.delete('/:id', deleteTaskHandler)

export { taskRouter }
