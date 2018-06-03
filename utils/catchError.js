import Noty from "noty"

export default e => {
  const { status } = e.response
  if (status && status === 422) {
    const { details } = e.response.data
    details.forEach(d => {
      showNoty(d.message, "error")
    })
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
