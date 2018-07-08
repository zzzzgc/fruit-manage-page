<template>
  <el-form :model="searchData" ref="formSearch" label-width="100px" class="form-search">
    <el-form-item label="分类标签:" prop="name">
      <el-input v-model="searchData.name" placeholder="请输入分类标签名称"></el-input>
    </el-form-item>
    <el-form-item class="search-action">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import bus, {typeGroup} from '../../common/bus.js'

export default {
  name: 'typeGroup-search',
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      searchData: {name: this.name}
    }
  },
  mounted: function () {
    this.search()
  },
  methods: {
    search: function () {
      bus.$emit(typeGroup.search, Object.assign({}, this.searchData))
    },
    reset: function () {
      this.$refs['formSearch'].resetFields()
      this.search()
    }
  }
}
</script>

<style scoped>

</style>
