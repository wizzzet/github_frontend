export function isLocalStorageActive () {
  try {
    return process.browser && typeof (localStorage) !== 'undefined' && localStorage.getItem
  } catch (e) {}
  return false
}

export function getLocalStorageItem (key, defaultValue) {
  if (isLocalStorageActive() && localStorage.getItem(key) !== null) {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      return defaultValue || undefined
    }
  }
  return defaultValue || null
}

export function setLocalStorageItem (key, value) {
  if (isLocalStorageActive() && localStorage.setItem) {
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      return false
    }
    return true
  }
  return false
}

export function removeLocalStorageItem (key) {
  if (isLocalStorageActive() && localStorage.removeItem) {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      return false
    }
    return true
  }
  return false
}
