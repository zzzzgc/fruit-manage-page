<template>
  <el-form :model="searchData" ref="searchData" label-width="80px" class="form-search">
    <div>
    <el-form-item label="客户名称">
      <el-input v-model="searchData.business_name" placeholder="请输入客户名称"></el-input>
    </el-form-item>
    <el-form-item label="销售人员">
      <el-input v-model="searchData.sales_name" placeholder="请输入销售名称"></el-input>
    </el-form-item>
    <el-form-item label="订单编号">
      <el-input v-model="searchData.order_id" placeholder="请收入订单编号"></el-input>
    </el-form-item>
    </div>
    <el-form-item label="退款时间">
      <el-date-picker
        v-model="searchData.create_time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 300px">
      </el-date-picker>
    </el-form-item>
    <el-form-item class="search-action">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import bus, {refund} from '../../../common/bus.js'
  import {dateArrayFmtDefined} from '../../../common/utils.js'
  export default {
    components: {},
    name: 'refund-search',
    created: function () {
    },
    data: function () {
      return {
        searchData: {business_name: '', sales_name: '', order_id: '', create_time: ''},
        procurementOptions: []
      }
    },
    mounted: function () {
      // 页面加载后直接被这个搜索触发加载页面初始化列表.为了防止其他地方又初始化一次,特此声明
      this.search()
    },
    methods: {
      search: function () { // 点击搜索
        bus.$emit(refund.search, Object.assign({}, this.searchData, {format_create_time: dateArrayFmtDefined(this.searchData.create_time, 'YYYY:MM:DD')}))
      },
      reset: function () {
        this.searchData.sales_name = ''
        this.searchData.business_name = ''
        this.searchData.order_id = ''
        this.search()
      }
    }
  }
</script>

<style scoped>
</style>
