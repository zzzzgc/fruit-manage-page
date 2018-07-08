<template>
  <div class="table-list">
    <div class="action">
      <el-button type="primary" size="small" @click="inputExcel">导出数据</el-button>
      <!--<el-form-item label="汇总利润">-->
        <!--{{this.totalData.total_gross_margin}}-->
        <!--<el-input v-model="this.totalData.total_gross_margin"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="汇总毛利率">-->
        <!--<el-input v-model="Number(this.totalData.gross_margin).toFixed(1)"></el-input>-->
      <!--</el-form-item>-->


      <!--<div style="display: inline-block">-->
        <!--<span>汇总利润:{{this.totalData.total_gross_margin}} </span>-->
        <!--<span>汇总毛利率:{{Number(this.totalData.gross_margin).toFixed(1)}}%</span>-->
      <!--</div>-->


      <!--{{this.tableData}}-->
    </div>
    <el-table :data="tableData" @selection-change="selectChange" :default-sort="groupInfo" @sort-change="sortChange" border highlight-current-row style="width: 100%">
      <!--<el-table-column type="selection" width="55"></el-table-column>-->
      <!--<el-table-column type="index" label="序号" width="70"></el-table-column>-->
      <el-table-column prop="productName" label="商品" width="150"></el-table-column>
      <el-table-column prop="productStandardName" label="商品规格" width="120"></el-table-column>
      <el-table-column prop="productStandardId" label="规格编号" width="80"></el-table-column>
      <el-table-column prop="nick_name" label="采购人" width="80"></el-table-column>
      <el-table-column prop="sell_price" label="产品销售均价" width="120"></el-table-column>
      <el-table-column prop="costPrice" label="产品成本均价" width="120"></el-table-column>
      <el-table-column prop="average_margin_price" label="产品平均利润" width="120"></el-table-column>
      <el-table-column prop="totalActualNum" label="实际发货总数" width="120"></el-table-column>
      <el-table-column prop="total_margin_price" label="产品总利润" width="120"></el-table-column>
      <el-table-column prop="avgActualSendGoosNum" label=" 实际发货平摊单价" width="125"></el-table-column>
      <el-table-column label="毛利率" width="80">
        <template slot-scope="scope">
          {{Number(scope.row.margin).toFixed(1)}}%
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalRec" class="table-pager">
    </el-pagination>
  </div>
</template>

<script>
  import bus, {procurement} from '../../../common/bus.js'
  import {localStorageKeys} from '../../../common/const.js'

  export default {
    components: {},
    created: function () {
      bus.$on(procurement.search, (searchData) => { // 监听外部查询数据事件
        this.search(searchData)
      })
    },
    data: function () {
      let pageSize = localStorage.getItem(localStorageKeys.salesMarginListPageSize)
      return {
        groupInfo: {groupStr: 'sort', orderBy: 'descending'},
        pageInfo: {
          pageNum: 1,
          totalRec: 0,
          pageSize: pageSize == null ? 10 : parseInt(pageSize)
        },
        searchData: {},
        tableData: [],
        totalData: {
          total_gross_margin: 0,
          gross_margin: 0
        }
      }
    },
    methods: {
      search: function (data) { // 点击搜索时执行
        this.resetPageInfo()
        this.searchData = data
        this.getData()
      },
      resetPageInfo: function () { // 重置分页参数
        this.pageInfo.totalRec = 0
        this.pageInfo.pageNum = 1
      },
      getData: function () { // 获取服务器数据
        this.$http.post('/manage/statement/procurementMargin/getData', Object.assign({}, this.searchData, this.pageInfo, this.groupInfo)).then((response) => {
          this.pageInfo.totalRec = response.data.totalRow
          this.tableData = response.data.list
          // this.$http.post('/manage/statement/procurementMargin/getTotalInfo', Object.assign({}, this.searchData, this.pageInfo, this.groupInfo)).then(
          //   (response) => {
          //     this.totalData.total_gross_margin = response.data.total_gross_margin
          //     this.totalData.gross_margin = response.data.gross_margin
          //   }
          // )
        })
      },
      inputExcel: function () {  // 导出订单数据
        this.$http.post('/manage/statement/procurementMargin/exportExcel', Object.assign({}, this.searchData)).then((response) => {
          location.href = this._downloadFilePath + response.data[0]
        })
        // location.href = ajaxPrefix + '/manage/statement/salesMargin/exportExcel?nick_name=' + this.searchData.nick_name + '&business_name=' + this.searchData.business_name + '&order_cycle_date=' + this.searchData.order_cycle_date
      },
      handleSizeChange: function (val) { // 每页条数改变时重新加载记录
        this.pageInfo.pageSize = val
        localStorage.setItem(localStorageKeys.bannerPageSize, val)
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
        if (prop === this.groupInfo.groupStr && order === this.groupInfo.orderBy) {
          return
        }
        this.groupInfo.groupStr = prop
        this.groupInfo.orderBy = order
        this.resetPageInfo()
        this.getData()
      }
    }
  }
</script>

<style scoped>
  .el-table .cell img {
    cursor: pointer;
    max-height: 100px;
    max-width: 150px;
  }
</style>
