export const state = () => ({
  user: undefined,
  locale: 'zh-CN',
  loading: false
})

export const getters = {
  isAuthenticated(state) {
    return !!state.user
  },
  isAdmin(state, getters) {
    return Boolean(getters.isAuthenticated && Boolean(state.user.is_staff))
  }
}

export const mutations = {
  updateUser(state, user) {
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
  startLoading({ commit }) {
    commit('updateLoading', true)
  },
  stopLoading({ commit }) {
    commit('updateLoading', false)
  }
}
