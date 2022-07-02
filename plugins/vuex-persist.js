import Persistence from 'vuex-persist'

export default ({ store, app }) => {
  new Persistence({
    restoreState: key => app.$cookies.get(key),
    saveState: (key, state) =>
      app.$cookies.set(key, state, {
        maxAge: 14 * 24 * 3600
      }),
    modules: ['user']
  }).plugin(store)
}
