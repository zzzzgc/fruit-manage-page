<template>
  <el-form :model="searchData" ref="formSearch" label-width="80px" class="form-search">
    <div>
      <el-form-item label="商品名称:" prop="product_name">
        <el-input v-model="searchData.product_name" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品编码" prop="product_id">
        <el-input v-model="searchData.product_id" placeholder="请输入商品编码"></el-input>
      </el-form-item>
      <el-form-item label="规格名称" prop="product_standard_name">
        <el-input v-model="searchData.product_standard_name" placeholder="请输入规格名称"></el-input>
      </el-form-item>
      <el-form-item label="规格编码" prop="product_standard_id">
        <el-input v-model="searchData.product_standard_id" placeholder="请输入规格编码"></el-input>
      </el-form-item>
    </div>
    <el-form-item label="采购姓名:" prop="procurement_name">
      <el-input v-model="searchData.user_name" placeholder="请输入采购人姓名"></el-input>
    </el-form-item>
    <el-form-item label="采购电话" prop="procurement_phone">
      <el-input v-model="searchData.user_phone" placeholder="请输入采购电话"></el-input>
    </el-form-item>
    <el-form-item label="采购人ID" prop="procurement_id">
      <el-input v-model="searchData.user_id" placeholder="请输入采购人编码"></el-input>
    </el-form-item>
    <el-form-item class="search-action">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import bus, {procurementDetail} from '../../../../common/bus.js'
  export default {
    components: {},
    name: 'procurement-search',
    created: function () {
    },
    data: function () {
      return {
        searchData: {user_name: '', user_phone: '', user_id: '', product_name: '', product_id: '', product_standard_name: '', product_standard_id: ''}
      }
    },
    mounted: function () {
      // 页面加载后直接被这个搜索触发加载页面初始化列表.为了防止其他地方又初始化一次,特此声明
      this.search()
    },
    methods: {
      search: function () { // 点击搜索
        bus.$emit(procurementDetail.search, Object.assign({}, this.searchData))
      },
      reset: function () { // 点击重置
        this.searchData.create_time = []
        this.$refs['formSearch'].resetFields()
        this.searchData = {}
        this.search()
      }
    }
  }
</script>

<style scoped>
</style>
