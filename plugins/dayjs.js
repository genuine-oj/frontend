export default ({ app, store }) => {
  store.subscribe(mutation => {
    if (mutation.type === 'updateLocale')
      app.$dayjs.locale(mutation.payload.toLowerCase())
  })
}
