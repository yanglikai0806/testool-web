import axios from 'axios'
// import store from '@/store';
import { message } from "ant-design-vue";

// axios 配置
var instance = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  timeout: 60000,
  baseURL: process.env.VUE_APP_BASE_API,
})

// 可以在这先申明错误代码表示的含义

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // const token = store.state.user.token
    // const token = store.state.user.token
    // if (token) {
    //   config.headers.Authorization = 'Bearer ' + token
    // }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const rsp = response.data
    if (rsp.code !== 200) {
      console.log(rsp)
      message.warn(rsp.desc)
    }
    return rsp
  },
  (error) => {
    console.log(error)
  }
)

export default instance

/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    console.log(url)
    console.log(data)
    instance.post(url, data).then(
      (response) => {
        // 对接口错误码做处理
        resolve(response)
      },
      (err) => {
        reject(err)
      }
    )
  })
}

/**
 * get 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
function get(url, data = {}) {
  return new Promise((resolve, reject) => {
    instance
      .get(url, {
        params: data,
      })
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 封装所有请求
 * @param methed
 * @param url
 * @param data
 * @param headers
 * @returns {Promise}
 */
function request(methed, url, data = {}, headers) {
  return new Promise((resolve, reject) => {
    instance({
      method: methed || 'post',
      url: url,
      data:
        methed === 'get'
          ? {
              params: data,
            }
          : data,
      headers: headers || {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        // 对接口错误码做处理
        resolve(response.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

function getContent(url, contentType) {
  url = url + '?ts=' + new Date().getTime()
  axios.defaults.headers.post['Content-Type'] = contentType || 'application/plain;charset=UTF-8'
  return axios.get(url)
}

export { get as axiosGet, post as axiosPost, request as axiosReq, getContent as getContent }
