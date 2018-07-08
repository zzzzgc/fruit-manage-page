<template>
  <el-form :model="searchData" ref="formSearch" label-width="80px" class="form-search">
    <el-form-item label="用户名称" prop="userName">
      <el-input v-model="searchData.userName" placeholder="请输入用户名称"></el-input>
    </el-form-item>
    <el-form-item class="search-action">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import bus, {user} from '../../../common/bus.js'

export default {
  name: 'user-search',
  data: function () {
    return {
      searchData: {userName: ''},
      loading: false
    }
  },
  mounted: function () {
    this.search()
  },
  methods: {
    search: function () { // 点击搜索
      bus.$emit(user.search, Object.assign({}, this.searchData))
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
