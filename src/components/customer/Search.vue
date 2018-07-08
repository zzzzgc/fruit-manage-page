<template>
  <el-form :model="searchData" ref="formSearch" label-width="80px" class="form-search">
    <el-form-item label="所在省市">
      <el-cascader placeholder="单击选择省市" :options="provinceAndCityData" @change="handleChangePriovinceAndCityData" v-model="provinceAndCityArray"></el-cascader>
    </el-form-item>
    <el-form-item label="商家编号">
      <el-input v-model="searchData.uid" placeholder="请输入商家编号"></el-input>
    </el-form-item>
    <el-form-item label="商家名称">
      <el-input v-model="searchData.business_name" placeholder="请输入商家名称"></el-input>
    </el-form-item>
    <el-form-item label="商家电话">
      <el-input v-model="searchData.business_phone" placeholder="请输入商家电话"></el-input>
    </el-form-item>
    <el-form-item label="销售名称">
      <el-input v-model="searchData.sales_name" placeholder="请输入销售名称"></el-input>
    </el-form-item>
    <el-form-item label="销售电话">
      <el-input v-model="searchData.sales_phone" placeholder="请输入销售电话"></el-input>
    </el-form-item>
    <el-form-item label="注册时间">
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
  import bus, {customer} from '../../common/bus.js'
  import {dateArrayFmt} from '../../common/utils.js'
  import {provinceAndCityDataPlus, CodeToText} from 'element-china-area-data'

  export default {
    components: {},
    name: 'product-search',
    created: function () {
    },
    data: function () {
      return {
        searchData: {create_time: [], business_id: '', business_phone: '', business_name: '', search_province: '', search_city: '', sales_name: '', sales_phone: ''},
        provinceAndCityArray: [],
        provinceAndCityData: provinceAndCityDataPlus
      }
    },
    mounted: function () {
      // 页面加载后直接被这个搜索触发加载页面初始化列表.为了防止其他地方又初始化一次,特此声明
      this.search()
    },
    methods: {
      search: function () { // 点击搜索
        bus.$emit(customer.search, Object.assign({}, this.searchData, {format_create_time: dateArrayFmt(this.searchData.create_time)}))
      },
      reset: function () { // 点击重置
        this.$refs['formSearch'].resetFields()
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
