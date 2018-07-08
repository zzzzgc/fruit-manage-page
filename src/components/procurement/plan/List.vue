<template>
  <div class="table-list">
    <div class="action">
      <el-button type="primary" size="small" @click="ShowAddProcurement">新增采购计划</el-button>
    </div>
    <el-table :data="tableData" @selection-change="selectChange" :default-sort="planInfo" @sort-change="sortChange"
              highlight-current-row style="width: 100%">
      <!--<el-table-column fixed type="index" label="序号" width="70"></el-table-column>-->
      <el-table-column fixed prop="procurement_id" label="采购计划号" min-width="70"></el-table-column>
      <el-table-column fixed prop="order_cycle_date" label="采购日期" min-width="70"></el-table-column>
      <el-table-column prop="product_standard_num" label="品类品种" min-width="70"></el-table-column>
      <el-table-column prop="num" label="商品总数" min-width="70"></el-table-column>
      <el-table-column prop="wait_statistics_order_total" label="待统计订单数量" show-overflow-tooltip
                       min-width="100"></el-table-column>
      <el-table-column sortable prop="order_total" label="订单总数" min-width="50"></el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small" class="delete" @click.native="delProcurement(scope.row)">删除</el-button>
          <el-button type="text" size="small" @click.native="showPPlanDetail(scope.row)">查看计划</el-button>
          <el-button type="text" size="small" @click.navite="updatePPlan(scope.row)">更新计划</el-button>
          <el-button type="text" size="small" @click.navite="exportPPlan(scope.row)">导出</el-button>
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


    <!--<el-dialog :visible.sync="on_off.showAddDialog">-->
    <!--<el-form>-->
    <!--<el-form-item label="出库时间">-->
    <!--<el-date-picker size="small" value-format="yyyy-MM-dd" v-model="addInfo.create_Time" type="date" placeholder="选择日期和时间">-->
    <!--</el-date-picker>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="出库类型">-->
    <!--&lt;!&ndash;0采购出库 1招待出库&ndash;&gt;-->
    <!--<el-radio v-model="addInfo.out_type" label="0">采购出库</el-radio>-->
    <!--<el-radio v-model="addInfo.out_type" label="1">招待出库</el-radio>-->
    <!--</el-form-item>-->
    <!--</el-form>-->

    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button type="primary" @click="addRow">确 定</el-button>-->
    <!--<el-button @click="on_off.showAddDialog = false">取 消</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->


    <el-dialog :visible.sync="showAddDialog" width="35%" :before-close="handleClose" style="text-align: center;">
      <el-form>
        <el-form-item label="采购时间">
          <el-date-picker size="small" value-format="yyyy-MM-dd" v-model="selectOrderCycleDate" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProcurement">确 定</el-button>
        <el-button @click="showAddDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import bus, {procurementPlan} from '../../../common/bus.js'
  import {localStorageKeys} from '../../../common/const.js'

  export default {
    name: 'procurement',
    components: {},
    created: function () {
      bus.$on(procurementPlan.search, (searchData) => { // 监听外部查询数据事件
        this.search(searchData)
      })
    },
    watch: {
      '$route': function (to, from) {
        console.log(to)
        if (to.name === 'Procurement') {
          // 对路由变化作出响应...
          this.getData()
        }
      }
    },
    mounted: function () {
      this.getData()
    },
    data: function () {
      let pageSize = localStorage.getItem(localStorageKeys.productPageSize)
      return {
        showAddDialog: false, // 是否展示编辑弹窗
        pPlanDate: '',
        tableData: [],
        selectIds: [],
        selectOrderCycleDate: '',
        searchData: {},
        pageInfo: {
          pageNum: 1,
          totalRec: 0,
          pageSize: pageSize == null ? 10 : parseInt(pageSize)
        },
        planInfo: {prop: 'pp.order_cycle_date', order: 'descending'}
      }
    },
    methods: {
      search: function (data) { // 点击搜索时执行
        this.resetPageInfo()
        this.searchData = data
        this.getData()
      },
      delProcurement: function (row) {
        this.$confirm('是否要删除采购计划号为' + row.procurement_id + '这条记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          let _this = this
          this.$http.post('/manage/procurement/plan/delPPlan', {'pPlanId': row.id}).then((response) => {
            _this.getData()
            _this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {
        })
      },
      ShowAddProcurement: function () {
        this.showAddDialog = true
        let date = new Date()
        let hours = date.getHours()
        let fullDate = ''
        if (hours >= 12) {
          date.setDate(date.getDate() + 1)
        }
        let year = date.getFullYear()
        let month = date.getMonth()
        let today = date.getDate()
        fullDate = year + '年' + (month + 1) + '月' + today + '日'
        this.pPlanDate = fullDate
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
      addProcurement: function () { // 新增采购计划
        this.$http.post('/manage/procurement/plan/addPlan', {'order_cycle_date': this.selectOrderCycleDate}).then((response) => {
          if (response.data[0] === 0 || response.data[0] === 1) {
            this.showAddDialog = false
            this.getData()
            this.successMsg('新增采购计划成功!')
          } else if (response.data[0] === 2) {
            this.showAddDialog = false
            this.getData()
            this.warningMsg('今日没有订单!')
          } else {
            this.showAddDialog = false
            this.getData()
            this.warningMsg('新增采购计划失败!')
          }
        })
      },
      updatePPlan: function (row) {
        // this.$http.post('/manage/procurement/plan/updatePPlan', {'createTime': row.create_time}).then((response) => {
        this.$http.post('/manage/procurement/plan/detail/updatePPlanDetail', {'procurementPlanId': row.id, 'order_cycle_date': row.order_cycle_date}).then((response) => {
          this.getData()
          this.successMsg('更新成功!')
        })
      },
      exportPPlan: function (row) { // 导出
        location.href = this._downloadExcelFilePath + 'getProcurementPlanBilling' + '?order_cycle_date=' + row.order_cycle_date
      },
      showPPlanDetail: function (row) {
        this.$router.push({path: '/manage/procurement/procurementDetail', query: {'procurementPlanId': row.id, 'order_cycle_date': row.order_cycle_date}})
      },
      resetPageInfo: function () { // 重置分页参数
        this.pageInfo.totalRec = 0
        this.pageInfo.pageNum = 1
      },
      getData: function () { // 获取服务器数据
        this.$http.post('/manage/procurement/plan/getPlan', Object.assign({}, this.searchData, this.pageInfo, this.planInfo)).then((response) => {
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
        if (prop === this.planInfo.prop && order === this.planInfo.order) {
          return
        }
        this.planInfo.prop = prop
        this.planInfo.order = order
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
