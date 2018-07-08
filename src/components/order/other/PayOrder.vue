<template>
  <div>
  <el-dialog title="订单支付" width="60%" :visible="showDialog"
             @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @close="reset"
             @open="show">
    <el-form :form="form" :model="form" ref="form" label-position="right" style="line-height: 34px;">
      <div style="margin-top:0;">
        <span>订单号:{{orderInfo.order_id}}</span> <span style="display: inline-block;margin-left:5%;">订单状态：{{orderInfo.order_status}}</span>
        <span style="display: inline-block;margin-left:5%;">下单时间:{{orderInfo.create_time}}</span>
      </div>
      <div>
        <span style="display: inline-block;">{{orderInfo.business_name}}[{{orderInfo.business_info_id}}]</span> <span>{{orderInfo.address}}</span>
        <span style="display: inline-block;margin-left: 5%;">联系人：{{businessUser.name}}</span> <span
        style="display: inline-block;margin-left: 5%;">联系电话：{{businessInfo.phone}}</span>
      </div>
      <div>
        <span>销售：{{orderInfo.a_user_sales}}</span>
      </div>
      <div>
        <span style="display: inline-block;color:red;">总价：￥{{allTotalCost}}</span> <span
        style="display: inline-block;margin-left:5%;">付款状态：未付</span>
      </div>
      <div>
        <span style="color:red;">实收：￥{{reallyPayMoney}}</span>
      </div>
    </el-form>

    <el-button style="margin-top:26px;" type="info" size="small" @click="addPayMoney">新增付款</el-button>
    <div class="pay-order-item-header">
      <ul>
        <li>金额</li>
        <li>支付方式</li>
        <li>支付时间</li>
        <li>凭证</li>
        <!--<li>操作</li>-->
      </ul>
    </div>
    <el-container class="pay-order-item" v-for="(payOrderInfo, index) in payOrderInfos" :key="index">
      <el-container>
        <el-form style="width:96%;">
          <ul style="display: flex;width:100%;">
            <li style="flex:1;"><span>{{payOrderInfo.pay_the_money}}</span></li>
            <li style="flex:1;"><span>{{payOrderInfo.pay_of_type === 0 ? '微信支付' : (payOrderInfo.pay_of_type === 1 ? '支付宝付款' : '银行转账')}}</span>
            </li>
            <li style="flex:1;"><span>{{payOrderInfo.pay_of_time}}</span></li>
            <li style="flex:1;"><span style="cursor:pointer;display: inline-block;color:#5AABFF;" @click="reviewPayImg(payOrderInfo.pay_of_evidence)">查看支付凭证</span></li>
            <!--<li style="flex:1;"><span>修改</span></li>-->
          </ul>
        </el-form>
      </el-container>
    </el-container>
    <span slot="footer">
       <el-button type="primary" @click="cancelAdd" size="mini">确认</el-button>
       <!--<el-button @click="cancelAdd" size="mini">取消</el-button>-->
    </span>
    <component :is="editCompName" :showDialog2.sync="showAddPayOrder" :editRowId="editRowId" :orderInfo="orderInfo" :payOrderInfo2="payOrderInfo2"></component>
  </el-dialog>
    <component :is="editCompName" :showDialog3.sync="showBigImage" :imgUrl="bigImgUrl" :title="payTitle"></component>
  </div>
</template>

