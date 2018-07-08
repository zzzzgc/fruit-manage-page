<template>
  <el-form :model="searchData" ref="formSearch" label-width="80px" class="form-search">
    <el-form-item label="组标签" prop="groupKey">
      <el-input v-model="searchData.groupKey" placeholder="请输入组标签"></el-input>
    </el-form-item>
    <el-form-item label="组内标签" prop="key">
      <el-input v-model="searchData.key" placeholder="请输入组内标签"></el-input>
    </el-form-item>
    <el-form-item class="search-action">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import bus, {banner} from '../../common/bus.js'

export default {
  name: 'banner-search',
  data: function () {
    return {
      searchData: {groupKey: '', key: ''},
      loading: false
    }
  },
  mounted: function () {
    this.search()
  },
  methods: {
    search: function () { // 点击搜索
      bus.$emit(banner.search, Object.assign({}, this.searchData))
    },
    reset: function () { // 点击重置
      this.$refs['formSearch'].resetFields()
      this.search()
    }
  }
}
</script>

<style scoped>

</style>
