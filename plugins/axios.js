/* eslint-disable prefer-promise-reject-errors */
export default function ({ $axios, store, redirect, route }) {
  if (process.env.NODE_ENV === 'production') {
    $axios.defaults.baseURL = 'xxx.com:8000/'
  } else {
    $axios.defaults.baseURL = '/api'
    $axios.proxy = true
  }

  $axios.debug = process.env._ENV === 'production'

  $axios.onRequest(config => {
    if (store.getters.isAuthenticated) {
      config.headers.Authorization = `Bearer ${store.state.token}`
    }
  })

  $axios.onResponse(response => response.data)

  $axios.onResponseError(async error => {
    if (!error.response) {
      return Promise.reject(error.message)
    }
    const data = error.response.data
    if (error.response.status === 401) {
      await store.dispatch('logout')
      redirect({ path: '/user/login', query: { next: route.fullPath } })
      return Promise.reject('登录信息无效，请重新登录')
    } else if (error.response.status === 500) {
      redirect('/500')
    } else {
      if (Object.keys(data).toString() === ['detail'].toString())
        return Promise.reject(data.detail)
      return Promise.reject(data)
    }
  })
}
