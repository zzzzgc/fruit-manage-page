import Vue from 'vue'
import Vuex from 'vuex'
import {INIT_TYPE} from './action-types'
import {SET_TYPE} from './mutation-types'
import axiosIntence from '../common/axiosIntence'
import product from './modules/productStore'
import permission from './modules/permissionStore'
import role from './modules/roleStore'
import menu from './modules/menuStore'
import menuByUid from './modules/menuByUidStore'
import orderStatus from './modules/orderStatusStore'
import shipmentType from './modules/shipmentTypeStore'
// import * as actions from './actions'
// import * as getters from './getters'
// import cart from './modules/cart'
// import products from './modules/products'
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

const state = {
  types: null // 这里不要使用[]做为默认值，因为null值是判断是否有加载过数据
}

const actions = {
  [INIT_TYPE] ({ commit, state }) {
    if (state.types !== null) { // 已初始化过，不需要再获取数据
      return
    }
    axiosIntence.post('/getType').then((response) => {
      commit(SET_TYPE, {types: response.data}) // 提交设置类型的变更
    })
  }
}
const mutations = {
  [SET_TYPE] (state, { types }) { // 设置类型
    state.types = types || []
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    product,
    permission,
    role,
    menu,
    menuByUid,
    orderStatus,
    shipmentType
    // types: {
    //   namespaced: true,// 如果使用了命名空间，则getters、actions、mutations的触发路径会有变化，默认是挂在全局命名空间的，但是命名空间不影响state的路径（state.模块名称）
    //   ...types
    // }
  }
  // modules: {
  //   cart,
  //   products
  // }
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
})
