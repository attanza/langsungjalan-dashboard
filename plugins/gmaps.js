import Vue from "vue"
import * as VueGoogleMaps from "~/node_modules/vue2-google-maps"

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBe1bONRdxVvkVNOZs9RTYs7vn70btuuB8",
    libraries: "places"
  }
})
