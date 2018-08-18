import Vue from "vue"
import * as VueGoogleMaps from "~/node_modules/vue2-google-maps"

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyA8mNtrv2H7IGeVrYncJbCrzqFPVK7Fy6I",
    libraries: "places"
  }
})
