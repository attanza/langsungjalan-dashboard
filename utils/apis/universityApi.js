import axios from "axios"
import Cookie from "js-cookie"

axios.defaults.baseURL = process.env.API_URL
axios.defaults.headers.post["Content-Type"] = "application/json"

export async function universityList(page, rowsPerPage, search) {
  await setHeader()
  let endPoint = `/universities?page=${page}&limit=${rowsPerPage}&search=${search}`
  // let endPoint = "/universities"

  return await axios.get(endPoint).then(res => res.data)
}

async function setHeader() {
  const tokenData = await Cookie.getJSON("lj_token")
  axios.defaults.headers.common["Authorization"] = `Bearer ${tokenData.token}`
  return true
}
