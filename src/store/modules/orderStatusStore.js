import {ORDER_STATUS_LIST} from '../action-types'
import {ORDER_STATUS_LIST_SET} from '../mutation-types'
import axiosIntence from '../../common/axiosIntence'

// 针对需后台请求的数据，初始值为null，针对本地数据，直接赋值
const state = {
  orderStatusList: null // 类型列表
}

// 执行异步获取数据，如ajax
const actions = {
  [ORDER_STATUS_LIST] ({ commit, state }) {
    if (state.orderStatusList !== null) { // 已初始化过，不需要再获取数据
      return
    }
    axiosIntence.post('/manage/common/getAllOrderStatus').then((response) => {
      commit(ORDER_STATUS_LIST_SET, {orderStatusList: response.data}) // 提交设置类型的变更
    })
  }
}
// 必须同步更改数据
const mutations = {
  [ORDER_STATUS_LIST_SET] (state, { orderStatusList }) {
    state.orderStatusList = orderStatusList || []
  }
}

export default {
  state,
  actions,
  mutations
}
