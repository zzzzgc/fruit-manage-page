<template>
  <div class="order-content">
    <div class="table-list action">
      <el-button type="primary" size="small" @click="allSetStatus">批量确认</el-button>
      <el-button type="primary" size="small" @click="add">新增订单</el-button>
      <el-button type="primary" size="small" @click="showPayBusiness">商家收款</el-button>

      <!--<el-row :gutter="10">-->
      <span style="border: 1px solid #eeeeee;padding: 8px 0 8px 5px;border-radius: 4px">
        <el-date-picker
          v-model="inputExcelDate"
          type="date"
          size="mini"
          placeholder="请选择导出订单的日期,默认为当前日期"
          format="yyyy年MM月dd日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-dropdown @command="exportExcel">
        <span class="el-dropdown-link">
          导出订单<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">订单导出</el-dropdown-item>
            <el-dropdown-item command="2" divided>采购计划单导出</el-dropdown-item>
            <el-dropdown-item command="3" divided>商家出货单导出</el-dropdown-item>
            <el-dropdown-item command="4">商家收款单导出</el-dropdown-item>
          </el-dropdown-menu>
          或者
          <el-upload style="display:inline-block;margin-left:10px;"
                     class="upload-demo"
                     :action="_uploadFilePath"
                     :on-change="handleChange"
                     :before-upload="uploadBefore"
                     :show-file-list="false"
                     :file-list="fileList">
            <el-button size="small" type="primary">临时导入订单信息</el-button>
          </el-upload>
        </el-dropdown>
        </span>
      <!--</el-row>-->
      <!--<el-button type="info" size="small" @click="outExcel">订单导出</el-button>-->
    </div>
    <el-container class="order-item" v-for="(order, index) in tableData" :key="index">
      <el-header class="order-item-header" style="height: 40px;">
        <!--<ui>-->
        <!--<li>{{order.create_time}}</li>-->
        <!--<li>订单号:{{order.order_id}}</li>-->
        <!--<li>{{order.business_name}}[{{order.business_info_id}}]</li>-->
        <!--<li>店铺地址:{{order.address}}</li>-->
        <!--<li>应收总额:{{order.pay_need_money}}</li>-->
        <!--<li>公司货损额:暂无 修改</li>-->
        <!--<li>最近操作时间:{{order.update_time}}</li>-->
        <!--<li>销售:{{order.a_user_sales_id}}</li>-->
        <!--</ui>-->
        <span>创建时间:{{order.create_time}}</span>
        <span>订单号:{{order.order_id}}</span>
        <span>店铺名[店铺编码]:{{order.business_name}}[{{order.business_info_id}}]</span>
        <span>收货地址:{{order.address}}</span>
        <!--<span>付款状态:{{order.order_status}}</span>-->
        <span>付款状态:{{order.pay_status == 0 ? '未付款' : (order.pay_status == 5 ? '已支付':'已退款')}}</span>
        <span>实付:{{order.pay_total_money}}</span>
      </el-header>

      <el-container>
        <el-aside class="order-item-aside">
          <el-form class="order-item-aside-form" label-position="left" inline>
            <el-form-item class="order-item-aside-form-item" label="订单状态"><span>{{order.order_status}}</span></el-form-item>
            <el-form-item class="order-item-aside-form-item" label="下单总额"><span>{{order.pay_need_money}}</span></el-form-item>
            <el-form-item class="order-item-aside-form-item" label="应收总额"><span>{{order.pay_all_money}}</span></el-form-item>
            <el-form-item class="order-item-aside-form-item" label="公司货损额"><span>暂无</span></el-form-item>
            <el-form-item class="order-item-aside-form-item" label="最近操作时间"><span>{{order.update_time}}</span></el-form-item>
            <el-form-item class="order-item-aside-form-item" label="销售"><span>{{order.a_user_sales}}</span></el-form-item>
            <div class="order-item-aside-form-button">
              <el-button type="primary" class="long-button" size="mini" @click="edit(order.order_id)">修改订单</el-button>
              <div>
                <el-button v-if="$route.params.orderStatus=='5'" type="primary" class="long-button" size="mini" @click="delivery(order)">配货</el-button>
              </div>
              <div>
                <!-- 未配送（已配货） -->
                <el-button v-if="$route.params.orderStatus =='10'" type="primary" class="long-button" size="mini" @click="deliveryAfter(order)">配送</el-button>
              </div>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-button v-if="$route.params.orderStatus == '25'" type="primary" size="mini" style="width: 100%;" @click="showPayOrder(order)">订单收款</el-button>
                </el-col>
                <el-col :span="6">
                  <el-button v-if="$route.params.orderStatus == '0'" type="primary" size="mini" style="width: 100%" @click="setStatus(1, order.order_id)">确认</el-button>
                  <!--<el-button v-if="$route.params.orderStatus == '25'" type="primary" size="mini" style="width: 100%" @click="showSureDialog(order)">确认</el-button>-->

                  <el-dialog
                    title="订单是否确认支付？"
                    :center="true"
                    :visible.sync="on_off.showPayMoneyDialog"
                    width="50%"
                    :before-close="handleClose" style="text-align: left;">
                    <div style="margin-top:0;">
                      <span>订单号:{{order.order_id}}</span> <span style="display: inline-block;margin-left:5%;">{{order.business_name}}[{{order.business_info_id}}]</span> <span>{{order.address}}</span>
                    </div>
                    <div>
                      订单状态：<span>{{order.order_status}}</span> <span style="display: inline-block;margin-left: 5%;padding-right: 5%;margin-top:30px;color:red;">总价：￥{{allTotalCost}}</span> 付款状态：未付
                    </div>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="on_off.showPayMoneyDialog = false">取 消</el-button>
                      <el-button type="primary" @click="toPayMoney(order)">确 定</el-button>
                    </span>
                  </el-dialog>

                  <el-button v-if="$route.params.orderStatus == '5' || $route.params.orderStatus == '10' || $route.params.orderStatus == '15' || $route.params.orderStatus == '20'" type="primary" size="mini" style="width: 100%"
                             @click="resetStatusToWaitVerify($route.params.orderStatus, order.order_id)">重置
                  </el-button>
                </el-col>
                <el-col :span="12">
                  <el-button type="info" v-if="$route.params.orderStatus != '30'" size="mini" @click="showOrderDetail(order)" style="width: 100%">订单详细</el-button>
                </el-col>
                <el-button type="info" v-if="$route.params.orderStatus == '30'" size="mini" @click="showOrderDetail(order)" style="width: 100%">订单详细</el-button>
                <el-col :span="6" v-if="$route.params.orderStatus!='15' && $route.params.orderStatus!='20' && $route.params.orderStatus!='25' && $route.params.orderStatus!='30' && $route.params.orderStatus!='50'">
                  <el-button type="danger" size="mini" @click="setStatus(0, order.order_id)" style="width: 100%">删除</el-button>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </el-aside>
        <el-main style="padding: 0">
          <el-table :data="order.products" highlight-current-row>
            <el-table-column prop="product_name" label="商品"/>
            <el-table-column prop="product_standard_name" label="规格"/>
            <el-table-column prop="original_price" label="报价"/>
            <el-table-column prop="sell_price" label="下单单价"/>
            <el-table-column prop="num" label="下单数量"/>
            <el-table-column prop="total_pay" label="商品总额"/>
            <el-table-column>
              <template slot-scope="scope">
                <el-button v-show="$route.params.orderStatus === '15' || $route.params.orderStatus === '20'
                  || $route.params.orderStatus === '30'" type="primary" size="mini" @click="showBreakageDiaglog(scope.row, order)">报损
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>

    </el-container>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageInfo.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalRec" style="text-align: center;">
    </el-pagination>
    <component :is="editCompName" :showDialog.sync="on_off.showEdit" :editRowId="editRowId"></component>
    <component :is="editCompName" :showDialog.sync="on_off.showDelivery" :editRowId="editRowId" :orderInfo="orderInfo"></component>
    <component :is="editCompName" :showDialog.sync="on_off.showDeliveryAfter" :editRowId="editRowId" :orderInfo="orderInfo"></component>
    <component :is="editCompName" :showDialog.sync="on_off.showPayMoneyDialog2" :editRowId="editRowId" :orderInfo="orderInfo"></component>
    <component :is="editCompName" :showDialog.sync="on_off.showOrderDetail" :editRowId="editRowId" :orderInfo="orderInfo"></component>
    <component :is="editCompName" :showDialog.sync="on_off.showBreakage" :editRowId="editRowId" :orderDetail="orderDetail" :productStandardId="productStandardId" :orderInfo="orderInfo"></component>
    <!--<component :is="addAndEdit.editCompName" :showDialog.sync="addAndEdit.showEdit" :editRowId="addAndEdit.editRowId"></component>-->
  </div>
