const routes = [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      {
        path: '',
        component: () => import('pages/users/users'),
        name: 'index'
      },
      {
        path: 'users/:id',
        component: () => import('pages/users/user-card'),
        name: 'user-card'
      },
      {
        path: 'users/:id/repos/:repoId',
        component: () => import('pages/repos/repo-card'),
        name: 'repo-card'
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/errors/404'),
    name: 'error-404'
  })
}

export default routes
