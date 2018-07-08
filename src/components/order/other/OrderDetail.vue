<template>
  <el-dialog title="订单详细" width="80%" :visible="showDialog"
             @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @close="reset"
             @open="show">
    <el-form :form="form" :model="form" ref="form" label-width="100px" label-position="left">
      <!--
      订单号：订单状态：下单时间：完成时间
      付款状态：应收：实收：支付时间：支付方式：
      配送方式：接货/司机信息：车牌：收货地址：
      客户：联系人：联系电话
      -->
      <el-row>
        <el-col :span="8">
          <el-form-item size="mini" label="订单号:">
            {{typeof (orderInfo) === 'undefined'? '' : orderInfo.order_id}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="订单状态:">
            {{form.order_status == null? '暂无': orderStatusStore.orderStatusList[form.order_status]}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="下单时间:">
            {{form.create_time == null? '暂无': form.create_time}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="完成时间:">
            {{form.create_time == null? '暂无': form.create_time}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="付款状态:">
            {{typeof (orderInfo) === 'undefined' ? '' : (orderInfo.pay_status === 0 ? '未付款' : (orderInfo.pay_status === 5 ? '已支付' : '已退款'))}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="应收总额:" style="color:red;">
            <!--￥{{form.pay_reality_need_money == null? '0': (typeof (form.pay_reality_need_money) == 'undefined' ? '0' : form.pay_reality_need_money)}}-->
            ￥{{form.pay_all_money == null? '0': (typeof (form.pay_all_money) == 'undefined' ? '0' : form.pay_all_money)}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="实收总额:" style="color:red;">
            ￥{{form.pay_total_money == null? 0: form.pay_total_money}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="支付时间:" >
            {{orderDetailElse.payOfTime}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="支付方式:">
            {{orderDetailElse.payOfType}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="配送方式:" prop="group_key">
            {{form.delivery_type == null? '暂无': shipmentTypeStore.shipmentTypeList[form.delivery_type]}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="接货/司机:" prop="group_key">
            {{form.delivery_info == null? '暂无': form.delivery_info}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="车牌:" prop="group_key">
            {{form.license_plate_number == null? '暂无': form.license_plate_number}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="收货地址">
            {{form.buy_address == null? '暂无': form.buy_address}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="客户">
            {{form.business_name}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="联系人">
            {{form.business_contacts == null? '暂无': form.business_contacts}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="联系电话">
            {{form.contactPhone == null? '暂无': form.contactPhone}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-table :data="form.products" style="width:100%;" @row-dblclick="edit">
        <el-table-column label="商品[规格]">
          <template slot-scope="scope">
            <span >{{ scope.row.product_name }}[{{scope.row.product_standard_name}}]</span>
          </template>
        </el-table-column>
        <el-table-column label="单价(下单/实售)">
          <template slot-scope="scope">
            <div>
              <span>￥{{scope.row.original_price}}</span>/￥
              <span v-show="scope.row.rowEdit !== 1">
              {{scope.row.sell_price}}
              </span>
              <el-input v-model="scope.row.sell_price" v-show="scope.row.rowEdit === 1" style="display: inline-block;width:100px;" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量(下单/实收)">
          <template slot-scope="scope">
            <div>
              <span>{{scope.row.num}}</span>/
              <span v-show="scope.row.rowEdit !== 1">{{scope.row.actual_deliver_num === null ? 0 :scope.row.actual_deliver_num}}</span>
              <el-input v-model="scope.row.actual_deliver_num" v-show="scope.row.rowEdit === 1" style="display: inline-block;width:100px;" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="汇总(下单/应收)">
          <template slot-scope="scope">
            <span>￥{{scope.row.num*scope.row.original_price}} / ￥{{(scope.row.actual_deliver_num === null ? 0 :scope.row.actual_deliver_num)*(scope.row.sell_price)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注信息">
          <template slot-scope="scope">
            <span >{{ scope.row.buy_remark }}</span>
          </template>
        </el-table-column>
        <el-table-column style="width:40px;" :span="1">
          <template slot-scope="scope">
            <div v-show="scope.row.rowEdit ===1 " >
              <el-button type="primary" size="mini" @click="saveEdit(scope.row)">确定</el-button>
              <el-button size="mini" @click="cancelEdit(scope.row)">取消</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer">
       <!--<el-button type="primary" size="mini">确认</el-button>-->
       <el-button @click="$emit('update:showDialog', false)" size="mini" type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {SHIPMENT_TYPE_LIST, ORDER_STATUS_LIST} from '../../../store/action-types'
  export default {
    name: 'add-or-edit',
    props: ['showDialog', 'editRowId', 'orderInfo'],
    data: function () {
      return {
        isEdit: false,
        rowEdit: false,
        orderDetailElse: {
          payOfTime: null,
          payOfType: null
        },
        form: {
          products: [
          ]
        },
        resetForm: {
          products: [
          ]
        },
        timeout: null,
        on_off: {
          isSelectProduct: false,
          isAddProduct: false,
          tempProductInfoLoading: false
        },
        tempProduct: {
        },
        tempProductsInfo: [
        ],
        tempProductStandardsInfo: [
          {}
        ],
        tempCustomerInfo: [
        ]
      }
    },
    mounted: function () {
      this.show()
    },
    computed: mapState({
      'shipmentTypeStore': 'shipmentType',
      'orderStatusStore': 'orderStatus'
    }),
    methods: {
      ...mapActions({
        getShipmentTypeList: SHIPMENT_TYPE_LIST,
        getOrderStatus: ORDER_STATUS_LIST
      }),
      edit: function (row) {
        this.$set(row, 'rowEdit', 1)
      },
      cancelEdit: function (row) {
        this.$set(row, 'rowEdit', 0)
      },
      saveEdit: function (row) {
        if (!/^\+?[0-9][0-9]*$/.test(row.actual_deliver_num)) {
          this.$message({type: 'warning', message: '请输入正确的实收数量！'})
          return false
        }
        if (!/^[0-9]+(.[0-9]{1})?$/.test(row.sell_price)) {
          this.$message({type: 'warning', message: '请输入正确的实售价！'})
          return false
        }
        let editData = Object.assign({id: row.id, sell_price: row.sell_price, actual_deliver_num: row.actual_deliver_num})
        this.$http.post('/manage/order/updateOrderDetailElse', editData).then((response) => {
          this.show()
          this.$message({type: 'success', message: '修改成功！'})
        })
      },
      show: function () { // 显示订单数据
        this.getShipmentTypeList()
        this.reset()
        // 最好重新取数据
        this.$http.post('/manage/order/getOtherDataInfo', {orderId: this.editRowId}).then((response) => {
          this.form = response.data
        })
        this.init()
      },
      init: function () {
        this.$http.post('/manage/order/getOrderDetailElse', {orderId: this.editRowId}).then((response) => {
          this.orderDetailElse.payOfTime = response.data['payOfTime']
          this.orderDetailElse.payOfType = response.data['payOfType']
        })
      },
      reset: function (form) { // 重置信息
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
        this.form = Object.assign({}, this.resetForm)
        this.form.products = []
        this.on_off.isSelectProduct = false
        this.tempProductStandardsInfo = []
      },
      addProductCancel: function () { // 添加商品选取消
        this.on_off.isAddProduct = false
        this.addProductReset()
      },
      createFilter: function (inputContent) { // 设置拦截规则  类似于equals
        return (myContent) => {
          if (!myContent.value) {
            return
          }
          // 这里是根据获取值的value来判断和输入值是否匹配的,并且组件的赋值才做也需要value才能赋值
          return (myContent.value.toLowerCase().indexOf(inputContent.toLowerCase()) === 0)
        }
      },
      selectCustomer: function (customerId) { // 选中客户后加载客户信息
        this.$http.post('/manage/order/getCustomerInfo', {'customerId': customerId}).then(
          (response) => {
            this.form = Object.assign({}, this.form, response.data)
          }
        )
      },
      calTotalNeedPayMoney: function () { // 计算总价格
        let totalMoney = 0
        if (this.form.products !== null && this.form.products !== '' && this.form.products.length > 0) { // 判断添加的商品是否为null
          for (var index in this.form.products) {
            if (!/^\+?[1-9][0-9]*$/.test(this.form.products[index].num)) {
              this.form.products[index].num = 1
            }
            if (!/^[0-9]+(.[0-9]{1})?$/.test(this.form.products[index].sell_price)) {
              this.form.products[index].sell_price = 1.0
            }
            totalMoney += ((this.form.products[index].num * 10) * this.form.products[index].sell_price) / 10.0
          }
        }
        return totalMoney
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
      myTrim: function (trimVal) {
        return trimVal.replace(/^\s+|\s+$/gm, '')
      },
      checkIsNull: function (value, showMsg) { // 判断是否为空,参数value是要判断的值，参数showMsg是错误之后要提示的值
        let flag = true
        if (value === null || value === '') {
          this.warningMsg(showMsg)
          flag = false
        }
        return flag
      }
    }
  }
</script>

<style scoped>
</style>
