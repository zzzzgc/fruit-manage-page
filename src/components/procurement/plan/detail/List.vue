<template>
  <div class="table-list">
    <div class="action" style="color:#606266;margin-left:20px;">
      待统计订单数据：<span style="text-align: left;width:30px;display: inline-block;">{{waitStatisticsOrderTotal === '' ? 0 : waitStatisticsOrderTotal}}</span>
      <el-button type="primary" size="small" @click.navite="updatePPlanDetail">更新采购计划</el-button>
      <!--<el-button type="primary" size="small" @click.navite="importPPlanDetail">导入采购单</el-button>-->
      <el-upload style="display:inline-block;margin-left:10px;"
        class="upload-demo"
        :action="_uploadFilePath"
        :on-change="handleChange"
                 :show-file-list="false"
        :file-list="fileList3">
        <el-button size="small" type="primary">导入采购单</el-button>
      </el-upload>
      <span style="margin:-15px 0 0 10px;color:#999999;font-size:14px;">Excel格式：商品名、规格名、规格编码、重量(斤)、报价、下单量、库存量、采购量、采购单价、下单备注</span>
      <!--<el-button type="primary" size="small" @click.navite="createPPlanDetail">生成采购模板</el-button>-->
    </div>
    <el-table :data="tableData" @selection-change="selectChange" :default-sort="planDetailInfo" @sort-change="sortChange"
              highlight-current-row style="width: 100%">
      <!--<el-table-column fixed type="index" label="序号" width="70"></el-table-column>-->
      <el-table-column fixed prop="product_name" label="商品名" min-width="70"></el-table-column>
      <el-table-column fixed prop="product_standard_name" label="规格名" min-width="70"></el-table-column>
      <el-table-column prop="product_standard_id" label="规格编号" min-width="70"></el-table-column>
      <el-table-column prop="sell_price" label="报价" min-width="70"></el-table-column>
      <el-table-column prop="product_standard_num" label="下单数量" show-overflow-tooltip
                       min-width="100"></el-table-column>
      <el-table-column label="库存数量" min-width="50">
        <template slot-scope="scope">
          <span style="color:deepskyblue;" v-if="scope.row.procurement_num + scope.row.stock >= scope.row.product_standard_num">{{scope.row.stock}}</span>
          <span style="color:red;" v-else>{{scope.row.stock}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="procurement_num" label="采购数量" min-width="50">
        <template slot-scope="scope">
          <span style="color:deepskyblue;" v-if="scope.row.procurement_num + scope.row.stock >= scope.row.product_standard_num">{{scope.row.procurement_num}}</span>
          <span style="color:red;" v-else>{{scope.row.procurement_num}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="procurement_total_price" label="实采总价" min-width="50"></el-table-column>
      <el-table-column label="采购单价" min-width="50">
        <template slot-scope="scope">
          <span style="color:red;" v-if="scope.row.procurement_need_price >= scope.row.sell_price">{{scope.row.procurement_need_price}}</span>
          <span style="color:deepskyblue;" v-else>{{scope.row.procurement_need_price}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="userName" label="采购人" min-width="50"></el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small" class="delete" @click.native="edit(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="订单是否确认支付？"
      :center="true"
      :visible.sync="isShowDialogExport"
      width="50%" style="text-align: left;">
      <span slot="footer" class="dialog-footer">
                      <el-button @click="isShowDialogExport = false">取 消</el-button>
                      <el-button type="primary" @click="toPayMoney(order)">确 定</el-button>
                    </span>
    </el-dialog>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="pageInfo.totalRec" class="table-pager">
    </el-pagination>
    <component :is="editCompName" :showDialog.sync="showEdit" :editRowId="editRowId"></component>
  </div>
</template>

<script>
  import Vue from 'vue'
  import bus, {procurementDetail} from '../../../../common/bus.js'
  import {localStorageKeys} from '../../../../common/const.js'
  import axios from 'axios'
  Vue.prototype.$ajax = axios
  export default {
    name: 'procurement',
    components: {
      pPlanDetail: resolve => {
        require(['./AddOrEdit'], resolve)
      }
    },
    watch: {
      '$route': function (to, from) {
        if (to.name === 'ProcurementDetail') {
          // 对路由变化作出响应...
          this.getData()
        }
      }
    },
    created: function () {
      bus.$on(procurementDetail.search, (searchData) => { // 监听外部查询数据事件
        this.search(searchData)
      })
      bus.$on(procurementDetail.showAddOrEdit, () => { // 监听数据更改后的列表刷新（刷新当前页）
        this.getData()
        this.successMsg('修改成功!')
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
        isShowDialogExport: false,
        editRowId: null, // 编辑的记录ID,
        pPlanDate: '',
        tableData: [],
        selectIds: [],
        searchData: {},
        pageInfo: {
          pageNum: 1,
          totalRec: 0,
          pageSize: pageSize == null ? 10 : parseInt(pageSize)
        },
        planDetailInfo: {prop: 'ppd.create_time', order: 'descending'},
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
      handleChange (file, fileList) {
        this.exportExcel(file, fileList)
      },
      exportExcel: function (file, fileList) {
        if (typeof (file.response) !== 'undefined') {
          this.$http.post('manage/procurement/plan/detail/uploaderExcelThree', {'procurementPlanId': this.$route.query.procurementPlanId, 'fileName': file.response, 'order_cycle_date': this.$route.query.order_cycle_date}).then((response) => {
            this.getData()
            this.successMsg('导入成功!')
          })
        }
      },
      edit: function (row) { // 编辑某条记录
        this.editCompName = 'pPlanDetail'
        this.editRowId = row.id
        this.showEdit = true
      },
      resetPageInfo: function () { // 重置分页参数
        this.pageInfo.totalRec = 0
        this.pageInfo.pageNum = 1
      },
      getData: function () { // 获取服务器数据
        this.searchData.order_cycle_date = this.$route.query.order_cycle_date
        this.searchData.procurementPlanId = this.$route.query.procurementPlanId
        this.$http.post('/manage/procurement/plan/detail/getAllPPlanDetail', Object.assign({}, this.searchData, this.pageInfo, this.planDetailInfo)).then((response) => {
          if (response.data.list !== null && response.data.list.length > 0) {
            this.waitStatisticsOrderTotal = response.data.list[0].waitStatisticsOrderTotal
          }
          this.pageInfo.totalRec = response.data.totalRow
          this.tableData = response.data.list
        })
      },
      updatePPlanDetail: function () {
        this.$http.post('/manage/procurement/plan/detail/updatePPlanDetail', {'procurementPlanId': this.$route.query.procurementPlanId, 'order_cycle_date': this.$route.query.order_cycle_date}).then((response) => {
          this.getData()
          this.successMsg('更新成功!')
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
        if (prop === this.planDetailInfo.prop && order === this.planDetailInfo.order) {
          return
        }
        this.planDetailInfo.prop = prop
        this.planDetailInfo.order = order
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
