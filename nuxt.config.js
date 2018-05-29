module.exports = {
  env: {
    API_URL: process.env.API_URL || "http://localhost:4444/api/v1",
    AUTH_URL: process.env.AUTH_URL || "http://localhost:4444/api/auth"
  },

  /*
  ** Headers of the page
  */
  head: {
    title: "langsungjalan-dashboard",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "langsungjalan-dashboard"
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/images/logo.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Montserrat"
      },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"
      }
    ]
  },
  plugins: ["~/plugins/vuetify.js", "~/plugins/veevalidate.js"],
  css: ["~/assets/style/app.styl"],
  /*
  ** Customize the progress bar color
  */
  loading: { color: "#3B8070" },
  /*
  ** Build configuration
  */
  build: {
    vendor: ["~/plugins/vuetify.js"],
    extractCSS: true,
    /*
    ** Run ESLint on save
    */
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        })
      }
    }
  }
}
