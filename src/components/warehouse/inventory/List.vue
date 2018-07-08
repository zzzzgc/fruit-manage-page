<template>
  <div class="table-list">
    <div class="action">
      <el-button type="primary" size="small" @click="ShowAddCheckInventory">新增盘点单</el-button>
    </div>
    <!-- 入库日期 入库单编号 入库商品总数 入库规格总数 入库总额 入库类型 参考 操作 -->
    <el-table :data="tableData" @row-dblclick="showCheckInventoryDetail" @selection-change="selectChange" :default-sort="warehouseInventory" @sort-change="sortChange"
              highlight-current-row style="width: 100%">
      <!--<el-table-column fixed type="index" label="序号" width="70"></el-table-column>-->
      <el-table-column fixed prop="order_cycle_date" label="盘点日期" min-width="70"></el-table-column>
      <el-table-column fixed prop="id" label="盘点单编号" min-width="70"></el-table-column>
      <el-table-column prop="product_count" label="盘点商品总数" min-width="70"></el-table-column>
      <el-table-column prop="product_total_price" label="盘点商品总额" min-width="70"></el-table-column>
      <!--<el-table-column prop="warehouse_name" label="仓库" min-width="70"></el-table-column>-->
      <el-table-column prop="check_inventory_time" label="修改时间" min-width="70"></el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small" class="delete" @click.navite="delCheckInventory(scope.row.id)">删除</el-button>
          <!--<el-button type="text" size="small" @click.navite="showCheckInventoryDetail(scope.row)">查看详情</el-button>-->
          <el-button type="text" size="small" @click.navite="exportCheckInventory(scope.row)">导出</el-button>
          <el-upload style="display:inline-block;margin-left:10px;"
                     class="upload-demo"
                     :action="_uploadFilePath"
                     :on-change="isShowDialogExport"
                     :show-file-list="false"
                     :file-list="fileList3">
            <el-button size="small" type="text" @click.navite="getRowId(scope.row)">导入</el-button>
          </el-upload>
          <!--<el-button type="text" size="small" >导入</el-button>-->
          <!--<el-button @click="setStatus(scope.row.status === 1 ? 0 : 1, [scope.row.id])" type="text" size="small" :class="scope.row.status === 1 ? 'disable' : 'enable'">{{scope.row.status === 1 ? '禁用' : '启用'}}</el-button>-->
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
    <el-dialog
      :visible.sync="showAddDialog"
      width="30%"
      :before-close="handleClose" style="text-align: left;">

      <el-form>
        <el-form-item label="盘点时间">
          <el-date-picker size="small" value-format="yyyy-MM-dd" v-model="newPlanInfo.pPlanDate" type="date" placeholder="选择日期和时间">
          </el-date-picker>
        </el-form-item>
        盘点人 &nbsp;&nbsp;{{this.newPlanInfo.pPlanName}}
      </el-form>


      <!--<span style="display:block;margin-bottom: 10px;">盘点时间：{{pPlanDate}}</span>-->
      <!--<el-date-picker size="small" v-model="newPlanInfo.pPlanDate" type="datetime" placeholder="选择日期和时间"></el-date-picker>-->
      <!--&lt;!&ndash;<span style="display:block;margin-bottom: 10px;">盘点时间：{{pPlanDate}}</span>&ndash;&gt;-->
      <!--盘点人：{{this.newPlanInfo.pPlanName}}-->

      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCheckInventory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import bus, {warehouseInventory} from '../../../common/bus.js'
  import {localStorageKeys} from '../../../common/const.js'

  export default {
    name: 'warehouse-put',
    components: {},
    created: function () {
      bus.$on(warehouseInventory.search, (searchData) => { // 监听外部查询数据事件
        this.search(searchData)
      })
    },
    mounted: function () {
      this.getData()
    },
    data: function () {
      let pageSize = localStorage.getItem(localStorageKeys.productPageSize)
      return {
        showAddDialog: false, // 是否展示编辑弹窗.
        newPlanInfo: {
          pPlanDate: '',
          pPlanName: ''
        },
        tableData: [],
        selectIds: [],
        searchData: {},
        rowId: 0,
        fileList3: [],
        putWarehouseType: true,
        pageInfo: {
          pageNum: 1,
          totalRec: 0,
          pageSize: pageSize == null ? 10 : parseInt(pageSize)
        },
        warehouseInventory: {prop: 'ci.create_time', order: 'descending'},
        order_cycle_date: ''
      }
    },
    methods: {
      search: function (data) { // 点击搜索时执行
        this.resetPageInfo()
        this.searchData = data
        this.getData()
      },
      delCheckInventory: function (checkInventoryId) { // 删除入库记录.
        this.$confirm('是否要删除盘点单编号为' + checkInventoryId + '这条记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          let _this = this
          this.$http.post('/manage/warehouse/inventory/delCheckInventory', {'checkInventoryId': checkInventoryId}).then((response) => {
            _this.getData()
            _this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {
        })
      },
      ShowAddCheckInventory: function () {
        this.showAddDialog = true
        let date = new Date()
        let hours = date.getHours()
        let fullDate = ''
        let year = date.getFullYear()
        let month = date.getMonth()
        let today = date.getDate()
        fullDate = year + '-' + (month + 1) + '-' + today + ' ' + hours + ':00'
        this.newPlanInfo.pPlanDate = fullDate
        this.getInventory()
      },
      getInventory: function () {
        this.$http.post('/manage/warehouse/inventory/getInventory').then((response) => {
          console.log(response)
          this.newPlanInfo.pPlanName = response.data[0]
        })
      },
      ShowAddWarehouse: function () { // 显示入库的提醒框
        let date = new Date()
        let hours = date.getHours()
        let fullDate = ''
        let year = date.getFullYear()
        let month = date.getMonth()
        let today = date.getDate()
        fullDate = year + '-' + (month + 1) + '-' + today + ' ' + hours + ':00'
        this.newPlanInfo.pPlanDate = fullDate
        this.showAddDialog = true
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
      addCheckInventory: function () {
        this.$http.post('/manage/warehouse/inventory/addCheckInventory', this.newPlanInfo).then((response) => {
          this.showAddDialog = false
          this.getData()
          this.successMsg('新建成功!')
        }).catch((response) => {
          this.showAddDialog = false
        })
      },
      exportCheckInventory: function (row) { // 入库单导出
        this.$http.post('/manage/warehouse/inventory/exportCheckInventory', {'checkInventoryId': row.id}).then((response) => {
          location.href = this._downloadFilePath + response.data[0]
        })
      },
      showCheckInventoryDetail: function (row) {
        this.$router.push({path: '/manage/warehouse/inventory/detail', query: {'id': row.id, 'order_cycle_date': row.order_cycle_date}})
      },
      resetPageInfo: function () { // 重置分页参数
        this.pageInfo.totalRec = 0
        this.pageInfo.pageNum = 1
      },
      getData: function () { // 获取服务器数据
        this.$http.post('/manage/warehouse/inventory/getAllInfo', Object.assign({}, this.searchData, this.pageInfo, this.warehouseInventory)).then((response) => {
          console.log('getData')
          console.log(response)
          this.pageInfo.totalRec = response.data.totalRow
          this.tableData = response.data.list
        })
      },
      handleSizeChange: function (val) { // 每页条数改变时重新加载记录
        this.pageInfo.pageSize = val
        localStorage.setItem(localStorageKeys.productPageSize, val)
        this.getData()
      },
      getRowId: function (row) {
        console.log(row)
        if (row != null) {
          this.rowId = row.id
          this.order_cycle_date = row.order_cycle_date
        }
      },
      isShowDialogExport: function (file, fileList) {
        if (typeof (file.response) !== 'undefined') {
          this.$http.post('manage/warehouse/inventory/detail/importExcelInfo', {'fileName': file.response, 'checkInventoryId': this.rowId, 'order_cycle_date': this.order_cycle_date}).then((response) => {
            this.getData()
            this.successMsg('导入成功!')
          })
        }
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
        if (prop === this.warehouseInventory.prop && order === this.warehouseInventory.order) {
          return
        }
        this.warehouseInventory.prop = prop
        this.warehouseInventory.order = order
        this.resetPageInfo()
        this.getData()
      },
      handleClose: function (done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {
          })
      }
    }
  }
</script>

<style scoped>

</style>
