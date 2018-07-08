<template>
  <el-form :model="searchData" ref="formSearch" label-width="80px" class="form-search">
      <!--<div>-->
        <el-form-item label="采购名称" prop="procurement_name">
          <el-input v-model="searchData.procurement_name" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="采购电话" prop="procurement_phone">
          <el-input v-model="searchData.procurement_phone" placeholder="请输入客户电话"></el-input>
        </el-form-item>
        <el-form-item label="采购编号" prop="procurement_id">
          <el-input v-model="searchData.procurement_id" placeholder="请输入客户编号"></el-input>
        </el-form-item>
      <!--</div>-->
      <!--<div>-->
        <el-form-item label="商品名称" prop="product_name">
          <el-input v-model="searchData.product_name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="product_id">
          <el-input v-model="searchData.product_id" placeholder="请输入商品编码"></el-input>
        </el-form-item>
      <!--</div>-->
      <!--<div>-->
        <el-form-item label="规格名称" prop="product_standard_name">
          <el-input v-model="searchData.product_standard_name" placeholder="请输入规格名称"></el-input>
        </el-form-item>
        <el-form-item label="规格编码" prop="product_standard_id">
          <el-input v-model="searchData.product_standard_id" placeholder="请输入规格编码"></el-input>
        </el-form-item>
      <!--</div>-->
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="searchData.create_time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 300px">
        </el-date-picker>
      </el-form-item>
    <!--<div>-->
      <el-form-item class="search-action">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    <!--</div>-->
  </el-form>
</template>

<script>
  import bus, {procurementQuota} from '../../../common/bus.js'
  import {dateArrayFmt} from '../../../common/utils.js'

  export default {
    components: {},
    name: 'search',
    data: function () {
      return {
        searchData: {
          product_id: '',
          product_name: '',
          product_standard_id: '',
          product_standard_name: '',
          procurement_id: '',
          procurement_name: '',
          procurement_phone: '',
          create_time: []
        },
        // create_time: [],
        loading: false,
        dataArray: {
          format_create_time: []
        }
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
      search: function () { // 点击搜索
        console.log(dateArrayFmt(this.searchData.create_time))
        console.log('searchData数据')
        console.log(this.searchData)
        this.dataArray.format_create_time = dateArrayFmt(this.searchData.create_time)
        // bus.$emit(procurementQuota.search, Object.assign({}, this.searchData))
        bus.$emit(procurementQuota.search, Object.assign({}, this.searchData, this.dataArray))
      },
      reset: function () { // 点击重置
        this.$refs['formSearch'].resetFields()
        this.searchData.create_time = []
        this.search()
      }
    }
  }
</script>

<style scoped>

</style>
