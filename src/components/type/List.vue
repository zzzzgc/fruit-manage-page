<template>
  <div class="table-list">
    <div class="action">
      <el-button type="primary" size="small" @click="add">添加</el-button>
      <el-button type="success" size="small" @click="setStatus(1)">批量启用</el-button>
      <el-button size="small" @click="setStatus(0)">批量禁用</el-button>
    </div>
    <el-table :data="tableData" @row-dblclick="edit" @selection-change="selectChange" :default-sort="orderInfo" @sort-change="sortChange" border highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="70"></el-table-column>
      <el-table-column prop="group_id" label="分类标签" min-width="100">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.showEdit !== 1">{{scope.row.type_group_name}}</el-tag>
          <el-select v-model="scope.row.group_id" v-show="scope.row.showEdit === 1" filterable placeholder="请选择" size="small">
            <el-option v-for="item in typeGroups" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="分类名称"  min-width="100">
        <template slot-scope="scope">
          <span v-show="scope.row.showEdit !== 1">{{scope.row.name}}</span>
          <el-input v-show="scope.row.showEdit === 1" v-model="scope.row.name" size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="type_product_count" label="商品总数"  width="80"></el-table-column>
      <el-table-column prop="name" label="权重"  width="80">
        <template slot-scope="scope">
          <span v-show="scope.row.showEdit !== 1">{{scope.row.sort}}</span>
          <el-input v-show="scope.row.showEdit === 1" v-model="scope.row.sort" size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column sortable prop="update_time" label="更新日期" width="180"></el-table-column>
      <el-table-column sortable prop="create_time" label="创建日期" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" width="110">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.showEdit !== 1" :type="scope.row.status === 0 ? 'gray' : 'success'" close-transition>{{scope.row.status === 0 ? '禁用' : '启用'}}</el-tag>
          <el-select v-model="scope.row.status" v-show="scope.row.showEdit === 1" size="small">
            <el-option label="禁用" :value=0></el-option>
            <el-option label="启用" :value=1></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <div v-show="scope.row.showEdit !== 1">
            <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="setStatus(scope.row.status === 0 ? 1 : 0, [scope.row.id])" type="text" size="small" :class="scope.row.status === 0 ? 'enable' : 'disable'">{{scope.row.status === 0 ? '启用' : '禁用'}}</el-button>
          </div>
          <div v-show="scope.row.showEdit === 1">
            <el-button @click="saveEdit(scope.row)" type="primary" size="small">保存</el-button>
            <el-button @click="getData" size="small">取消</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.totalRec" class="table-pager">
    </el-pagination>
    <component :is="editCompName" :showDialog.sync="showEdit" :editRowId="editRowId"></component>
  </div>
</template>

<script>
import bus, {type} from '../../common/bus.js'
import {localStorageKeys} from '../../common/const.js'

export default {
  components: {
    // tableForm: resolve => require(['./AddOrEdit'], resolve) // 必须用下面的方式加载，否则会出现组件加载完成后立即销毁（一闪而过）
    tableForm: resolve => {
      require(['./Add'], resolve)
    }
  },
  created: function () {
    bus.$on(type.search, (searchData) => { // 监听外部查询数据事件
      this.search(searchData)
    })
    bus.$on(type.refreshListForAdd, () => { // 监听数据添加后的列表刷新
      this.resetPageInfo()
      this.orderInfo.prop = 'sort'
      this.orderInfo.order = 'descending'
      this.getData()
    })
  },
  data: function () {
    let pageSize = localStorage.getItem(localStorageKeys.typePageSize)
    return {
      editCompName: '', // 用于动态加载编辑组件
      showEdit: false, // 是否展示编辑弹窗
      editRowId: null, // 编辑的记录ID
      pageInfo: {
        pageNum: 1,
        totalRec: 0,
        pageSize: pageSize == null ? 10 : parseInt(pageSize)
      },
      searchData: {
      },
      orderInfo: {prop: 'sort', order: 'descending'},
      tableData: [],
      selectIds: [],
      typeGroups: []
    }
  },
  mounted: function () {
    this.getTypeGroups()
  },
  methods: {
    getTypeGroups: function () {
      this.$http.post('/manage/typeGroup/getTypeGroups').then((response) => {
        this.typeGroups = response.data.list
      })
    },
    search: function (data) { // 点击搜索时执行
      this.resetPageInfo()
      this.searchData = data
      this.getData()
    },
    resetPageInfo: function () { // 重置分页参数
      this.pageInfo.totalRec = 0
      this.pageInfo.pageNum = 1
    },
    getData: function () { // 获取服务器数据
      this.$http.post('/manage/type/getData', Object.assign({}, this.searchData, this.pageInfo, this.orderInfo)).then((response) => {
        this.pageInfo.totalRec = response.data.totalRow
        this.tableData = response.data.list
      })
    },
    setStatus: function (status, selectIds) { // 请求服务器设置状态
      selectIds = selectIds || this.selectIds
      if (selectIds === null || selectIds.length === 0) {
        this.$message({type: 'warning', message: '选择一个分类进行更新状态'})
        return false
      }
      this.$http.post('/manage/type/changeStatus', {ids: selectIds, status: status}).then((response) => {
        this.getData()
      })
    },
    edit: function (row) { // 设置某条记录可编辑
      this.$set(row, 'showEdit', 1)
    },
    saveEdit: function (row) {
      if (row.name === '') {
        this.$message({type: 'warning', message: '请输入分类名字'})
        return false
      }
      if (row.sort === '') {
        this.$message({type: 'warning', message: '请输入权重'})
        return false
      }
      let editData = Object.assign({id: row.id, group_id: row.group_id, status: row.status, name: row.name, sort: row.sort})
      this.$http.post('/manage/type/save', editData).then((response) => {
        this.$message({type: 'success', message: '修改数据成功'})
        this.getData()
      })
    },
    add: function () { // 添加记录
//      bus.$emit(type.showAdd)
      this.editCompName = 'tableForm'
      this.showEdit = true
    },
    handleSizeChange: function (val) { // 每页条数改变时重新加载记录
      this.pageInfo.pageSize = val
      localStorage.setItem(localStorageKeys.typePageSize, val)
      this.getData()
    },
    handleCurrentChange: function (val) { // 页码改变时重新加载记录
      this.pageInfo.pageNum = val
      this.getData()
    },
    selectChange: function (selectRows) { // 每次选择行时，更新选择的记录ID
      this.selectIds.splice(0, this.selectIds.length) // 清空选择的id
      for (let i = 0; i < selectRows.length; i++) {
        this.selectIds.push(selectRows[i].id)
      }
    },
    sortChange: function ({column, prop, order}) { // 排序改变
      if (prop === this.orderInfo.prop && order === this.orderInfo.order) {
        return
      }
      this.orderInfo.prop = prop
      this.orderInfo.order = order
      this.resetPageInfo()
      this.getData()
    }
  }
}
</script>

<style scoped>
</style>
