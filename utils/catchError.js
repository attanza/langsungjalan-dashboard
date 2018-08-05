import Noty from "noty"
import Cookie from "js-cookie"

export default (e, redirect) => {
  const { status } = e.response
  if (status && status === 422) {
    const { details } = e.response.data
    details.forEach(d => {
      showNoty(d.message, "error")
    })
  } else if (status && status === 401) {
    Cookie.remove("lj_token")
    redirect("/login")
  } else if (status && status === 400) {
    const { message } = e.response.data.meta
    showNoty(message, "error")
  } else if (status && status === 403) {
    const { message } = e.response.data.meta
    showNoty(message, "error")
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