<script>
  import bus, {payOrderInfo} from '../../../common/bus'

  export default {
    components: {
      addOrEditPayOrder: resolve => {
        require(['./AddOrEditPayOrder.vue'], resolve)
      },
      bigImage: resolve => {
        require(['./BigImage.vue'], resolve)
      }
    },
    created: function () {
      bus.$on(payOrderInfo.search, (searchData) => { // 监听外部查询数据事件
      })
      bus.$on(payOrderInfo.showAddOrEdit, (searchData) => {
        this.show()
        this.successMsg('添加成功')
      })
    },
    name: 'delivery',
    data: function () {
      return {
        showBigImage: false,
        bigImgUrl: '',
        payTitle: '支付凭证',
        form: {
          products: []
        },
        payOrderInfo2: {
          order_id: '',
          sale_id: 0,
          user_id: 0
        },
        allTotalCost: 0,
        businessInfo: {},
        businessUser: {},
        reallyPayMoney: 0,
        payOrderInfos: [],
        showAddPayOrder: false,
        editCompName: ''
      }
    },
    props: ['showDialog', 'editRowId', 'orderInfo'],
    mounted: function () {
      this.show()
    },
    methods: {
      reviewPayImg: function (bigImgUrl) {
        this.editCompName = 'bigImage'
        this.bigImgUrl = bigImgUrl
        this.showBigImage = true
      },
      reset: function () {
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
      submitBefore: function () { // 表单提交之前验证
        let flag = false
        if (this.form.products !== null && this.form.products !== '' && this.form.products.length > 0) { // 判断添加的商品是否为null
          let serial = 0
          for (var index in this.form.products) {
            serial = 1 + parseInt(index)
            if (!/^\+?[1-9][0-9]*$/.test(this.form.products[index].actual_send_goods_num)) { // 验证输入的值是否为非0的正整数
              this.warningMsg('第' + serial + '个商品的数量输入有误！')
              flag = true
            }
            if (parseInt(this.form.products[index].stock) < parseInt(this.form.products[index].actual_send_goods_num)) {
              this.warningMsg('第' + serial + '个商品的实发数量大于库存！')
              flag = true
            }
          }
        }
        return flag
      },
      submitAddAndEdit: function () {
        if (this.submitBefore()) {
          return false
        }
        this.$http.post('/manage/order/save', Object.assign({}, this.form, {
          'products': JSON.stringify(this.form.products),
          'orderId': this.editRowId
        })).then(
          (response) => {
            this.$http.post('/manage/order/setStatus', {'isNext': 1, 'orderId': this.editRowId}).then(
              (response) => {
                this.$emit('update:showDialog', false)
                if (this.editRowId) {
                  bus.$emit(payOrderInfo.search, Object.assign({}, this.orderInfo))
                }
              }
            )
          }
        )
      },
      show: function () { // 显示订单数据
        this.reset()
        this.$http.post('/manage/order/getLogisticsCost', {
          'orderId': this.orderInfo.order_id,
          'businessUserId': this.orderInfo.business_user_id
        }).then((response) => {
          this.allTotalCost = response.data[0]
          this.businessInfo = response.data[1]
          this.businessUser = response.data[2]
          this.reallyPayMoney = response.data[3]
          this.payOrderInfos = response.data[4]
          if (this.allTotalCost === this.reallyPayMoney) {
            this.$http.post('/manage/order/updatePayStatusByOrderId', {'orderId': this.orderInfo.order_id}).then((response) => {
              this.$emit('update:showDialog', false)
              bus.$emit(payOrderInfo.search, Object.assign({}, this.orderInfo))
            })
          }
        }).catch((response) => {
          this.$emit('update:showDialog', false)
          bus.$emit(payOrderInfo.errorRefresh, Object.assign({}, this.orderInfo))
        })
      },
      cancelAdd: function () {
        this.$emit('update:showDialog', false)
      },
      addPayMoney: function () {
        this.editCompName = 'addOrEditPayOrder'
        this.rowId = null
        this.payOrderInfo2.order_id = this.orderInfo.order_id
        this.payOrderInfo2.user_id = this.businessUser.id
        this.payOrderInfo2.sale_id = this.businessUser.a_user_sales_id
        this.payOrderInfo2.allTotalCost = this.allTotalCost
        this.payOrderInfo2.reallyPayMoney = this.reallyPayMoney
        this.showAddPayOrder = true
      }
    }
  }
</script>

<style scoped>
  li {
    list-style-type: none;
  }

  .pay-order-item-header {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: center;
  }

  .pay-order-item-header ul {
    flex: 1;
    display: flex;
    height: 32px;
    line-height: 32px;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    background-color: #e3e3e3;
  }

  .pay-order-item-header ul li {
    flex: 1;
    color: #666;
  }
</style>
