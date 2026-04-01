import { render, screen } from '@testing-library/react'
import { App } from '../src/App'

describe('App', () => {
  it('renders TaskFlow heading', () => {
    render(<App />)
    expect(screen.getByText('TaskFlow')).toBeInTheDocument()
  })

  it('renders login form when no token exists', () => {
    render(<App />)
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
  })
})
