import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import axiosIntence from './common/axiosIntence'
import './assets/common.css'
import {ajaxPrefix} from './common/const.js'

Vue.use(ElementUI) // 加载element组件

Vue.prototype.$http = axiosIntence // 将http设置到vue组件中

/*
上传地址
上传后返回fileName 文件名
*/
Vue.prototype._uploadFilePath = ajaxPrefix + 'manage/common/upload'

// ---------------------------------------------------------------
// // 本地:文件下载地址,例如直接访问-> this._downloadFilePath + 文件名
Vue.prototype._downloadFilePath = 'http://localhost:8080/upload/file/'

// 测试:文件下载地址,例如直接访问-> this._downloadFilePath + 文件名
// Vue.prototype._downloadFilePath = 'http://192.168.3.123:8080/upload/file/'

// // 正式:文件下载地址,例如直接访问-> this._downloadFilePath + 文件名
// Vue.prototype._downloadFilePath = 'http://admin.52xiguo.com/upload/file/'
// ----------------------------------------------------------------

// excel文件下载地址,JFINAL设置的上传下载地址
Vue.prototype._downloadExcelFilePath = ajaxPrefix + 'manage/excel/'

// Vue.prototype._ajaxPrefix = '/api/'// 测试使用，用于代理匹配，上线打包时需更改为/

// 设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false

// 这个注释不能删否则 eslint 会检测下面语法错误
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
