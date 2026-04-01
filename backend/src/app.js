import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { errorHandler } from './middleware/error-handler.js'
import { authRouter } from './routes/auth-routes.js'
import { taskRouter } from './routes/task-routes.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: env.frontendUrl }))
app.use(morgan('dev'))
app.use(express.json())

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/tasks', taskRouter)

app.use(errorHandler)

export { app }
