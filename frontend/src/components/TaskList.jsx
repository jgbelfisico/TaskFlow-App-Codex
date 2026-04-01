import { useEffect, useState } from 'react'
import { createTask, getTasks, updateTask } from '../services/api'

export function TaskList ({ token }) {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    getTasks(token).then(setTasks).catch(() => setTasks([]))
  }, [token])

  const onAddTask = async (event) => {
    event.preventDefault()
    if (!title.trim()) return

    const task = await createTask(token, { title })
    setTasks((current) => [task, ...current])
    setTitle('')
  }

  const toggleTask = async (task) => {
    const updated = await updateTask(token, task.id, { completed: !task.completed })
    setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)))
  }

  return (
    <section className='card'>
      <h2>My tasks</h2>
      <form onSubmit={onAddTask} className='row'>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder='Add a task' />
        <button type='submit'>Add</button>
      </form>
      <ul className='task-list'>
        {tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input type='checkbox' checked={task.completed} onChange={() => toggleTask(task)} />
              <span className={task.completed ? 'done' : ''}>{task.title}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
