import request from 'supertest'
import { app } from '../src/app.js'

describe('TaskFlow API', () => {
  it('returns health status', async () => {
    const response = await request(app).get('/api/v1/health')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('ok')
  })

  it('validates auth payload', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({ email: 'bad-email', password: '123' })
    expect(response.statusCode).toBe(400)
  })

  it('rejects /auth/me without token', async () => {
    const response = await request(app).get('/api/v1/auth/me')
    expect(response.statusCode).toBe(401)
  })
})
