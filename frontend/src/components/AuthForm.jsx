import { useState } from 'react'
import { login, register } from '../services/api'

export function AuthForm ({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const action = isLogin ? login : register
      const response = await action(formData)
      onSuccess(response.token)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className='card auth-card'>
      <h2>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
      <p className='muted'>{isLogin ? 'Ingresa para gestionar tus tareas.' : 'Regístrate para empezar con TaskFlow.'}</p>
      <form onSubmit={onSubmit} className='form'>
        <input
          type='email'
          placeholder='Correo electrónico'
          required
          value={formData.email}
          onChange={(event) => setFormData({ ...formData, email: event.target.value })}
          disabled={isSubmitting}
        />
        <input
          type='password'
          placeholder='Contraseña'
          minLength={6}
          required
          value={formData.password}
          onChange={(event) => setFormData({ ...formData, password: event.target.value })}
          disabled={isSubmitting}
        />
        {error ? <p className='error'>{error}</p> : null}
        <button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Enviando...' : isLogin ? 'Entrar' : 'Registrarme'}</button>
      </form>
      <button
        className='secondary'
        onClick={() => setIsLogin((state) => !state)}
        disabled={isSubmitting}
      >
        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </section>
  )
}
