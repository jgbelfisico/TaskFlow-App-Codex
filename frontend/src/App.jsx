import { useState } from 'react'
import { AuthForm } from './components/AuthForm'
import { TaskList } from './components/TaskList'

export function App () {
  const [token, setToken] = useState(localStorage.getItem('taskflow_token'))

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
        <h1>TaskFlow</h1>
        {token ? <button onClick={handleLogout}>Logout</button> : null}
      </header>
      {token ? <TaskList token={token} /> : <AuthForm onSuccess={handleAuthSuccess} />}
    </main>
  )
}
