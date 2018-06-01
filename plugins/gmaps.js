import Vue from "vue"
import * as VueGoogleMaps from "~/node_modules/vue2-google-maps"

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyC3D6Wz7A1JuM3LWTRhuGOuzXRJ1mDpRnY",
    libraries: "places"
  }
})
