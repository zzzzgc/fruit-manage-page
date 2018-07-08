<template>
  <div class="table-list">
    <div class="action" style="color:#606266;margin-left:20px;">
      <span style="text-align: left;width:300px;display:block;margin-bottom: 10px;">入库日期：{{this.$route.query.order_cycle_date}}</span>
      <el-button type="primary" size="small" @click.navite="addPutWarehouseDetail">新增入库商品</el-button>
      <!--<el-button type="primary" size="small" @click.navite="importPPlanDetail">导入采购单</el-button>-->
      <el-upload style="display:inline-block;margin-left:10px;"
        class="upload-demo"
        :action="_uploadFilePath"
        :on-change="isShowDialogExport"
                 :show-file-list="false"
        :file-list="fileList3">
        <el-button size="small" type="primary">导入入库单</el-button>
      </el-upload><span style="margin-left:20px;color:#999999;font-size:14px;">商品名，规格名，规格编码，重量(斤)，采购单价，采购总价，摊位费，入库数量，采购人</span>
      <!--<el-button type="primary" size="small" @click.navite="createPPlanDetail">生成采购模板</el-button>-->
    </div>
    <el-table :data="tableData" @selection-change="selectChange" :default-sort="putDetailInfo" @sort-change="sortChange"
              highlight-current-row style="width: 100%">
      <!--<el-table-column fixed type="index" label="序号" width="70"></el-table-column>-->
      <el-table-column fixed prop="product_name" label="商品名" min-width="70"></el-table-column>
      <el-table-column fixed prop="product_standard_name" label="规格名" min-width="70"></el-table-column>
      <el-table-column prop="product_standard_id" label="规格编号" min-width="70"></el-table-column>
      <el-table-column prop="product_weight" label="重量（斤）" min-width="70"></el-table-column>
      <el-table-column prop="procurement_price" label="采购单价" min-width="100"></el-table-column>
      <el-table-column sortable prop="procurement_total_price" label="采购总价" min-width="50"></el-table-column>
      <el-table-column sortable prop="booth_cost" label="摊位费" min-width="50"></el-table-column>
      <el-table-column sortable prop="put_num" label="入库数量" min-width="50"></el-table-column>
      <el-table-column sortable prop="put_average_price" label="入库单价" min-width="50"></el-table-column>
      <el-table-column sortable prop="procurement_name" label="采购人" min-width="50"></el-table-column>
      <el-table-column sortable prop="put_remark" label="入库备注" min-width="90"></el-table-column>
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
  // zgc 2018-06-13
  // import Vue from 'vue'
  import bus, {warehousePutDetail} from '../../../../common/bus.js'
  import {localStorageKeys} from '../../../../common/const.js'
  // import axios from 'axios'
  // Vue.prototype.$ajax = axios
  export default {
    name: 'warehousePutDetail',
    components: {
      putDetail: resolve => {
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
      bus.$on(warehousePutDetail.search, (searchData) => { // 监听外部查询数据事件
        this.search(searchData)
      })
      bus.$on(warehousePutDetail.showAddOrEdit, () => { // 监听数据更改后的列表刷新（刷新当前页）
        this.getData()
        this.successMsg('修改成功!')
      })
      bus.$on(warehousePutDetail.refreshListForAdd, () => { // 监听添加数据之后列表更新并提示成功
        this.getData()
        this.successMsg('添加成功!')
      })
    },
    mounted: function () {
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
        putDetailInfo: {prop: 'pwd.put_id', order: 'descending'},
        waitStatisticsOrderTotal: '',
        fileList3: []
      }
    },
    methods: {
      search: function (data) { // 点击搜索时执行
        this.resetPageInfo()
        this.searchData = data
        this.getData()
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
          this.$http.post('manage/warehouse/put/detail/exportInfo', {'fileName': file.response, 'putId': this.$route.query.id, 'order_cycle_date': this.$route.query.order_cycle_date}).then((response) => {
            this.getData()
            this.successMsg('导入成功!')
          })
        }
      },
      addPutWarehouseDetail: function () {
        this.editCompName = 'putDetail'
        this.editRowId = null
        this.putId = this.$route.query.id
        this.showEdit = true
      },
      edit: function (row) { // 编辑某条记录
        this.editCompName = 'putDetail'
        this.editRowId = row.id
        this.showEdit = true
      },
      resetPageInfo: function () { // 重置分页参数
        this.pageInfo.totalRec = 0
        this.pageInfo.pageNum = 1
      },
      getData: function () { // 获取服务器数据
        console.log('out的detail的getData')
        this.searchData.order_cycle_date = this.$route.query.order_cycle_date
        this.searchData.put_id = this.$route.query.id
        this.$http.post('/manage/warehouse/put/detail/getAllInfo', Object.assign({}, this.searchData, this.pageInfo, this.putDetailInfo)).then((response) => {
          if (response.data.list !== null && response.data.list.length > 0) {
            this.waitStatisticsOrderTotal = response.data.list[0].waitStatisticsOrderTotal
          }
          this.pageInfo.totalRec = response.data.totalRow
          this.tableData = response.data.list
        })
      },
      createPPlanDetail: function () {
      },
      importPPlanDetail: function () {
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
