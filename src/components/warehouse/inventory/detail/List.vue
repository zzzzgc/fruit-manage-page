<template>
  <div class="table-list">
    <div class="action" style="color:#606266;margin-left:20px;">
      <span style="text-align: left;width:300px;display:block;margin-bottom: 10px;">盘点单日期：{{this.$route.query.order_cycle_date}}</span>
      <el-upload style="display:inline-block;margin-left:10px;"
        class="upload-demo"
        :action="_uploadFilePath"
        :on-change="isShowDialogExport"
                 :show-file-list="false"
        :file-list="fileList3">
        <el-button size="small" type="primary">导入盘点单</el-button>
      </el-upload> <span style="color:#999;font-size:14px;margin-left:20px;">商品名、规格名、规格编码、重量(斤)、库存单价、	库存总额、盘点人、盘点数量、备注</span>
    </div>
    <el-table :data="tableData" @selection-change="selectChange" :default-sort="putDetailInfo" @sort-change="sortChange"
              highlight-current-row style="width: 100%">
      <el-table-column fixed prop="product_name" label="商品名" min-width="70"></el-table-column>
      <el-table-column fixed prop="product_standard_name" label="规格名" min-width="70"></el-table-column>
      <el-table-column prop="product_standard_id" label="规格编号" min-width="70"></el-table-column>
      <el-table-column prop="product_weight" label="重量（斤）" min-width="70"></el-table-column>
      <el-table-column prop="inventory_price" label="库存单价" min-width="100"></el-table-column>
      <el-table-column sortable prop="inventory_num" label="库存数量" min-width="50"></el-table-column>
      <el-table-column sortable prop="inventory_total_price" label="库存总额" min-width="50"></el-table-column>
      <el-table-column sortable prop="user_name" label="盘点人" min-width="50"></el-table-column>
      <el-table-column sortable prop="check_inventory_num" label="盘点数量" min-width="50"></el-table-column>
      <el-table-column sortable prop="inventory_remark" label="备注" min-width="90"></el-table-column>
      <el-table-column fixed="right" label="操作" width="50">
        <template slot-scope="scope">
          <el-button type="text" size="small" class="delete" @click.native="edit(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="pageInfo.totalRec" class="table-pager">
    </el-pagination>
    <component :is="editCompName" :showDialog.sync="showEdit" :editRowId="editRowId" :putId="putId"></component>
  </div>
</template>

<script>
  // import Vue from 'vue'
  import bus, {warehouseInventoryDetail} from '../../../../common/bus.js'
  import {localStorageKeys} from '../../../../common/const.js'
  // import axios from 'axios'
  // Vue.prototype.$ajax = axios
  export default {
    name: 'checkInventoryDetail',
    components: {
      inventoryDetail: resolve => {
        require(['./AddOrEdit'], resolve)
      }
    },
    watch: {
      '$route': function (to, from) {
        // 对路由变化作出响应...
        this.getData()
      }
    },
    created: function () {
      bus.$on(warehouseInventoryDetail.search, (searchData) => { // 监听外部查询数据事件
        console.log('mounted getData')
        this.search(searchData)
      })
      bus.$on(warehouseInventoryDetail.showAddOrEdit, () => { // 监听数据更改后的列表刷新（刷新当前页）
        this.getData()
        this.successMsg('修改成功!')
      })
      bus.$on(warehouseInventoryDetail.refreshListForAdd, () => { // 监听添加数据之后列表更新并提示成功
        this.getData()
        this.successMsg('添加成功!')
      })
    },
    mounted: function () {
      console.log('mounted getData')
      this.getData()
    },
    data: function () {
      let pageSize = localStorage.getItem(localStorageKeys.productPageSize)
      return {
        editCompName: '', // 用于动态加载编辑组件
        showEdit: false, // 是否展示编辑弹窗
        editRowId: null, // 编辑的记录ID,
        putId: null,
        pPlanDate: '',
        tableData: [],
        selectIds: [],
        searchData: {},
        pageInfo: {
          pageNum: 1,
          totalRec: 0,
          pageSize: pageSize == null ? 10 : parseInt(pageSize)
        },
        putDetailInfo: {prop: 'cid.inventory_num', order: 'descending'},
        waitStatisticsOrderTotal: '',
        fileList3: []
      }
    },
    methods: {
      search: function (data) { // 点击搜索时执行
        console.log('start')
        this.resetPageInfo()
        this.searchData = data
        this.getData()
        console.log('end')
      },
      successMsg: function (msg) {
        this.$message({
          message: msg,
          type: 'success'
        })
      },
      warningMsg: function (msg) {
        this.$message({
          message: msg,
          type: 'warning'
        })
      },
      isShowDialogExport: function (file, fileList) {
        if (typeof (file.response) !== 'undefined') {
          this.$http.post('manage/warehouse/inventory/detail/importExcelInfo', {'fileName': file.response, 'checkInventoryId': this.$route.query.id, 'order_cycle_date': this.$route.query.order_cycle_date}).then((response) => {
            this.getData()
            this.successMsg('导入成功!')
          })
        }
      },
      edit: function (row) { // 编辑某条记录
        this.editCompName = 'inventoryDetail'
        this.editRowId = row.id
        this.showEdit = true
      },
      resetPageInfo: function () { // 重置分页参数
        this.pageInfo.totalRec = 0
        this.pageInfo.pageNum = 1
      },
      getData: function () { // 获取服务器数据
        console.log('成功更新信息')
        this.searchData.order_cycle_date = this.$route.query.order_cycle_date
        this.searchData.check_inventory_id = this.$route.query.id
        this.$http.post('/manage/warehouse/inventory/detail/getAllInfo', Object.assign({}, this.searchData, this.pageInfo, this.putDetailInfo)).then((response) => {
          this.pageInfo.totalRec = response.data.totalRow
          this.tableData = response.data.list
        })
      },
      handleSizeChange: function (val) { // 每页条数改变时重新加载记录
        this.pageInfo.pageSize = val
        localStorage.setItem(localStorageKeys.productPageSize, val)
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
        if (prop === this.putDetailInfo.prop && order === this.putDetailInfo.order) {
          return
        }
        this.putDetailInfo.prop = prop
        this.putDetailInfo.order = order
        this.resetPageInfo()
        this.getData()
      },
      handleClose (done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      }
    }
  }
</script>

<style scoped>

</style>
