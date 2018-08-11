import Noty from "noty"
import Cookie from "js-cookie"
// import store from "../store"

export default e => {
  if (e.response) {
    const status = e.response.status
    const { message } = e.response.data.meta
    switch (status) {
      case 400:
        showNoty(message, "error")
        break
      case 422:
        {
          const { details } = e.response.data
          details.forEach(d => {
            showNoty(d.message, "error")
          })
        }
        break
      case 401:
        toLogin()
        break

      case 403:
        showNoty(message, "error")
        break

      default:
        showNoty(
          "Internal Server Error, please contact our Administrator",
          "error"
        )
        break
    }
  } else {
    toLogin("Internal Server Error, please contact our Administrator")
  }
}

function toLogin(message) {
  if (message) alert(message)
  Cookie.remove("lj_token")
  window.location = "/login"
}

export function showNoty(text, type) {
  return new Noty({
    layout: "topRight",
    text,
    theme: "metroui",
    timeout: 5000,
    progressBar: true,
    type
  }).show()
}
