const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1'

async function request (path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(errorBody.message ?? 'Request failed')
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function register (payload) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
}

export function login (payload) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
}

export function getProfile (token) {
  return request('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
}

export function getTasks (token) {
  return request('/tasks', { headers: { Authorization: `Bearer ${token}` } })
}

export function createTask (token, payload) {
  return request('/tasks', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  })
}

export function updateTask (token, taskId, payload) {
  return request(`/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  })
}
