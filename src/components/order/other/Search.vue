<template>
  <el-form :model="searchData" ref="formSearch" label-width="80px" class="form-search">
    <div>
      <el-form-item label="客户名称:" prop="customer_name">
        <el-input v-model="searchData.customer_name" placeholder="请输入客户名称"></el-input>
      </el-form-item>
      <el-form-item label="客户电话" prop="customer_phone">
        <el-input v-model="searchData.customer_phone" placeholder="请输入客户电话"></el-input>
      </el-form-item>
      <el-form-item label="客户编号" prop="customer_id">
        <el-input v-model="searchData.customer_id" placeholder="请输入客户编号"></el-input>
      </el-form-item>
      <el-form-item label="商品名称" prop="product_name">
        <el-input v-model="searchData.product_name" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品编码" prop="product_id">
        <el-input v-model="searchData.product_id" placeholder="请输入商品编码"></el-input>
      </el-form-item>
    </div>
    <div>
      <el-form-item label="规格名称" prop="standard_name">
        <el-input v-model="searchData.standard_name" placeholder="请输入规格名称"></el-input>
      </el-form-item>
      <el-form-item label="规格编码" prop="standard_id">
        <el-input v-model="searchData.standard_id" placeholder="请输入规格编码"></el-input>
      </el-form-item>
      <el-form-item label="店铺名称" prop="businessInfo_name">
        <el-input v-model="searchData.businessInfo_name" placeholder="请输入店铺名称"></el-input>
      </el-form-item>
      <el-form-item label="店铺编码" prop="businessInfo_id">
        <el-input v-model="searchData.businessInfo_id" placeholder="请输入规格编码"></el-input>
      </el-form-item>
      <el-form-item label="所在省市">
        <el-cascader placeholder="单机选择省市" :options="provinceAndCityData" @change="handleChangePriovinceAndCityData" v-model="provinceAndCityArray"></el-cascader>
      </el-form-item>
    </div>
    <div>
      <el-form-item label="订单号" prop="order_id">
        <el-input v-model="searchData.order_id" placeholder="请输入订单号"></el-input>
      </el-form-item>
      <el-form-item label="下单时间">
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
    </div>
  </el-form>
</template>

<script>
  import bus, {orderOther} from '../../../common/bus.js'
  import {provinceAndCityDataPlus, CodeToText} from 'element-china-area-data'
  import {dateArrayFmt} from '../../../common/utils.js'

  export default {
    components: {},
    name: 'search',
    data: function () {
      return {
        searchData: {
          customer_name: '',
          customer_phone: '',
          customer_id: '',
          product_name: '',
          product_id: '',
          standard_name: '',
          standard_id: '',
          businessInfo_name: '',
          businessInfo_id: '',
          search_province: '',
          search_city: '',
          create_time: [],
          order_id: ''
        },
        loading: false,
        provinceAndCityArray: [],
        provinceAndCityData: provinceAndCityDataPlus,
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
        this.dataArray.format_create_time = dateArrayFmt(this.searchData.create_time)
        bus.$emit(orderOther.search, Object.assign({}, this.searchData, this.dataArray))
      },
      reset: function () { // 点击重置
        this.$refs['formSearch'].resetFields()
        this.searchData.create_time = []
        this.provinceAndCityArray = []
        this.search()
      },
      handleChangePriovinceAndCityData: function () { // 选中省市的时候并给相关字段进行赋值操作
        this.searchData.search_province = CodeToText[this.provinceAndCityArray[0]]
        this.searchData.search_city = CodeToText[this.provinceAndCityArray[1]]
      }
    }
  }
</script>

<style scoped>

</style>