</template>
<script>
  import {localStorageKeys} from '../../../common/const.js'
  import {mapState, mapActions} from 'vuex'
  import {ORDER_STATUS_LIST} from '../../../store/action-types'
  import bus, {orderOther, payOrderInfo} from '../../../common/bus.js'
  // import { dateFmt } from '../../../common/utils.js'

  export default {
    created: function () {
      bus.$on(orderOther.search, (searchData) => { // 监听外部查询数据事件
        this.search(searchData)
      })
      bus.$on(orderOther.delivery, (orderInfo) => {
        this.deliveryAfter(orderInfo)
      })
      bus.$on(orderOther.deliveryAfter, () => {
        this.getData()
      })
      bus.$on(orderOther.edit, () => { // 监听数据更改后的列表刷新（刷新当前页）
        this.getData()
      })
      bus.$on(orderOther.add, () => { // 监听数据添加后的列表刷新
        this.getData()
      })
      bus.$on(payOrderInfo.errorRefresh, () => {
        this.getData()
      })
      bus.$on(payOrderInfo.search, () => {
        this.getData()
      })
      bus.$on(payOrderInfo.showAddOrEdit, () => {
        this.getData()
      })
      this.getAllOrderStatus()
    },
    watch: {
      '$route': function (to, from) {
        this.getData()
        this.getAllOrderStatus()
        // 对路由变化作出响应...
      }
    },
    // beforeRouteUpdate (to, from, next) {
    //   console.log('to')
    //   console.log(to)
    //
    //   console.log('from')
    //   console.log(from)
    //
    //   console.log('next')
    //   console.log(next)
    //   // react to route changes...
    //   // don't forget to call next()
    // },
    components: {
      orderEdit: resolve => {
        require(['./AddOrEdit'], resolve)
      },
      orderDelivery: resolve => { // 订单配货页面
        require(['./Delivery'], resolve)
      },
      orderDeliveryAfter: resolve => { // 订单配送页面
        require(['./DeliveryAfter'], resolve)
      },
      payOrder: resolve => {
        require(['./PayOrder.vue'], resolve)
      },
      payBusiness: resolve => {
        require(['./PayBusiness'], resolve)
      },
      orderDetail: resolve => {
        require(['./OrderDetail'], resolve)
      },
      breakage: resolve => {
        require(['./Breakage'], resolve)
      }
    },
    computed: mapState({
      'orderStatusStore': 'orderStatus'
    }),
    data: function () {
      let pageSize = localStorage.getItem(localStorageKeys.orderPageSize)
      return {
        pageInfo: {
          pageNum: 1,
          totalRec: 0,
          pageSize: pageSize == null ? 10 : parseInt(pageSize)
        },
        allTotalCost: 0,
        editCompName: '', // 用于动态加载编辑组件
        on_off: {
          showEdit: false, // 是否展示编辑弹窗
          showDelivery: false, // 是否展示配货页面
          showDeliveryAfter: false, // 是否展示配送页面
          showPayMoneyDialog: false, // 是否展示编辑弹窗
          showPayMoneyDialog2: false,
          showOrderDetail: false, // 是否展示订单详细
          showBreakage: false
        },
        inputExcelDate: '',
        editRowId: null, // 编辑的记录ID,
        productStandardId: 0,
        orderInfo: {},
        orderDetail: {},
        sortInfo: {prop: 'o.create_time', order: 'descending'},
        searchData: {},
        fileList: [],
        tableData: [
          {
            order_id: '20171201426577-00014567',
            order_status: '待确认',
            pay_need_money: '32456.00',
            pay_success: '未付款',
            pay_total_money: '0.00',
            pay_reality_need_money: '0.00',
            create_time: '1997-01-21 08:15:46',
            update_time: '2018-01-21 08:15:46',
            a_user_sales: '李华杰',
            business_name: '纯果乐园',
            business_info_id: '1112008',
            address: '湖南省长沙市某某路某某街几几号几几铺',
            pay_status: 5,
            products: [
              {
                product_id: 123,
                original_price: '125.00',
                sell_price: '122.00',
                num: '12',
                total_pay: '1464.00'
              },
              {
                product_id: 234,
                original_price: '12.00',
                sell_price: '10.00',
                num: '12',
                total_pay: '120.00'
              },
              {
                product_id: 345,
                original_price: '125.00',
                sell_price: '100.00',
                num: '12',
                total_pay: '1200.00'
              }
            ]
          },
          {
            order_id: '13',
            order_status: '待确认',
            pay_need_money: '32456.00',
            pay_success: '未付款',
            pay_total_money: '0.00',
            create_time: '1997-01-21 08:15:46',
            update_time: '2018-01-21 08:15:46',
            a_user_sales: '李华杰',
            business_name: '纯果乐园',
            business_info_id: '1112008',
            address: '湖南省长沙市某某路某某街几几号几几铺',
            products: [
              {
                product_id: 123,
                original_price: '125.00',
                sell_price: '122.00',
                num: '12',
                total_pay: '1464.00'
              },
              {
                product_id: 234,
                original_price: '12.00',
                sell_price: '10.00',
                num: '12',
                total_pay: '120.00'
              },
              {
                product_id: 345,
                original_price: '125.00',
                sell_price: '100.00',
                num: '12',
                total_pay: '1200.00'
              }
            ]
          },
          {
            order_id: '15',
            order_status: '待确认',
            pay_need_money: '32456.00',
            pay_success: '未付款',
            pay_total_money: '0.00',
            create_time: '1997-01-21 08:15:46',
            update_time: '2018-01-21 08:15:46',
            a_user_sales: '李华杰',
            business_name: '纯果乐园',
            business_info_id: '1112008',
            address: '湖南省长沙市某某路某某街几几号几几铺',
            products: [
              {
                product_id: 123,
                original_price: '125.00',
                sell_price: '122.00',
                num: '12',
                total_pay: '1464.00'
              },
              {
                product_id: 234,
                original_price: '12.00',
                sell_price: '10.00',
                num: '12',
                total_pay: '120.00'
              },
              {
                product_id: 345,
                original_price: '125.00',
                sell_price: '100.00',
                num: '12',
                total_pay: '1200.00'
              }
            ]
          }
        ]
      }
    },
    methods: {
      getData: function () { // 获取服务器数据
        this.$http.post('/manage/order/getOtherData', Object.assign({}, {order_status: this.$route.params.orderStatus}, this.searchData, this.pageInfo, this.sortInfo)).then((response) => {
          console.log(response.data)
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
      add: function () { // 添加记录
        this.editCompName = 'orderEdit'
        this.editRowId = null
        this.on_off.showEdit = true
      },
      delivery: function (order) { // 配货
        this.editCompName = 'orderDelivery'
        // 180228045451-100059282 180322045035-100004869   20180327-1
        this.editRowId = order.order_id
        this.orderInfo = order
        this.on_off.showDelivery = true
      },
      deliveryAfter: function (order) { // 配送
        this.editCompName = 'orderDeliveryAfter'
        this.editRowId = null
        this.orderInfo = order
        this.on_off.showDeliveryAfter = true
      },
      edit: function (id) { // 编辑某条记录
        this.editCompName = 'orderEdit'
        this.editRowId = id
        this.on_off.showEdit = true
      },
      showPayOrder: function (order) {
        this.editCompName = 'payOrder'
        this.orderInfo = order
        this.on_off.showPayMoneyDialog2 = true
      },
      showPayBusiness: function (order) {
        this.editCompName = 'payBusiness'
        this.orderInfo = order
        this.on_off.showPayMoneyDialog2 = true
      },
      showOrderDetail: function (order) {
        this.editCompName = 'orderDetail'
        this.orderInfo = order
        this.editRowId = order.order_id
        this.on_off.showOrderDetail = true
      },
      showBreakageDiaglog: function (scope, order) {
        this.editCompName = 'breakage'
        this.orderInfo = order
        this.orderDetail = scope
        this.editRowId = order.order_id
        this.productStandardId = scope.product_standard_id
        this.on_off.showBreakage = true
      },
      search: function (data) { // 点击搜索时执行
        this.resetPageInfo()
        this.searchData = data
        this.getData()
      },
      exportExcel: function (command) { // 导出 指定的excel
        // this.$message('click on item ' + command)
        switch (command) {
          case '1':
            break
          case '2':
            // console.log(dateFmt(new Date()))
            // this.$http.post('/manage/procurement/plan/exportPPlan', {'createTime': dateFmt(new Date())}).then(
            //   (response) => {
            //     location.href = this._downloadFilePath + response.data.zipName
            //   }
            // )
            location.href = this._downloadExcelFilePath + 'getProcurementPlanBilling?createTime=' + this.inputExcelDate
            break
          case '3':
            location.href = this._downloadExcelFilePath + 'getBusinessSendGoodsBilling?createTime=' + this.inputExcelDate
            break
          case '4':
            location.href = this._downloadExcelFilePath + 'getBusinessCollectionBilling?createTime=' + this.inputExcelDate
            break
          default:
            this.$message('click on item ' + command)
        }
      },
      resetPageInfo: function () { // 重置分页参数
        this.pageInfo.totalRec = 0
        this.pageInfo.pageNum = 1
      },
      allSetStatus: function () { // 批量通过
        this.$confirm('此操作将推进所有订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/manage/order/setStatusAll').then(
            (response) => {
              this.successMsg('成功修改所有的订单状态')
            }
          )
          this.getData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      warningMsg: function (msg) {
        this.$message({
          message: msg,
          type: 'warning'
        })
      },
      successMsg: function (msg) {
        this.$message({
          message: msg,
          type: 'success'
        })
      },
      setStatus: function (isNext, id) { // 修改记录的状态( 重点: 1,进入下一个流程,比如待确定订单(5)会进入已确定订单(10)中. 0,删除订单)
        if (isNext) {
          console.log('推进状态的订单' + ':' + id)
        } else {
          console.log('删除' + ':' + id)
        }
        this.$http.post('/manage/order/setStatus', {'isNext': isNext, 'orderId': id}).then(
          (response) => {
            console.log('成功推进状态,id=' + id)
            this.getData()
          }
        )
      },
      showSureDialog: function (order) {
        this.$http.post('/manage/order/getLogisticsCost', {'orderId': order.order_id}).then((response) => {
          this.allTotalCost = response.data[0]
          this.on_off.showPayMoneyDialog = true
        })
      },
      resetStatusToWaitVerify: function (isReset, id) {
        this.$http.post('/manage/order/setRollbackStatus', {'orderId': id}).then(
          (response) => {
            if (isReset === '15') { // 判断是否为已配送状态
              this.$http.post('/manage/order/delLogisticsInfo', {'orderID': id}).then((response) => {
                this.getData()
              })
            } else {
              this.getData()
            }
          }
        )
        this.getData()
      },
      ...mapActions({
        getAllOrderStatus: ORDER_STATUS_LIST
      }),
      handleClose: function (done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {
          })
      },
      toPayMoney: function (order) {
        this.$http.post('/manage/order/updatePayStatus', {'orderId': order.order_id}).then((response) => {
          this.on_off.showPayMoneyDialog = false
          this.getData()
          this.successMsg('确认成功!')
        })
      },
      uploadBefore: function (file) {
        console.log(file)
        const isRightType = file.type.indexOf('application/vnd') === 0
        const isRightSize = file.size / 1024 < 1000
        if (!isRightType) {
          this.$message.error('上传文件必须为xlsx或xls格式!')
        }
        if (!isRightSize) {
          this.$message.error('上传文件大小不能超过 1000kb!')
        }
        return isRightSize && isRightType
      },
      handleChange: function (file, fileList) {
        if (typeof (file.response) !== 'undefined') {
          console.log(file)
          let loading = this.$loading({
            lock: true,
            text: '正在导入历史订单记录,请稍等...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.$http.post('/manage/excel/saveInputOrderInfos', {'fileName': file.response, 'order_cycle_date': this.inputExcelDate}).then(
            (response) => {
              console.log(response)
              if (response != null && response.data != null) {
                let sendMsg = ''
                for (let msg of response.data) {
                  sendMsg += msg + '<br>'
                }
                this.$alert(sendMsg, '警告', {dangerouslyUseHTMLString: true, confirmButtonText: '确定'})
              }
              loading.close()
              this.getData()
              this.successMsg('导入成功!')
            },
            (response) => {
              loading.close()
              this.successMsg('导入失败!')
            }
          ).catch((response) => {
            console.log(response)
            loading.close()
            this.warningMsg('导入失败!')
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .order-content {
    .action {
      padding: 10px;
      background: white;
    }
    .order-item {
      /*margin-bottom: 10px;*/
      .order-item-header {
        background-color: #555555;
        display: flex; /*Flex布局*/
        display: -webkit-flex; /* Safari */
        align-items: center; /*指定垂直居中*/
        justify-content: space-around; /*间隔方式靠墙间隙小靠其他盒子间隙大*/
        flex-flow: row wrap;
        span {
          color: #bfcbd9;
          font-size: 14px;
        }
      }
      .order-item-aside {
        background-color: #ffeeee;
        padding-bottom: 10px;
        .order-item-aside-form {
          display: flex; /*Flex布局*/
          display: -webkit-flex; /* Safari */
          align-items: left; /*指定垂直居中*/
          margin-left: 20px;
          flex-direction: column;
          .order-item-aside-form-button {
            width: 80%;
            .long-button {
              width: 100%;
              margin-bottom: 5px;
              .other-button {
                display: flex; /*Flex布局*/
                display: -webkit-flex; /* Safari */
                flex-flow: row nowrap;
              }
            }
          }
          .order-item-aside-form-item {
            margin: 0px; /*去除.el-form-item带来的影响*/
          }
        }
      }
    }
  }

</style>
