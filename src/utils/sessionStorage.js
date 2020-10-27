export function isSessionStorageActive () {
  try {
    return process.browser && typeof (sessionStorage) !== 'undefined' && sessionStorage.getItem
  } catch (e) {}
  return false
}

export function getSessionStorageItem (key, defaultValue) {
  if (isSessionStorageActive() && sessionStorage.getItem(key) !== null) {
    try {
      return sessionStorage.getItem(key)
    } catch (e) {
      console.log(e)
      return defaultValue || undefined
    }
  }
  return defaultValue || null
}

export function setSessionStorageItem (key, value) {
  if (isSessionStorageActive() && sessionStorage.setItem) {
    try {
      sessionStorage.setItem(key, value)
    } catch (e) {
      console.log(e)
      return false
    }
    return true
  }
  return false
}

export function removeSessionStorageItem (key) {
  if (isSessionStorageActive() && sessionStorage.removeItem) {
    try {
      sessionStorage.removeItem(key)
    } catch (e) {
      console.log(e)
      return false
    }
    return true
  }
  return false
}
