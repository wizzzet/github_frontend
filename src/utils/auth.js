import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from './localStorage'

export const getToken = () => {
  return getLocalStorageItem('token') || ''
}

export const setToken = (token) => {
  if (process.server) {
    return
  }

  setLocalStorageItem('token', token)
}

export const unsetToken = () => {
  if (process.server) {
    return
  }

  if (typeof (localStorage) !== 'undefined') {
    removeLocalStorageItem('token')
  }
}
