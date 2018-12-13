module.exports = {
  env: {
    API_URL: process.env.API_URL || "http://localhost:4444/api/v1"
    // API_URL: process.env.API_URL || "http://13.251.123.94/api/v1"
  },

  /*
  ** Headers of the page
  */
  head: {
    title: "Langsung Jalan",
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
  plugins: [
    "~/plugins/vuetify.js",
    "~/plugins/veevalidate.js",
    "~/plugins/gmaps.js",
    "~/plugins/dateformat.js",
    "~/plugins/eventBus.js"
  ],
  css: [
    "~/assets/style/app.styl",
    "~/node_modules/noty/src/noty.scss",
    "~/node_modules/noty/src/themes/metroui.scss",
    "~/static/css/custom.css"
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: "#EF6C00" },
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      "~/plugins/vuetify.js",
      "axios",
      "lodash",
      "noty",
      "export-to-csv"
    ],
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
        });
      }
    }
  }
};
