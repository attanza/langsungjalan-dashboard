import changeCase from "change-case"
import { mapState } from "vuex"
import axios from "axios"
import Noty from "~/components/Noty"

export default {
  components: { Noty },
  data: () => ({
    showNoty: false,
    notyText: "",
    notyColor: "success"
  }),
  mounted() {
    if (this.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`
      axios.defaults.headers.post["Content-Type"] = "application/json"
    }
  },
  methods: {
    inArray(keys, searchedKey) {
      let result = false
      for (let i in keys) {
        if (keys[i] === searchedKey) {
          result = true
        }
      }
      return result
    },
    setCase(txt) {
      return changeCase.titleCase(txt)
    }
  },
  computed: {
    ...mapState(["token", "currentEdit"])
  }
}
