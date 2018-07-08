<template>
  <div class="product">
    <table-search></table-search>
    <table-list></table-list>
    <!--<add-or-edit></add-or-edit>-->
    <!-- 商品规格 -->
    <transition name="standard" mode="out-in">
      <!--standard.sync用于子组件更新showStandard状态-->
      <sub-list v-show="showStandard" :standard.sync="showStandard"></sub-list>
    </transition>
  </div>
</template>

<script>
import tableSearch from './Search'
import tableList from './List'
import subList from '../productStandard/List'
import bus, {productStandard} from '../../common/bus.js'

export default {
  name: 'product',
  components: {
    tableSearch,
    tableList,
    subList
  },
  data: function () {
    return {
      showStandard: false
    }
  },
  created: function () {
    bus.$on(productStandard.search, (productId) => { // 监听外部查询数据事件
      this.showStandard = true
    })
  }
}
</script>

<style scoped>
  .product {
    position: relative;
    overflow: hidden;
  }
  .standard-enter-active, .standard-leave-active {
    transition: all 0.3s ease;
    left: 30% !important;
  }

  .standard-enter, .standard-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    left: 100% !important;
  }
</style>
