const routesWithoutAuthentication = [
  '/login',
  '/register',
  '/password-reset',
  '/password-reset/request',
  '/password-reset/sent',
  '/updated-password',
]

const updatePath = (toPath, newPath) => {
  if (typeof toPath === 'string' || toPath instanceof String) {
    toPath = newPath
  } else {
    toPath.pathname = newPath
  }
  return toPath
}

const pathInterceptor = toPath => {
  if (
    !window.localStorage.authToken &&
    !routesWithoutAuthentication.includes(toPath.pathname)
  ) {
    toPath = updatePath(toPath, '/login')
  }
  if (
    window.localStorage.authToken &&
    routesWithoutAuthentication.includes(toPath.pathname)
  ) {
    toPath = updatePath(toPath, '/')
  }
  return toPath
}

export const historyEnhancer = originalHistory => {
  originalHistory.location = pathInterceptor(originalHistory.location)
  return {
    ...originalHistory,
    push: (path, ...args) =>
      originalHistory.push(pathInterceptor(path), ...args),
    replace: (path, ...args) =>
      originalHistory.replace(pathInterceptor(path), ...args),
  }
}
