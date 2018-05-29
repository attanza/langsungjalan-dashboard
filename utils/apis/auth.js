import axios from "axios"

axios.defaults.baseURL = process.env.API_URL
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post["Content-Type"] = "application/json"

export function postLogin(credential) {
  let endPoint = "/login"
  return axios.post(endPoint, credential).then(res => res.data)
}
