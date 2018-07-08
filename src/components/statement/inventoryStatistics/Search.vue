<template>
  <el-form :model="searchData" ref="formSearch" label-width="80px" class="form-search">
    <el-form-item label="商品名称">
      <el-input v-model="searchData.product_name" placeholder="请输入商品名称"></el-input>
    </el-form-item>
    <el-form-item label="规格名称">
      <el-input v-model="searchData.product_standard_name" placeholder="请输入商品规格名称"></el-input>
    </el-form-item>
    <el-form-item label="商品编号">
      <el-input v-model="searchData.product_id" placeholder="请输入商品名称"></el-input>
    </el-form-item>
    <el-form-item label="规格编号">
      <el-input v-model="searchData.product_standard_id" placeholder="请输入商品规格名称"></el-input>
    </el-form-item>
    <el-form-item class="search-action">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import bus, {inventoryStatistics} from '../../../common/bus.js'
  export default {
    components: {},
    name: 'inventory-statistics-search',
    created: function () {
    },
    data: function () {
      return {
        searchData: {product_name: '', product_standard_name: '', product_id: '', product_standard_id: ''},
        procurementOptions: []
      }
    },
    mounted: function () {
      // 页面加载后直接被这个搜索触发加载页面初始化列表.为了防止其他地方又初始化一次,特此声明
      this.search()
    },
    methods: {
      search: function () { // 点击搜索
        bus.$emit(inventoryStatistics.search, Object.assign({}, this.searchData))
      },
      reset: function () {
        this.$refs['formSearch'].resetFields()
        this.searchData.product_id = ''
        this.searchData.product_standard_id = ''
        this.searchData.product_name = ''
        this.searchData.product_standard_name = ''
        this.search()
      }
    }
  }
</script>

<style scoped>
</style>
