<template>
  <div class="table-list">
    <el-table :data="tableData" :default-sort="orderInfo" @sort-change="sortChange" border highlight-current-row style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="收货人1">
              <span>{{ props.row.buy_user_name }}</span>
            </el-form-item>
            <el-form-item label="收货手机">
              <span>{{ props.row.buy_phone }}</span>
            </el-form-item>
            <el-form-item label="收货地址">
              <span>{{ props.row.buy_address }}</span>
            </el-form-item>
            <el-form-item label="配送时间1">
              <span>{{ props.row.delivery_time }}</span>
            </el-form-item>
            <el-form-item label="配送方式1">
              <span>{{ props.row.delivery_type }}</span>
            </el-form-item>
            <el-form-item label="实际发货时间">
              <span>{{ props.row.send_goods_time }}</span>
            </el-form-item>
            <el-form-item label="实际收货时间">
              <span>{{ props.row.take_goods_time }}</span>
            </el-form-item>
            <el-form-item label="退款时间">
              <span>{{ props.row.refund_time }}</span>
            </el-form-item>
            <el-form-item label="退款金额1">
              <span>{{ props.row.refund_amount }}</span>
            </el-form-item>
            <el-form-item label="撤单时间">
              <span>{{ props.row.cancel_time }}</span>
            </el-form-item>
            <el-form-item label="撤单原因">
              <span>{{ props.row.cancel_reason }}</span>
            </el-form-item>
            <el-form-item label="支付失败原因1">
              <span>{{ props.row.pay_fail_msg }}</span>
            </el-form-item>
            <el-form-item label="商品单价">
              <span>{{ props.row.sell_price }}</span>
            </el-form-item>
            <el-form-item label="单件商品数量1">
              <span>{{ props.row.product_single_number }}</span>
            </el-form-item>
            <el-form-item label="商品原价">
              <span>{{ props.row.original_price }}</span>
            </el-form-item>
            <el-form-item label="购买数量">
              <span>{{ props.row.num }}</span>
            </el-form-item>
            <el-form-item label="订单修改时间">
              <span>{{ props.row.update_time }}</span>
            </el-form-item>
            <el-form-item label="订单原价">
              <span>{{ props.row.pay_need_money }}</span>
            </el-form-item>
            <el-form-item label="订单实际支付价格">
              <span>{{ props.row.pay_total_money }}</span>
            </el-form-item>
            <el-form-item label="是否支付">
              <span>{{ props.row.pay_status > 0 ? '支付': '未支付' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="order_id" label="订单号"></el-table-column>
      <el-table-column prop="product_id" label="商品号"></el-table-column>
      <el-table-column prop="product_name" label="商品名称"></el-table-column>
      <el-table-column prop="buy_uid" label="买家UID"></el-table-column>
      <el-table-column prop="order_status" label="订单状态" :formatter="orderStatusType"></el-table-column>
      <el-table-column prop="pay_status" label="支付状态" :formatter="payStatusType"></el-table-column>
      <el-table-column prop="create_time" sortable label="下单时间"></el-table-column>
      <el-table-column prop="pay_time" sortable label="支付完成时间"></el-table-column>
      <!--订单完成时间先按收货时间来算-->
      <el-table-column prop="take_goods_time" sortable label="订单完成时间"></el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageInfo.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalRec" class="table-pager">
    </el-pagination>
  </div>
</template>

<script>
  import bus, {order} from '../../common/bus.js'
  import {localStorageKeys} from '../../common/const.js'

  export default {
    created: function () {
      bus.$on(order.search, (searchData) => { // 监听外部查询数据事件
        this.search(searchData)
      })
    },
    data: function () {
      let pageSize = localStorage.getItem(localStorageKeys.orderPageSize)
      return {
        pageInfo: {
          pageNum: 1,
          totalRec: 0,
          pageSize: pageSize == null ? 10 : parseInt(pageSize)
        },
        searchData: {},
        orderInfo: {prop: 'o.create_time', order: 'descending'},
        tableData: []
      }
    },
    methods: {
      fmtType: function (row, column) { // 格式化某列
        let typeName = ''
        if (row.status === 0) {
          typeName = '下线'
        } else if (row.status === 1) {
          typeName = '上线'
        } else {
          typeName = row.status
        }
        return typeName
      },
      orderStatusType: function (row, column) { // 格式化订单状态
        let typeName = ''
        switch (row.order_status) {
          case 0 :
            typeName = '已下单'
            break
          case 5 :
            typeName = '未发货'
            break
          case 10 :
            typeName = '发货中'
            break
          case 20 :
            typeName = '订单正常完成'
            break
          case 30 :
            typeName = '撤单中'
            break
          case 40 :
            typeName = '订单完成'
            break
          default:
            return '未知'
        }
        return typeName
      },
      payStatusType: function (row, column) { // 格式化支付状态
        let typeName = ''
        switch (row.order_status) {
          case 0 :
            typeName = '未支付'
            break
          case 5 :
            typeName = '已支付'
            break
          case 10 :
            typeName = '已退款'
            break
          default:
            return '未知'
        }
        return typeName
      },
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
        console.log(this.searchData)
        this.$http.post('/manage/order/getData', Object.assign({}, this.searchData, this.pageInfo, this.orderInfo)).then((response) => {
          this.pageInfo.totalRec = response.data.totalRow
          this.tableData = response.data.list
        })
      },
      handleSizeChange: function (val) { // 每页条数改变时重新加载记录
        this.pageInfo.pageSize = val
        localStorage.setItem(localStorageKeys.orderPageSize, val)
        this.getData()
      },
      handleCurrentChange: function (val) { // 页码改变时重新加载记录
        this.pageInfo.pageNum = val
        this.getData()
      },
      sortChange: function ({column, prop, order}) { // 排序改变
        if (prop === this.orderInfo.prop && order === this.orderInfo.order) {
          return
        }
        this.orderInfo.prop = prop
        this.orderInfo.order = order
        this.resetPageInfo()
        this.getData()
      }
    }
  }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
