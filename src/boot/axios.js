import axios from 'axios'
import { getToken, setToken } from '../utils/auth'
import eventHub from '../utils/eventHub'
import API from '../api'
import config from '../../config'
import { Alert } from '../utils/alert'

export const $axios = axios.create({
  baseURL: config.baseURL,
  timeout: 1000 * 60
})

$axios.interceptors.request.use(function (conf) {
  // console.log('Making request to ' + conf.url)

  let token = getToken()
  if (token) {
    conf.headers['Authorization'] = `Bearer ${token}`
  }

  if (typeof (conf.params) === 'undefined') {
    conf.params = {}
  }
  if (!conf.headers) {
    conf.headers = {}
  }

  conf.headers['accept-language'] = config.acceptLanguage || 'ru-RU;q=0.9'
  // conf.params.site_id = config.siteID

  return conf
}, error => {
  return Promise.reject(error)
})

$axios.interceptors.response.use(response => {
  // Do something with response data
  return response
}, error => {
  const status = parseInt(error.response && error.response.status)
  if (status === 403) {
    if (process.browser) {
      return eventHub.$emit('global:rejectAuth')
    }
  } else if (status === 502 || status === 504) {
    Alert('Access error', 'Server is temporarily unavailable.')
  } else if (status === 401) {
    let originalRequest = error.config

    originalRequest.baseURL = ''
    originalRequest._retry = true

    return $axios
      .post(API.auth.tokenRefresh(), { token: getToken() })
      .then(response => {
        setToken(response.data.token)

        originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`
        return $axios(originalRequest)
      }).catch(() => {
        return eventHub.$emit('global:rejectAuth')
      })
  }
  return Promise.reject(error)
})

export default ({ Vue }) => {
  Vue.prototype.$axios = $axios
}
