export const state = () => ({
  locale: 'zh-CN',
  loading: false
})

/**
 * Getters
 * @type {{isAuthenticated(Object): Boolean, isAdmin(Object): Boolean}}
 */
export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },
  /**
   * IsAdmin
   * @param state
   * @param {Object} state.auth
   * @param {Object} state.auth.user
   * @param {Boolean} state.auth.user.is_staff
   * @returns {boolean}
   */
  isAdmin(state) {
    return Boolean(state.auth.loggedIn && Boolean(state.auth.user.is_staff))
  }
}

// noinspection JSUnusedGlobalSymbols
/**
 * Mutations
 * @type {{updateLoading(Object, Boolean): void, updateLocale(Object, String): void}}
 */
export const mutations = {
  updateLocale(state, locale) {
    state.locale = locale
  },
  updateLoading(state, loading) {
    state.loading = loading
  }
}

/**
 * Actions
 * @type {{stopLoading({commit: Function}): void, startLoading({commit: Function}): void}}
 */
export const actions = {
  startLoading({ commit }) {
    commit('updateLoading', true)
  },
  stopLoading({ commit }) {
    commit('updateLoading', false)
  }
}
