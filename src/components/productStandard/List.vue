<template>
  <div class="table-list">
    <div class="action">
      <i @click="visibleList(false)" class="el-icon-circle-close-outline"></i>
      <el-button type="danger" size="small" @click="setStatus(-1)">批量删除</el-button>
      <!--<el-button size="small" @click="setStatus(0)">批量下架</el-button>-->
      <!--<el-button type="success" size="small" @click="setStatus(1)">批量上架</el-button>-->
      <el-button type="primary" size="small" @click="add">添加</el-button>
    </div>
    <el-table :data="tableData" @row-dblclick="edit" @selection-change="selectChange" :default-sort="orderInfo"
              @sort-change="sortChange" highlight-current-row>
      <el-table-column type="selection" width="55"></el-table-column>
      <!--<el-table-column type="index" label="序号"></el-table-column>-->
      <el-table-column fixed prop="id" label="ID" min-width="30"></el-table-column>
      <el-table-column fixed prop="name" label="规格"></el-table-column>
      <el-table-column fixed prop="original_price" label="原价" min-width="50"></el-table-column>
      <el-table-column fixed prop="sell_price" label="售价" min-width="50"></el-table-column>
      <el-table-column prop="weight_price" label="现售称重单价"></el-table-column>
      <el-table-column prop="shipping_fee" label="基础运费"></el-table-column>
      <el-table-column prop="purchase_quantity_min" label="最小采购数量"></el-table-column>
      <el-table-column prop="purchase_quantity_max" label="最大采购数量"></el-table-column>
      <el-table-column prop="buy_start_time" label="购买开始时间"></el-table-column>
      <el-table-column prop="buy_end_time" label="购买结束时间"></el-table-column>
      <el-table-column fixed="right" prop="is_default" label="默认规格" :formatter="formatterIsDefault"></el-table-column>
      <el-table-column fixed="right" prop="status" label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value=1 :inactive-value=0 @change="val => changeStatus(val, scope.row)"></el-switch>
          <!--{{scope.row.status === 1 ? '启用' :  '禁用'}}-->
        <!--<el-tag :type="scope.row.status === 1 ? 'success' : 'gray'" close-transition>{{scope.row.status === 1 ? '启用' :  '禁用'}}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <!--<el-button @click="setStatus(scope.row.status === 1 ? 0 : 1, [scope.row.id])" type="text" size="small" :class="scope.row.status === 1 ? 'disable' : 'enable'">{{scope.row.status === 1 ? '禁用' : '启用'}}</el-button>-->
          <el-button @click="setStatus(-1, [scope.row.id])" type="text" size="small" class="delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <component :is="editCompName" :showDialog.sync="showEdit" :editRowId="editRowId" :productId="searchData.productId"></component>
  </div>
</template>

<script>
import bus, { productStandard, product } from '../../common/bus.js'

export default {
  name: 'productStandardList',
  components: {
    // tableForm: resolve => require(['./AddOrEdit'], resolve) // 必须用下面的方式加载，否则会出现组件加载完成后立即销毁（一闪而过）
    addEditForm: resolve => {
      require(['./AddOrEdit'], resolve)
    }
  },
  created: function () {
    bus.$on(productStandard.search, (productId) => { // 监听外部查询数据事件
      this.searchData = {productId: productId}
      this.getData()
      this.visibleList(true)
    })
    bus.$on(productStandard.edit, () => { // 监听数据更改后的列表刷新（刷新当前页）
      this.getData()
    })
    bus.$on(productStandard.add, () => { // 监听数据添加后的列表刷新
      this.orderInfo.prop = 'create_time'
      this.orderInfo.order = 'ascending'
      this.getData()
    })
  },
  data: function () {
    return {
      editCompName: '', // 用于动态加载编辑组件
      showEdit: false, // 是否展示编辑弹窗
      editRowId: null, // 编辑的记录ID
      searchData: {},
      orderInfo: {prop: 'create_time', order: 'ascending'},
      tableData: [],
      selectIds: []
    }
  },
  methods: {
    getData: function () { // 获取服务器数据
      this.$http.post('/productStandard/getData', Object.assign({}, this.searchData, this.orderInfo)).then((response) => {
        this.tableData = response.data
      })
    },
    setStatus: function (status, selectIds) { // 请求服务器设置状态
      selectIds = selectIds || this.selectIds
      if (selectIds.length === 0) {
        this.$alert('未选择记录', '提示', {confirmButtonText: '确定', closeOnClickModal: true, type: 'warning'})
        return
      }
      if (status === -1) { // 如果是删除，则提示
        this.$confirm('确认要删除数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._setStatus(status, selectIds)
        }).catch(() => { })
      } else {
        this._setStatus(status, selectIds)
      }
    },
    _setStatus: function (status, selectIds) {
      this.$http.post('/productStandard/changeStatus', {productId: this.searchData.productId, ids: selectIds, status: status}).then((response) => {
        this.getData()
        bus.$emit(product.edit, null) // 刷新商品列表
      }).catch((e) => { // 异常后重新获取数据，正确显示状态
        this.getData()
      })
    },
    edit: function (row) { // 编辑某条记录
      this.editCompName = 'addEditForm'
      this.editRowId = row.id
      this.showEdit = true
    },
    add: function () { // 添加记录
      this.editCompName = 'addEditForm'
      this.editRowId = null
      this.showEdit = true
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
      this.getData()
    },
    visibleList: function (visible) {
      this.$emit('update:standard', visible)
    },
    changeStatus: function (enable, row) {
      this._setStatus(enable, row.id)
    },
    formatterIsDefault: function (row, column) {
      return row.is_default === 1 ? '是' : '否'
    }
  }
}
</script>

<style scoped lang="scss">
  .table-list {
    position: fixed;
    background: white;
    top:0;
    overflow-y: auto;
    height: 100%;
    width: 70%;
    left: 30%;
    z-index: 5;
    /* border-left: 1px solid #d7dee7; */
    box-shadow: -1px 0px 10px 0 rgba(0,0,0,0.3);
    .action {
      i {
        font-size: 32px;
        color: #a2a2a2;
        cursor: pointer;
      }
      button {
        float: right;
        margin: auto 10px;
      }
    }
  }
</style>
