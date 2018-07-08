import {SHIPMENT_TYPE_LIST} from '../action-types'
import {SHIPMENT_TYPE_LIST_SET} from '../mutation-types'
import axiosIntence from '../../common/axiosIntence'

// 针对需后台请求的数据，初始值为null，针对本地数据，直接赋值
const state = {
  shipmentTypeList: null // 类型列表
}

// 执行异步获取数据，如ajax
const actions = {
  [SHIPMENT_TYPE_LIST] ({ commit, state }) {
    if (state.shipmentTypeList !== null) { // 已初始化过，不需要再获取数据
      return
    }
    axiosIntence.post('/manage/common/getAllShipmentType').then((response) => {
      commit(SHIPMENT_TYPE_LIST_SET, {shipmentTypeList: response.data}) // 提交设置类型的变更
    })
  }
}
// 必须同步更改数据
const mutations = {
  [SHIPMENT_TYPE_LIST_SET] (state, { shipmentTypeList }) {
    state.shipmentTypeList = shipmentTypeList || []
  }
}

export default {
  state,
  actions,
  mutations
}
