<template>
  <div class="table-list">
    <div class="action">
      <el-button type="primary" size="small" @click="addRefund">新增退款</el-button>
    </div>
    <el-table :data="tableData" @selection-change="selectChange" :default-sort="planInfo" @sort-change="sortChange"
              highlight-current-row style="width: 100%">
      <el-table-column prop="businessName" label="客户名称"></el-table-column>
      <el-table-column prop="saleName" label="销售人员"></el-table-column>
      <el-table-column prop="refundTheMoney" label="退款金额"></el-table-column>
      <el-table-column prop="refundOfTime" label="退款时间"></el-table-column>
      <el-table-column >
        <template slot-scope="scope">
          <span style="cursor:pointer;display: inline-block;color:#5AABFF;"  @click="showRefundOfEvidence(scope.row.refundOfEvidence)">查看支付凭证</span>
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
    <component :is="editCompName" :showDialog2.sync="showAddOrEdit" :editRowId="editRowId" ></component>
    <component :is="editCompName" :showDialog3.sync="showBigImage" :imgUrl="bigImgUrl" :title="refundTitle"></component>
  </div>
</template>

<script>
  import bus, {refund} from '../../../common/bus.js'
  import {localStorageKeys} from '../../../common/const.js'

  export default {
    name: 'refund-list',
    components: {
      refundAddOrEdit: resolve => {
        require(['./AddOrEdit.vue'], resolve)
      },
      bigImage: resolve => {
        require(['../other/BigImage.vue'], resolve)
      }
    },
    created: function () {
      bus.$on(refund.search, (searchData) => { // 监听外部查询数据事件
        this.search(searchData)
      })
      bus.$on(refund.showAddOrEdit, () => {
        this.getData()
      })
    },
    mounted: function () {
      this.getData()
    },
    data: function () {
      let pageSize = localStorage.getItem(localStorageKeys.productPageSize)
      return {
        editCompName: '',
        showAddOrEdit: false, // 是否展示编辑弹窗
        showBigImage: false,
        refundTitle: '退款凭证',
        bigImgUrl: '',
        editRowId: '',
        pPlanDate: '',
        tableData: [],
        selectIds: [],
        searchData: {},
        pageInfo: {
          pageNum: 1,
          totalRec: 0,
          pageSize: pageSize == null ? 10 : parseInt(pageSize)
        },
        planInfo: {prop: 'od.create_time', order: 'descending'}
      }
    },
    methods: {
      search: function (data) { // 点击搜索时执行
        this.resetPageInfo()
        this.searchData = data
        this.getData()
      },
      showRefundOfEvidence: function (refundOfEvidence) {
        this.editCompName = 'bigImage'
        this.showBigImage = true
        this.bigImgUrl = refundOfEvidence
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
      resetPageInfo: function () { // 重置分页参数
        this.pageInfo.totalRec = 0
        this.pageInfo.pageNum = 1
      },
      getData: function () { // 获取服务器数据
        this.$http.post('/manage/order/refund/getData', Object.assign({}, this.searchData, this.pageInfo, this.planInfo)).then((response) => {
          this.pageInfo.totalRec = response.data.totalRow
          this.tableData = response.data.list
        })
      },
      addRefund: function () {
        this.editCompName = 'refundAddOrEdit'
        this.showAddOrEdit = true
        this.editRowId = null
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
