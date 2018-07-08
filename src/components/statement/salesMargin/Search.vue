<template>
  <el-form :model="searchData" ref="formSearch" label-width="80px" class="form-search">
    <el-form-item label="销售名称">
      <el-input v-model="searchData.nick_name" placeholder="请输入销售名称"></el-input>
    </el-form-item>
    <el-form-item label="客户名称">
      <el-input v-model="searchData.business_name" placeholder="请输入客户名称"></el-input>
    </el-form-item>
    <el-form-item label="订单周期">
      <el-date-picker
        v-model="searchData.order_cycle_date"
        type="daterange"
        range-separator="至"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期" style="width:330px;">
      </el-date-picker>
      <!--<el-input v-model="searchData.order_cycle_date" placeholder="请输入首日订单周期时间开始区间"></el-input>-->
    </el-form-item>
    <el-form-item class="search-action">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import bus, {salesMargin} from '../../../common/bus.js'

  export default {
    name: 'sales-margin-search',
    data: function () {
      return {
        searchData: {nick_name: '', business_name: '', order_cycle_date: ''},
        loading: false
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
      search: function () { // 点击搜索
        bus.$emit(salesMargin.search, Object.assign({}, this.searchData))
      },
      reset: function () { // 点击重置
        this.$refs['formSearch'].resetFields()
        this.searchData = {}
        this.search()
      }
    }
  }
</script>

<style scoped>

</style>
