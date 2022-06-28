export default function ({ $axios, redirect }) {
  $axios.debug = process.env.NODE_ENV === 'production'

  $axios.onResponseError(error => {
    if (!error.response) {
      return Promise.reject(error.message)
    }
    const data = error.response.data
    if (error.response.status === 500) {
      redirect('/500')
    } else {
      if (Object.keys(data).toString() === ['detail'].toString())
        return Promise.reject(data.detail)
      return Promise.reject(data)
    }
  })
}
