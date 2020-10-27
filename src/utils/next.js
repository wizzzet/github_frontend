export function getNextParam (defaultRoute) {
  if ('next' in this.$route.query) {
    return this.$route.query.next
  }

  if (typeof (defaultRoute) !== 'undefined') {
    return defaultRoute
  }
  return '/'
}

export function setNextParam (route) {
  if (typeof (route) === 'undefined') {
    route = this.$route
  }
  if ('next' in route.query) {
    return route.query.next
  }

  return route.fullPath
}
