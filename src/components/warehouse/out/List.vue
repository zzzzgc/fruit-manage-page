<template>
  <div class="table-list">
    <div class="action">
      <el-button type="primary" size="small" @click="on_off.showAddDialog = true">新增出库单</el-button>
    </div>
    <!-- 出库时间 出库编号 出库商品总数 出库总额 出库类型 仓库 操作 -->
    <el-table :data="tableData" @row-dblclick="showDetail" :default-sort="sortInfo" @sort-change="sortChange"
              highlight-current-row style="width: 100%">
      <!--<el-table :data="tableData" @selection-change="selectChange" :default-sort="sortInfo" @sort-change="sortChange"-->
      <!--highlight-current-row style="width: 100%">-->
      <!--<el-table-column fixed type="index" label="序号" width="70"></el-table-column>-->
      <el-table-column prop="order_cycle_date" label="出库日期" min-width="70"></el-table-column>
      <el-table-column prop="id" label="出库编号" min-width="70"></el-table-column>
      <el-table-column prop="out_num" label="出库商品总数" min-width="70"></el-table-column>
      <el-table-column prop="out_type_num" label="出库规格总数" min-width="70"></el-table-column>
      <el-table-column prop="out_total_price" label="出库总额" min-width="70"></el-table-column>
      <el-table-column prop="out_type" label="出库类型" min-width="50" :formatter="formatterOutType"></el-table-column>
      <el-table-column prop="warehouse_address" label="仓库" min-width="50"></el-table-column>
      <el-table-column sortable prop="out_time" label="修改时间" min-width="70"></el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="text" @click="deleteRow(scope.row)" size="small" class="delete">删除</el-button>
          <el-upload :show-file-list="false" :action="_uploadFilePath" :on-change="handleChange" :before-upload="uploadBefore" style="display: inline-block;">
            <el-button type="text" @click="selectWarehouseOutId(scope.row)" size="small">导入</el-button>
            <!--<i class="el-icon-upload">导入</i>-->
          </el-upload>
          <el-button type="text" @click="exportExcel(scope.row)" size="small">导出</el-button>
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

    <!--添加提示框-->
    <el-dialog :visible.sync="on_off.showAddDialog">
      <el-form>
        <el-form-item label="出库时间">
          <el-date-picker size="small"  value-format="yyyy-MM-dd" v-model="addInfo.create_Time" type="date" placeholder="选择日期和时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出库类型">
          <!--0采购出库 1招待出库-->
          <el-radio v-model="addInfo.out_type" label="0">采购出库</el-radio>
          <el-radio v-model="addInfo.out_type" label="1">招待出库</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRow">确 定</el-button>
        <el-button @click="on_off.showAddDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import bus, {warehouseOut} from '../../../common/bus.js'
  import {localStorageKeys} from '../../../common/const.js'
  // import {dateFmt} from '../../../common/utils.js'

  export default {
    name: 'procurement',
    components: {},
    created: function () {
      bus.$on(warehouseOut.search, (searchData) => { // 监听外部查询数据事件
        this.search(searchData)
      })
    },
    mounted: function () {
      this.getData()
    },
    data: function () {
      let pageSize = localStorage.getItem(localStorageKeys.productPageSize)
      return {
        on_off: {
          showAddDialog: false,
          showImportDialog: false
        },
        addInfo: {
          create_Time: '',
          out_type: ''
        },
        importInfo: {
          warehouseOutId: ''
        },
        tableData: [],
        searchData: {},
        updateInfo: {
          fileName: ''
        },
        pageInfo: {
          pageNum: 1,
          totalRec: 0,
          pageSize: pageSize == null ? 10 : parseInt(pageSize)
        },
        sortInfo: {prop: 'ow.order_cycle_date', order: 'descending'}
      }
    },
    methods: {
      search: function (searchData) { // 点击搜索时执行
        this.resetPageInfo()
        this.searchData = searchData
        this.getData()
      },
      addRow: function () {
        // this.addInfo.create_Time = dateFmt(this.addInfo.create_Time)
        this.$http.post('/manage/warehouse/out/save', this.addInfo).then(
          (response) => {
            this.successMsg('添加成功')
            this.getData()
            this.on_off.showAddDialog = false
          }
        )
      },
      deleteRow: function (row) {
        this.$confirm('是否要删除单号为' + row.id + '这条记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$http.post('/manage/warehouse/out/delete', {'id': row.id}).then(
            (response) => {
              this.getData()
              this.successMsg('删除成功')
            }
          )
        }).catch(() => {
        })
      },
      showDetail: function (row) {  // 显示详细订单
        console.log(row.id)
        console.log(row.out_type)

        // 0采购出库 1款待出库
        switch (row.out_type) {
          case 0:
            this.$router.push({path: '/manage/warehouse/out/business', query: {'out_id': row.id, 'out_time': row.out_time}})
            break
          case 1:
            this.$router.push({path: '/manage/warehouse/out/entertain', query: {'out_id': row.id, 'out_time': row.out_time}})
            break
          default:
        }
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
      handleChange: function (file, fileList) {
        this.importExcel(file, fileList)
      },
      importExcel: function (file, fileList) { // 导入
        if (typeof (file.response) !== 'undefined') {
          this.$http.post('/manage/warehouse/out/importExcelOutWarehouse', {'fileName': file.response, 'out_id': this.importInfo.warehouseOutId}).then((response) => {
            this.getData()
            this.successMsg('导入成功!')
          })
        }
      },
      uploadBefore: function (file) { // 上传前校验数据
        console.log(file)
        const isRightType = file.type.indexOf('application/vnd') === 0
        const isRightSize = file.size / 1024 / 1024 < 6
        if (!isRightType) {
          this.$message.error('上传文件必须为xlsx格式!')
        }
        if (!isRightSize) {
          this.$message.error('上传图片大小不能超过 6MB!')
        }
        return isRightSize && isRightType
      },
      selectWarehouseOutId: function (row) {
        console.log('selectWarehouseOutId')
        console.log(row)
        this.importInfo.warehouseOutId = row.id
      },
      exportExcel: function (row) { // 导出
        // location.href = this._downloadExcelFilePath + 'exportExcelOutWarehouse?id=' + row.id
        this.$http.post('/manage/warehouse/out/exportExcelOutWarehouse', {'id': row.id}).then(
          (response) => {
            if (response.status === 200) {
              console.log(response)
              location.href = this._downloadFilePath + response.data.fileName
            }
          }
        )
      },
      resetPageInfo: function () { // 重置分页参数
        this.pageInfo.totalRec = 0
        this.pageInfo.pageNum = 1
      },
      getData: function () { // 获取服务器数据
        this.$http.post('/manage/warehouse/out/getData', Object.assign({}, this.searchData, this.pageInfo, this.sortInfo)).then((response) => {
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
      handleCurrentChange: function (val) { // 页码改变时重新加载记录
        this.pageInfo.pageNum = val
        this.getData()
      },
      // selectChange: function (selectRows) { // 每次选择行时，更新选择的记录ID
      //   this.selectIds.splice(0, this.selectIds.length) // 清空选择的id
      //   for (let i = 0; i < selectRows.length; i++) {
      //     this.selectIds.push(selectRows[i].id)
      //   }
      // },
      sortChange: function ({column, prop, order}) { // 排序改变
        if (prop === this.sortInfo.prop && order === this.sortInfo.order) {
          return
        }
        this.sortInfo.prop = prop
        this.sortInfo.order = order
        this.resetPageInfo()
        this.getData()
      },
      formatterOutType: function (row, column) {
        switch (row.out_type) {
          case 0 :
            return '销售出库'
          case 1 :
            return '款待出库'
          default:
        }
      }
      // handleClose: function (done) {
      //   this.$confirm('确认关闭？')
      //     .then(_ => {
      //       done()
      //     })
      //     .catch(_ => {
      //     })
      // }
    }
  }
</script>

<style scoped>

</style>
