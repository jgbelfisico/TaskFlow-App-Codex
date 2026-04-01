const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/g

export function sanitizeText (value) {
  if (typeof value !== 'string') return value

  return value
    .replace(CONTROL_CHARACTERS, '')
    .trim()
}
