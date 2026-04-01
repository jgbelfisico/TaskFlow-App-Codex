import { render, screen } from '@testing-library/react'
import { App } from '../src/App'

describe('App', () => {
  it('renders TaskFlow heading', () => {
    render(<App />)
    expect(screen.getByText('TaskFlow')).toBeInTheDocument()
  })
})
