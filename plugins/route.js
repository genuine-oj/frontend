const WHITE_LSIT = ['/', '/user/login']

export default ({ app, store }) => {
  app.router.beforeEach((to, from, next) => {
    if (!WHITE_LSIT.includes(to.path) && !store.getters.isAuthenticated) {
      next({ path: '/user/login', query: { next: to.fullPath } })
    } else next()
  })
}
