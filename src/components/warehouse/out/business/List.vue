<template>
  <div class="table-list">
    <div class="action">
      <el-upload :show-file-list="false" :action="_uploadFilePath" :on-change="handleChange" :before-upload="uploadBefore" style="display: inline-block;">
        <el-button type="primary" @click="selectWarehouseOutId(scope.row)" size="small">导入商家出库单</el-button>
      </el-upload>
    </div>

    <el-table :data="tableData" :default-sort="sortInfo" @sort-change="sortChange"
              highlight-current-row style="width: 100%">
      <!--<el-table-column fixed type="index" label="序号" width="70"></el-table-column>-->
      <el-table-column prop="product_name" label="商品名" min-width="70"></el-table-column>
      <el-table-column prop="product_standard_name" label="规格名" min-width="50"></el-table-column>
      <el-table-column prop="product_standard_id" label="出库编号" min-width="50"></el-table-column>
      <el-table-column prop="product_weight" label="重量(斤)" min-width="50"></el-table-column>
      <el-table-column prop="out_price" label="出库单价" min-width="50"></el-table-column>
      <el-table-column prop="out_num" label="出库数量" min-width="50"></el-table-column>
      <el-table-column prop="out_total_price" label="出库总额" min-width="50"></el-table-column>
      <el-table-column prop="user_name" label="客户姓名" min-width="50"></el-table-column>
      <el-table-column prop="user_id" label="客户编号" min-width="50"></el-table-column>
      <el-table-column prop="order_num" label="订单数量" min-width="50"></el-table-column>
      <el-table-column prop="order_time" label="订单时间" min-width="120"></el-table-column>
      <el-table-column prop="out_remark" label="商品备注" min-width="50"></el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)" size="small" class="delete">编辑</el-button>
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

    <!--编辑提示框-->
    <!--<el-dialog :visible.sync="on_off.showEditDialog">-->
    <!--<el-form label-width="80px" label-position="right">-->
    <!--<el-row :gutter="20">-->
    <!--<el-col :span="8">-->
    <!--<el-form-item label="客户名">-->
    <!--<el-input v-model="warehouseOutInfo.user_name" size = "mini" placeholder="请输入"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item label="客户编号">-->
    <!--{{warehouseOutInfo.user_id}}-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item label="订单数量">-->
    <!--{{warehouseOutInfo.order_num}}-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item label="订单时间">-->
    <!--{{warehouseOutInfo.ordre_time}}-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item label="商品名">-->
    <!--{{warehouseOutInfo.product_name}}-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item label="规格名">-->
    <!--{{warehouseOutInfo.product_standard_name}}-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item label="规格编号">-->
    <!--{{warehouseOutInfo.product_standard_id}}-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item label="重量(斤)">-->
    <!--<el-input v-model="warehouseOutInfo.product_weight" size = "mini" placeholder="请输入"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item label="出库数量">-->
    <!--<el-input v-model="warehouseOutInfo.out_num" size = "mini" placeholder="请输入"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item label="出库单价">-->
    <!--{{warehouseOutInfo.out_price}}-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item label="出库总额">-->
    <!--{{warehouseOutInfo.out_total_price}}-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item label="商品备注">-->
    <!--{{warehouseOutInfo.out_remark}}-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--</el-row>-->

    <!--</el-form>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button type="primary" @click="editSubmit">确 定</el-button>-->
    <!--<el-button @click="on_off.showEditDialog = false">取 消</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->
    <component :is="importComponent" :showDialog.sync="on_off.showDialog" :importParam="importParam"></component>
    <!--<component :is="importComponent" :showDialog.sync="on_off.showDialog" :importParam="importParam"></component>-->
  </div>
</template>

<script>
  import bus, {warehouseOutDetail} from '../../../../common/bus.js'
  import {localStorageKeys} from '../../../../common/const.js'

  export default {
    name: 'procurement',
    components: {
      // tableForm: resolve => require(['./AddOrEdit'], resolve) // 必须用下面的方式加载，否则会出现组件加载完成后立即销毁（一闪而过）
      addOrEdit: resolve => {
        require(['./AddOrEdit'], resolve)
      }
    },
    created: function () {
      bus.$on(warehouseOutDetail.search, (searchData) => { // 监听外部查询数据事件
        this.search(searchData)
      })
      bus.$on(warehouseOutDetail.refreshListForEdit, () => { // 监听数据更改后的列表刷新（刷新当前页）
        this.getData()
      })
      bus.$on(warehouseOutDetail.refreshListForAdd, () => { // 监听数据添加后的列表刷新
        this.getData()
      })
    },
    mounted: function () {
      this.getData()
    },
    watch: {
      '$route': function (to, from) {
        // 对路由变化作出响应...
        this.getData()
      }
    },
    data: function () {
      let pageSize = localStorage.getItem(localStorageKeys.productPageSize)
      return {
        on_off: {
          showDialog: false
        },
        importComponent: '',
        importParam: '',
        out_id: '',
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
        sortInfo: {prop: 'owd.create_time', order: 'descending'}
      }
    },
    methods: {
      search: function (searchData) { // 点击搜索时执行
        this.resetPageInfo()
        this.searchData = searchData
        this.getData()
      },
      edit: function (row) { // 编辑某条记录
        this.importComponent = 'addOrEdit'
        this.importParam = row.id
        this.on_off.showDialog = true
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
          this.$http.post('/manage/warehouse/out/importExcelOutWarehouse', {
            'fileName': file.response,
            'out_id': this.out_id
          }).then((response) => {
            this.successMsg('导入成功!')
            this.getData()
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
        console.log(row)
        // location.href = this._downloadExcelFilePath + 'exportExcelOutWarehouse?id=' + row[0].id
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
        this.out_id = this.$route.query.out_id
        this.$http.post('/manage/warehouse/out/detail/getData', Object.assign({'out_Id': this.out_id}, this.searchData, this.pageInfo, this.sortInfo)).then((response) => {
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
      sortChange: function ({column, prop, order}) { // 排序改变
        if (prop === this.sortInfo.prop && order === this.sortInfo.order) {
          return
        }
        this.sortInfo.prop = prop
        this.sortInfo.order = order
        this.resetPageInfo()
        this.getData()
      }
    }
  }
</script>

<style scoped>

</style>
