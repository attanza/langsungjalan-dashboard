import changeCase from "change-case"
import { mapState } from "vuex"
import axios from "axios"
import Noty from "~/components/Noty"
import Tbtn from "~/components/Tbtn"

export default {
  components: { Noty, Tbtn },
  data() {
    return {
      loading: false,
      showForm: false,
      totalItems: 0,
      search: "",
      pagination: {
        sortBy: "",
        descending: false,
        page: 1,
        rowsPerPage: 10
      }
    }
  },
  mounted() {
    this.setAuth()
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
    },
    setSnakeCase(txt) {
      return changeCase.snakeCase(txt)
    },
    setAuth() {
      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`
        axios.defaults.headers.post["Content-Type"] = "application/json"
      }
    }
  },
  computed: {
    ...mapState([
      "token",
      "currentEdit",
      "comboData",
      "comboData2",
      "comboData3",
      "permissions",
      "user"
    ])
  }
}
