export const state = () => ({
  token: '',
  user: {},
  locale: 'zh-CN',
  loading: false
})

export const getters = {
  isAuthenticated(state) {
    return !!state.token && state.token.length > 0
  },
  isAdmin(state) {
    return Boolean(state.user.is_staff)
  }
}

export const mutations = {
  updateAuth(state, { token, user }) {
    state.token = token
    state.user = user
  },
  updateLocale(state, locale) {
    state.locale = locale
  },
  updateLoading(state, loading) {
    state.loading = loading
  }
}

export const actions = {
  login({ commit }, { token, user }) {
    commit('updateAuth', { token, user })
  },
  logout({ commit }) {
    commit('updateAuth', { token: '', user: {} })
  },
  startLoading({ commit }) {
    commit('updateLoading', true)
  },
  stopLoading({ commit }) {
    commit('updateLoading', false)
  }
}
