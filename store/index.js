const cookieparser = require("cookieparser")
import axios from "axios"

export const state = () => ({
  sidebar: false,
  user: {},
  token: null,
  currentEdit: null
})

export const mutations = {
  toggleSidebar(state) {
    state.sidebar = !state.sidebar
  },
  user(state, p) {
    state.user = p
  },
  token(state, p) {
    state.token = p
  },
  currentEdit(state, p) {
    state.currentEdit = p
  }
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    let token = null
    let user = null

    if (req.headers.cookie) {
      let parsed = cookieparser.parse(req.headers.cookie)
      let data = JSON.parse(parsed.lj_token)
      token = data.token
      user = data.user
    }
    commit("token", token)
    commit("user", user)
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  }
}
