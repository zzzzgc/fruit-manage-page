<template>
  <div class="table-list">
    <div class="action">
      <el-button type="primary" size="small" @click="exportProductSaleRankList">导出商品销售排行报表</el-button>
    </div>
    <el-table :data="tableData" @selection-change="selectChange" :default-sort="planInfo" @sort-change="sortChange"
              highlight-current-row style="width: 100%">
      <el-table-column prop="productName" label="商品名称"></el-table-column>
      <el-table-column prop="productStandardName" label="商品规格"></el-table-column>
      <el-table-column prop="productStandardId" label="规格编号"></el-table-column>
      <el-table-column prop="productStandardNum" label="商品规格数量"></el-table-column>
      <el-table-column prop="avgSellPrice" label="平均报价"></el-table-column>
      <el-table-column prop="deliverNumTotalPrice" label="总销售金额"></el-table-column>
      <el-table-column label="平均毛利">
        <template slot-scope="scope">
          {{scope.row.grossProfitRate == null || scope.row.grossProfitRate == "" ? "" : scope.row.grossProfitRate + "%"}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
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
  </div>
</template>

<script>
  import bus, {productSaleRankList} from '../../../common/bus.js'
  import {localStorageKeys} from '../../../common/const.js'

  export default {
    name: 'product-sale-rank-list-list',
    components: {},
    created: function () {
      bus.$on(productSaleRankList.search, (searchData) => { // 监听外部查询数据事件
        this.search(searchData)
      })
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
      exportPPlan: function (row) { // 导出
        location.href = this._downloadExcelFilePath + 'getProcurementPlanBilling' + '?createTime=' + row.create_time
      },
      resetPageInfo: function () { // 重置分页参数
        this.pageInfo.totalRec = 0
        this.pageInfo.pageNum = 1
      },
      getData: function () { // 获取服务器数据
        this.$http.post('/manage/statement/pSRankList/getData', Object.assign({}, this.searchData, this.pageInfo, this.planInfo)).then((response) => {
          this.pageInfo.totalRec = response.data.totalRow
          this.tableData = response.data.list
        })
      },
      exportProductSaleRankList: function () {
        this.$http.post('/manage/statement/pSRankList/exportPSRankListExcel', Object.assign({}, this.searchData, this.pageInfo, this.planInfo)).then((response) => {
          location.href = this._downloadFilePath + response.data[0]
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
