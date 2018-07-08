<template>
  <div class="table-list">
    <div class="action">
      <el-button type="primary" size="small" @click="exportProcurementStoreout">导出采购缺货单</el-button>
      <el-tooltip placement="top">
        <div slot="content">
          0. 该表是精细到 商品规格和采购人的。仅用于查看采购缺货情况。<br/>
          1. 采购价格仅供参考，因为部分采购计划单可能未填写报价。因为当天没有货或者该货不好等原因。<br/>
          2. 订单缺货和订单缺货率：订单的某一样货一件都没发视为订单缺货。<br/>
          &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp会出现可能采购采了货，但是因为物流仓储等原因没发。所以可能不视为采购责任。<br/>
          &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp订单缺货率 = （有该规格的订单缺货数量 / 有该规格的订单数量）%<br/>
          3. 因为优先发库存原则，所以<br/>
          &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp缺货算法 = 订单-库存 - 采购量<br/>
          &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp缺货率算法 = 1 - （采购量/订单量-库存量）%<br/>
          &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp来核实是否缺货。<br/>
          4. 超采不算缺货，也不在采购缺货报表上体现。<br/>
          5. 历史累加库存量&nbsp不是当前库存量&nbsp不是当前库存量&nbsp不是当前库存量<br/>
          6. 当天采购人不能有两人或两人同才一批货（小概率事件）。<br/>
          &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp如果有则在采购计划中只算一个人的，否则可能会出现两人同时缺货的情况。<br/>
          7.预留<br/>
          8. 这些数据都是历史数据,且不可按照当前情况来核对.比如当前库存和历史积累库存做比较、用当前平台报价来算缺货总额等。<br/>
          9. 有时会出现采购缺货率高但是没有订单缺货的情况，原因是每个订单都发了至少一件货的原因<br/>
          10. 缺货金额是通过至指定时间段的平均平台报价算的，如果指定时间区间为当天，则按照当天平台报价算。<br/>
          写在最后： 实际算法比这些深奥的多，所以数据核对有误请及时反馈。信息有点零散，但是还是必写的。做一个备注是十分有必要的。未完期待。。。<br/>
        </div>
        <i class="el-icon-info">信息提示</i>
      </el-tooltip>
    </div>
    <el-table :data="tableData" @selection-change="selectChange" :default-sort="planInfo" @sort-change="sortChange"
              highlight-current-row style="width: 100%">
      <el-table-column prop="product_name" label="商品名称"></el-table-column>
      <el-table-column prop="product_standard_name" label="商品规格"></el-table-column>
      <el-table-column prop="product_standard_id" label="规格编号"></el-table-column>
      <el-table-column prop="product_standard_num" label="下单数量"></el-table-column>
      <el-table-column prop="inventory_num" label="历史累加库存数量"></el-table-column>
      <el-table-column prop="procurement_num" label="采购数量"></el-table-column>
      <el-table-column label="采购缺货数量">
        <template slot-scope="scope">
          {{(scope.row.product_standard_num - scope.row.procurement_num - scope.row.inventory_num) > 0 ? (scope.row.product_standard_num - scope.row.procurement_num - scope.row.inventory_num) : '不缺货'}}
        </template>
      </el-table-column>
      <el-table-column label="采购商品缺货率">
        <template slot-scope="scope">
          {{(scope.row.product_standard_num - scope.row.procurement_num - scope.row.inventory_num) > 0 ? Math.round((1 - (scope.row.procurement_num  / (scope.row.product_standard_num - scope.row.inventory_num))) * 100)+"%" : '不缺货'}}
        </template>
      </el-table-column>
      <el-table-column prop="sell_price" label="平均平台报价"></el-table-column>
      <el-table-column label="缺货总额">
        <template slot-scope="scope">
          <!--临时按销售价来算缺货总额-->
          {{(scope.row.product_standard_num - scope.row.procurement_num - scope.row.inventory_num) > 0 ? (scope.row.product_standard_num - scope.row.procurement_num - scope.row.inventory_num) * (scope.row.sell_price) : '0'}}
        </template>
      </el-table-column>
      <el-table-column prop="procurement_name" label="采购人"></el-table-column>
      <!--<el-table-column prop="costPrice" label="成本价"></el-table-column>-->
      <!--<el-table-column prop="sell_price" label="销售价"></el-table-column>-->
      <el-table-column prop="orderDetailTotalNum" label="订单详细数量"></el-table-column>
      <el-table-column prop="storeoutNum" label="订单详细缺货数量"></el-table-column>
      <el-table-column label="订单缺货率">
        <template slot-scope="scope">
          {{Math.round((scope.row.storeoutNum / (scope.row.orderDetailTotalNum * 1.0 )) * 100)}}%
        </template>
      </el-table-column>

      <!--<el-table-column label="缺货占比">-->
        <!--<template slot-scope="scope">-->
          <!--&lt;!&ndash;<span style="color:red;">{{scope.row.product_standard_num}}</span>&ndash;&gt;-->
          <!--&lt;!&ndash;<span style="color:green;">{{scope.row.procurement_num}}</span>&ndash;&gt;-->
          <!--&lt;!&ndash;<span style="color:black;">{{scope.row.inventory_num}}</span>&ndash;&gt;-->
          <!--&lt;!&ndash;<span style="color:purple;">{{scope.row.procurement_need_price}}</span>&ndash;&gt;-->
          <!--&lt;!&ndash;<span style="color:gray;">{{scope.row.procurement_total_price}}</span>&ndash;&gt;-->
          <!--&lt;!&ndash;{{((scope.row.procurement_need_price) == 0 || (scope.row.procurement_need_price) == null) ?'':((scope.row.procurement_total_price == 0 || scope.row.procurement_total_price == null)?'':(scope.row.product_standard_num - scope.row.procurement_num - scope.row.inventory_num) > 0 ? (((scope.row.product_standard_num - scope.row.procurement_num - scope.row.inventory_num) * (scope.row.procurement_need_price)) / scope.row.procurement_total_price) * 100 + '%' : '')}}&ndash;&gt;-->
          <!--&lt;!&ndash;临时按销售价来算缺货总额&ndash;&gt;-->
          <!--{{((scope.row.product_standard_num - scope.row.procurement_num - scope.row.inventory_num) > 0 ? isNaN((((scope.row.product_standard_num - scope.row.procurement_num - scope.row.inventory_num) * (scope.row.procurement_need_price)) / scope.row.procurement_total_price) * 100) ? '' : ((((scope.row.product_standard_num - scope.row.procurement_num - scope.row.inventory_num) * (scope.row.sell_price)) / scope.row.procurement_total_price) * 100) + '%' : '')}}-->
        <!--</template>-->
      <!--</el-table-column>-->
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
  import bus, {storeout} from '../../../common/bus.js'
  import {localStorageKeys} from '../../../common/const.js'

  export default {
    name: 'procurement-storeout-list',
    components: {},
    created: function () {
      bus.$on(storeout.search, (searchData) => { // 监听外部查询数据事件
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
        planInfo: {prop: 'pp.create_time', order: 'descending'}
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
        console.log('getData')
        this.$http.post('/manage/statement/storeout/getData', Object.assign({}, this.searchData, this.pageInfo, this.planInfo)).then((response) => {
          this.pageInfo.totalRec = response.data.totalRow
          this.tableData = response.data.list
          console.log(this.tableData)
        })
      },
      exportProcurementStoreout: function () {
        this.$http.post('/manage/statement/storeout/exportStoreoutExcel', Object.assign({}, this.searchData, this.pageInfo, this.planInfo)).then((response) => {
          console.log(response)
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
