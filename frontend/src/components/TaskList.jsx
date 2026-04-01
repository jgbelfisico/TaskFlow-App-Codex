import { useEffect, useMemo, useState } from 'react'
import { createTask, deleteTask, getTasks, updateTask } from '../services/api'

export function TaskList ({ token }) {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setIsLoading(true)
    setError('')

    getTasks(token)
      .then(setTasks)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false))
  }, [token])

  const currentEditingTask = useMemo(
    () => tasks.find((task) => task.id === editingTaskId) ?? null,
    [editingTaskId, tasks]
  )

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setEditingTaskId(null)
  }

  const onSubmitTask = async (event) => {
    event.preventDefault()
    if (!title.trim()) return

    setIsSaving(true)
    setError('')

    try {
      if (editingTaskId) {
        const updated = await updateTask(token, editingTaskId, {
          title: title.trim(),
          description: description.trim() || null
        })
        setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        const created = await createTask(token, {
          title: title.trim(),
          description: description.trim() || undefined
        })
        setTasks((current) => [created, ...current])
      }

      resetForm()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSaving(false)
    }
  }

  const onEditTask = (task) => {
    setEditingTaskId(task.id)
    setTitle(task.title)
    setDescription(task.description ?? '')
  }

  const onToggleTask = async (task) => {
    setError('')
    try {
      const updated = await updateTask(token, task.id, { completed: !task.completed })
      setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const onDeleteTask = async (taskId) => {
    setError('')
    try {
      await deleteTask(token, taskId)
      setTasks((current) => current.filter((item) => item.id !== taskId))
      if (editingTaskId === taskId) resetForm()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section className='card'>
      <h2>Mis tareas</h2>

      <form onSubmit={onSubmitTask} className='form'>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder='Título de tarea'
          disabled={isSaving}
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder='Descripción (opcional)'
          rows={3}
          disabled={isSaving}
        />
        <div className='row actions'>
          <button type='submit' disabled={isSaving}>{isSaving ? 'Guardando...' : editingTaskId ? 'Guardar cambios' : 'Crear tarea'}</button>
          {editingTaskId
            ? <button type='button' className='secondary' onClick={resetForm}>Cancelar</button>
            : null}
        </div>
      </form>

      {error ? <p className='error'>{error}</p> : null}
      {isLoading ? <p className='muted'>Cargando tareas...</p> : null}

      {!isLoading && tasks.length === 0 ? <p className='muted'>No tienes tareas todavía.</p> : null}

      <ul className='task-list'>
        {tasks.map((task) => (
          <li key={task.id} className='task-item'>
            <div>
              <p className={task.completed ? 'done task-title' : 'task-title'}>{task.title}</p>
              {task.description ? <p className='muted task-desc'>{task.description}</p> : null}
            </div>
            <div className='actions'>
              <button type='button' className='secondary' onClick={() => onToggleTask(task)}>
                {task.completed ? 'Reabrir' : 'Completar'}
              </button>
              <button type='button' className='secondary' onClick={() => onEditTask(task)}>Editar</button>
              <button type='button' className='danger' onClick={() => onDeleteTask(task.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>

      {currentEditingTask ? <p className='muted'>Editando: {currentEditingTask.title}</p> : null}
    </section>
  )
}
