export default function({ isHMR, app, store, error }) {
  const defaultLocale = app.i18n.fallbackLocale
  // If middleware is called from hot module replacement, ignore it
  if (isHMR) return
  const locale = store.state.locale || defaultLocale
  if (store.state.locales.indexOf(locale) === -1) {
    console.log('lang error') //eslint-disable-line
    return error({
      message: "This page could not be found.",
      statusCode: 404
    })
  }
  //Mutate the store's locale once we understand which locale is being requested prior to each page render
  console.log('locale', locale) //eslint-disable-line
  store.commit("SET_LANG", locale)
  // Set locale from the query string '?lang='**''
  app.i18n.locale = store.state.locale
}
