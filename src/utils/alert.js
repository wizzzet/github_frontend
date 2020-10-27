import eventHub from './eventHub'

export function Alert (title, message) {
  eventHub.$emit('global:alert', { title, message })
}
