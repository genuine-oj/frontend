import VuexPersist from 'vuex-persist'

export default ({ store }) => {
  new VuexPersist({
    modules: ['token', 'user'],
    storage: window.sessionStorage
  }).plugin(store)
}
