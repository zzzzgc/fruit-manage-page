<template>
  <el-form :model="searchData" ref="formSearch" label-width="80px" class="form-search">
    <el-form-item label="商品ID" prop="id">
      <el-input v-model="searchData.id"></el-input>
    </el-form-item>
    <el-form-item label="商品名称" prop="name">
      <el-input v-model="searchData.name"></el-input>
    </el-form-item>
    <!--<el-form-item label="类型" prop="type">-->
      <!--<el-select v-model=searchData.type>-->
        <!--<el-option label="不限" value=""></el-option>-->
        <!--<el-option v-for="item in product.typeList" :key="item" :label="item" :value="item"></el-option>-->
      <!--</el-select>-->
    <!--</el-form-item>-->
    <el-form-item label="状态" prop="status">
      <el-select v-model=searchData.status>
        <el-option label="不限" value=""></el-option>
        <el-option v-for="item in product.status" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="开始时间" prop="startTime">
      <el-date-picker v-model="searchData.startTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" :editable=false placeholder="创建开始时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间" prop="endTime">
      <el-date-picker v-model="searchData.endTime" type="datetime" :editable=false placeholder="创建结束时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item class="search-action">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import bus, { product } from '../../common/bus.js'
import { dateFmt } from '../../common/utils.js'
// import { PRODUCT_TYPE_LIST } from '../../store/action-types'
import { mapState } from 'vuex'
// import { mapState, mapActions } from 'vuex'

// import { createNamespacedHelpers } from 'vuex'
// const { mapState, mapActions } = createNamespacedHelpers('types')

export default {
  name: 'product-search',
  created: function () {
  },
  data: function () {
    return {
      searchData: {id: '', name: '', status: '', startTime: '', endTime: ''}
    }
  },
  mounted: function () {
    this.search()
//    this.getTypes()
  },
//  不使用命名空间
  computed: mapState([
    'product'
  ]),
//  使用命名空间
//  computed: mapState({
//    types: state => state.types.types
//  }),
  methods: {
    search: function () { // 点击搜索
//      if(this.searchData.id === null) {
//       delete this.searchData.id
//      }
      bus.$emit(product.search, Object.assign({}, this.searchData, {startTime: dateFmt(this.searchData.startTime), endTime: dateFmt(this.searchData.endTime)}))
    },
    reset: function () { // 点击重置
      this.$refs['formSearch'].resetFields()
      this.search()
    }
//    ...mapActions({
//      getTypes: PRODUCT_TYPE_LIST
//    })
  }
}
</script>

<style scoped>
</style>
