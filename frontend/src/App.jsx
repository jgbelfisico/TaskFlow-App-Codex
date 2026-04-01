import { useEffect, useState } from 'react'
import { AuthForm } from './components/AuthForm'
import { TaskList } from './components/TaskList'
import { getProfile } from './services/api'

export function App () {
  const [token, setToken] = useState(localStorage.getItem('taskflow_token'))
  const [user, setUser] = useState(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(Boolean(token))

  useEffect(() => {
    if (!token) {
      setUser(null)
      setIsLoadingProfile(false)
      return
    }

    setIsLoadingProfile(true)
    getProfile(token)
      .then((profile) => {
        setUser(profile)
      })
      .catch(() => {
        localStorage.removeItem('taskflow_token')
        setToken(null)
      })
      .finally(() => {
        setIsLoadingProfile(false)
      })
  }, [token])

  const handleAuthSuccess = (newToken) => {
    localStorage.setItem('taskflow_token', newToken)
    setToken(newToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('taskflow_token')
    setToken(null)
  }

  return (
    <main className='container'>
      <header className='header'>
        <div>
          <h1>TaskFlow</h1>
          {user ? <p className='muted'>Sesión: {user.email}</p> : null}
        </div>
        {token ? <button onClick={handleLogout}>Cerrar sesión</button> : null}
      </header>

      {isLoadingProfile
        ? <section className='card'><p>Cargando sesión...</p></section>
        : token
          ? <TaskList token={token} />
          : <AuthForm onSuccess={handleAuthSuccess} />}
    </main>
  )
}
