import {ROLE_ALL_LIST} from '../action-types'
import {ROLE_ALL_LIST_SET} from '../mutation-types'
import axiosIntence from '../../common/axiosIntence'

// 针对需后台请求的数据，初始值为null，针对本地数据，直接赋值
const state = {
  roleList: null // 类型列表
}

// 执行异步获取数据，如ajax
const actions = {
  [ROLE_ALL_LIST] ({ commit, state }) {
    if (state.roleList !== null) { // 已初始化过，不需要再获取数据
      return
    }
    axiosIntence.post('/manage/role/getRoleList').then((response) => {
      commit(ROLE_ALL_LIST_SET, {roleList: response.data}) // 提交设置类型的变更
    })
  }
}
// 必须同步更改数据
const mutations = {
  [ROLE_ALL_LIST_SET] (state, { roleList }) {
    state.roleList = roleList || []
  }
}

export default {
  state,
  actions,
  mutations
}
