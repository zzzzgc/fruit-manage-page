import {MENU_ALL_LIST} from '../action-types'
import {MENU_ALL_LIST_SET} from '../mutation-types'
import axiosIntence from '../../common/axiosIntence'

// 针对需后台请求的数据，初始值为null，针对本地数据，直接赋值
const state = {
  menuList: null // 类型列表
}

// 执行异步获取数据，如ajax
const actions = {
  [MENU_ALL_LIST] ({ commit, state }) {
    if (state.menuList !== null) { // 已初始化过，不需要再获取数据
      return
    }
    axiosIntence.post('/manage/common/getMenuList').then((response) => {
      commit(MENU_ALL_LIST_SET, {menuList: response.data}) // 提交设置类型的变更
    })
  }
}
// 必须同步更改数据
const mutations = {
  [MENU_ALL_LIST_SET] (state, { menuList }) {
    state.menuList = menuList || []
  }
}

export default {
  state,
  actions,
  mutations
}
