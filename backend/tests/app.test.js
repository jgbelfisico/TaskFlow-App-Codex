import { randomUUID } from 'node:crypto'
import { jest } from '@jest/globals'
import request from 'supertest'

const users = []
const tasks = []

const prismaMock = {
  user: {
    findUnique: jest.fn(async ({ where, select }) => {
      const user = users.find((item) =>
        where.email ? item.email === where.email : item.id === where.id
      )

      if (!user) return null
      if (!select) return user

      return Object.fromEntries(Object.keys(select).map((field) => [field, user[field]]))
    }),
    create: jest.fn(async ({ data }) => {
      const user = {
        id: randomUUID(),
        email: data.email,
        password: data.password,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      users.push(user)
      return user
    })
  },
  task: {
    findMany: jest.fn(async ({ where }) => tasks.filter((task) => task.userId === where.userId)),
    create: jest.fn(async ({ data }) => {
      const task = {
        id: randomUUID(),
        title: data.title,
        description: data.description ?? null,
        completed: false,
        userId: data.userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      tasks.unshift(task)
      return task
    }),
    findFirst: jest.fn(async ({ where }) => tasks.find((task) => task.id === where.id && task.userId === where.userId) ?? null),
    update: jest.fn(async ({ where, data }) => {
      const index = tasks.findIndex((task) => task.id === where.id)
      const updated = { ...tasks[index], ...data, updatedAt: new Date() }
      tasks[index] = updated
      return updated
    }),
    delete: jest.fn(async ({ where }) => {
      const index = tasks.findIndex((task) => task.id === where.id)
      tasks.splice(index, 1)
      return null
    })
  }
}

jest.unstable_mockModule('../src/config/prisma.js', () => ({ prisma: prismaMock }))

const { app } = await import('../src/app.js')

describe('TaskFlow API phase 1', () => {
  beforeEach(() => {
    users.splice(0, users.length)
    tasks.splice(0, tasks.length)
    jest.clearAllMocks()
  })

  it('returns health status', async () => {
    const response = await request(app).get('/api/v1/health')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('ok')
  })

  it('register/login and task CRUD flow', async () => {
    const registerResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@taskflow.dev', password: 'password123' })

    expect(registerResponse.statusCode).toBe(201)
    expect(registerResponse.body.token).toBeDefined()

    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@taskflow.dev', password: 'password123' })

    expect(loginResponse.statusCode).toBe(200)
    const token = loginResponse.body.token

    const createTaskResponse = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Create first task' })

    expect(createTaskResponse.statusCode).toBe(201)
    expect(createTaskResponse.body.title).toBe('Create first task')

    const listTaskResponse = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)

    expect(listTaskResponse.statusCode).toBe(200)
    expect(listTaskResponse.body).toHaveLength(1)

    const taskId = createTaskResponse.body.id

    const updateTaskResponse = await request(app)
      .patch(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: true })

    expect(updateTaskResponse.statusCode).toBe(200)
    expect(updateTaskResponse.body.completed).toBe(true)

    const deleteTaskResponse = await request(app)
      .delete(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(deleteTaskResponse.statusCode).toBe(204)
  })

  it('validates payloads and auth guards', async () => {
    const invalidLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'bad-email', password: '123' })

    expect(invalidLogin.statusCode).toBe(400)

    const protectedEndpoint = await request(app).get('/api/v1/tasks')
    expect(protectedEndpoint.statusCode).toBe(401)
  })
})
