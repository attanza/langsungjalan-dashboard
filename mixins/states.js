import { mapState } from "vuex"
import axios from "axios"
export default {
  mounted() {
    if (this.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`
      axios.defaults.headers.post["Content-Type"] = "application/json"
    }
  },
  computed: {
    ...mapState(["token"])
  }
}
