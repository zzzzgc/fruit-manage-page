<template>
  <el-form :model="searchData" ref="formSearch" label-width="90px" class="order-search">
    <el-form-item label="订单编号" prop="order_id">
      <el-input v-model="searchData.order_id" placeholder="请输入订单编号"></el-input>
    </el-form-item>
    <el-form-item label="商品编号" prop="product_id">
      <el-input v-model="searchData.product_id" placeholder="请输入商品编号"></el-input>
    </el-form-item>
    <el-form-item label="买家UID" prop="uid">
      <el-input v-model="searchData.uid" placeholder="请输入买家UID"></el-input>
    </el-form-item>
    <el-form-item label="订单状态" prop="order_status">
      <el-select v-model="searchData.order_status">
        <el-option label="不限" value=""></el-option>
        <el-option v-for="(value, key) in orderStatusStore.orderStatusList" :key="key" :label="value" :value="key"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="下单时间" prop="create_time">
      <el-date-picker
        v-model="searchData.create_time"
        type="daterange"
        :editable=false
        format="yyyy-MM-dd">
      </el-date-picker>
    </el-form-item>
    <el-form-item class="search-action">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import bus, {order} from '../../common/bus.js'
import { dateArrayFmt } from '../../common/utils.js'
import { ORDER_STATUS_LIST } from '../../store/action-types'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'order-search',
  data: function () {
    return {
      searchData: {order_status: '', order_id: '', product_id: '', uid: '', create_time: []},
      loading: false
    }
  },
  mounted: function () {
    this.getAllOrderStatus()
    this.search()
  },
  computed: mapState({
    'orderStatusStore': 'orderStatus'
  }),
  methods: {
    search: function () { // 点击搜索
      bus.$emit(order.search, Object.assign({}, this.searchData, {order_time: dateArrayFmt(this.searchData.order_time)}))
    },
    ...mapActions({
      getAllOrderStatus: ORDER_STATUS_LIST
    }),
    reset: function () { // 点击重置
      this.$refs['formSearch'].resetFields()
      this.search()
    }
  }
}
</script>

<style scoped>
  .order-search {
    margin: 10px 0;
  }
  .order-search .el-form-item.search-action{
    text-align: center;
  }
  .order-search .el-form-item {
    display: inline-block;
    margin-bottom: 10px;
  }
  .order-search .el-form-item .el-input__inner {
    width: 220px;
  }
</style>
