import {PERMISSION_LIST} from '../action-types'
import {PERMISSION_LIST_SET} from '../mutation-types'
import axiosIntence from '../../common/axiosIntence'

// 针对需后台请求的数据，初始值为null，针对本地数据，直接赋值
const state = {
  permissionList: null // 类型列表
}

// 执行异步获取数据，如ajax
const actions = {
  [PERMISSION_LIST] ({ commit, state }) {
    if (state.permissionList !== null) { // 已初始化过，不需要再获取数据
      return
    }
    axiosIntence.post('/manage/common/getPermissionList').then((response) => {
      commit(PERMISSION_LIST_SET, {permissionList: response.data}) // 提交设置类型的变更
    })
  }
}
// 必须同步更改数据
const mutations = {
  [PERMISSION_LIST_SET] (state, { permissionList }) {
    state.permissionList = permissionList || []
  }
}

export default {
  state,
  actions,
  mutations
}
