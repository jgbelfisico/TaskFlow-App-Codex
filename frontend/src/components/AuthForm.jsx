import { useState } from 'react'
import { login, register } from '../services/api'

export function AuthForm ({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const action = isLogin ? login : register
      const response = await action(formData)
      onSuccess(response.token)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section className='card'>
      <h2>{isLogin ? 'Login' : 'Create account'}</h2>
      <form onSubmit={onSubmit} className='form'>
        <input
          type='email'
          placeholder='Email'
          required
          value={formData.email}
          onChange={(event) => setFormData({ ...formData, email: event.target.value })}
        />
        <input
          type='password'
          placeholder='Password'
          minLength={6}
          required
          value={formData.password}
          onChange={(event) => setFormData({ ...formData, password: event.target.value })}
        />
        {error ? <p className='error'>{error}</p> : null}
        <button type='submit'>{isLogin ? 'Sign in' : 'Sign up'}</button>
      </form>
      <button className='secondary' onClick={() => setIsLogin((state) => !state)}>
        {isLogin ? 'Need an account?' : 'Already have an account?'}
      </button>
    </section>
  )
}
