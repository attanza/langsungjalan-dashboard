import Noty from "noty"
import Cookie from "js-cookie"

export default e => {
  const { status } = e.response
  if (status && status === 422) {
    const { details } = e.response.data
    details.forEach(d => {
      showNoty(d.message, "error")
    })
  } else if (status && status === 401) {
    Cookie.remove("lj_token")
    this.$router.push("/login")
  }
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
