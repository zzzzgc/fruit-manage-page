import axios from 'axios'
import {Loading, Message} from 'element-ui'
import {ajaxPrefix} from './const.js'

var globalLoadingInstance = {
  loadingNum: 0,
  loadingInstance: null,
  show: function () {
    this.loadingNum++
    this.loadingInstance = Loading.service({fullscreen: true})
  },
  hide: function () {
    this.loadingNum--
    if (this.loadingNum <= 0) {
      this.loadingInstance.close()
    }
  }
}

// 将http设置到vue全局属性中
let httpIntence = axios.create({
  // baseURL: serverHost + '/',
  baseURL: ajaxPrefix,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  responseType: 'json',
  transformRequest: [
    function (data) { // 将post的数据转换成key-val的格式，支持基本数据类型的数组参数转换为多个key-val，不支持对象转换需自己转换后调用请求
      let ret = ''
      for (let it in data) {
        if (data[it] instanceof Array) {
          for (let arr of data[it]) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(arr) + '&'
          }
        } else {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
      }
      return ret
    }
  ],
  // transformResponse: [function (data) {
  //   return data
  // }],
  withCredentials: true // 加了这段就可以跨域了
})

// 请求拦截器
httpIntence.interceptors.request.use(function (config) { // 如果请求配置了显示蒙层，则展示
  config.showLoading && globalLoadingInstance.show()
  return config
}, function (error) {
  return error
})
// 响应拦截器
httpIntence.interceptors.response.use(function (response) { // 如果请求配置了显示蒙层，响应后判断是否需隐藏蒙层
  response.config.showLoading && globalLoadingInstance.hide()
  return response
}, function (error) { // 检查请求是否异常，如果异常弹出提示
                      // console.info(arguments)
  if (error.response && error.response.status === 420) { // 后台设置了420自定义错误，此处显示具体错误原因
    // console.info(error)
    let errorText = error.response.statusText
    if (errorText === null || errorText === '' || errorText === 'unknown') { // 后台即使使用response.setStatus设置错误文本，这里也拿不到，所以后台也会设置到header中
      errorText = error.response.headers['error-text']
    }
    Message.warning({duration: 0, message: decodeURI(errorText), type: 'error', showClose: true})
  } else if (error.response && error.response.status === 401) { // 身份认证失败
    window.location = '/login'
  } else if (error.response && error.response.status === 403) { // 没有操作权限
    Message.error('暂无权限，请联系管理员')
  } else {
    Message.error('请求数据异常，请稍后重试(' + error.message + ')')
  }
  error.config.showLoading && globalLoadingInstance.hide()
  throw error
  // return error // 如果使用return，则ajax的response会接收到错误的数据，为了统一处理错误，此处不能将错误返回到response
})

export default httpIntence
