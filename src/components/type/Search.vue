<template>
  <el-form :model="searchData" ref="formSearch" label-width="100px" class="form-search">
    <el-form-item label="分类标签：" prop="group_id">
      <el-select v-model="searchData.group_id" filterable placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="item in typeGroups" :label="item.name" :value="item.id" :key="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="分类名称:" prop="name">
      <el-input v-model="searchData.name" placeholder="请输入分类名称"></el-input>
    </el-form-item>
    <el-form-item class="search-action">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import bus, {type} from '../../common/bus.js'

export default {
  name: 'type-search',
  data: function () {
    return {
      searchData: {group_id: '', name: ''},
      typeGroups: [],
      loading: false
    }
  },
  mounted: function () {
    this.getTypeGroups()
    this.search()
  },
  methods: {
    search: function () {
      bus.$emit(type.search, Object.assign({}, this.searchData))
    },
    getTypeGroups: function () {
      this.$http.post('/manage/typeGroup/getTypeGroups').then((response) => {
        this.typeGroups = response.data.list
      })
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
