<template>
  <el-dialog title="订单支付" width="60%" :visible="showDialog" @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @close="reset" @open="show">
    <el-form :model="form" label-width="100px" label-position="right">
      <el-row>
        <el-col :span="8">
          <el-form-item size="mini" label="客户">
            <el-select v-model="form.business_user_id" @change="selectCustomer" filterable placeholder="请选择">
              <el-option v-for="item in tempCustomerInfo" :key="item.id" :label="item.business_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="地址">
            {{form.address}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item size="mini" label="联系人">
            {{form.bName}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="联系电话">
            {{form.phone}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="欠款销售">
            {{form.aName}}
          </el-form-item>
        </el-col>
      </el-row>
      <hr style="border-color: #888888">
      <el-row>
        <el-col :span="6">
          <el-form-item size="mini" label="收款金额">
            <el-input v-model="form.payMoney" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :push="1">
          <el-form-item size="mini" label="支付方式">
            <el-radio-group v-model="form.payType">
              <el-radio :label="0">微信</el-radio>
              <el-radio :label="1">支付宝</el-radio>
              <el-radio :label="2">银行卡</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="收款时间">
            <el-date-picker v-model="form.payDate" type="datetime" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-button type="primary" size="mini" @click="submitPayApportion">订单分摊</el-button>
    <strong v-if="surplusPrice>0" style="color: red">超出金额: {{surplusPrice}}</strong>
    <el-table :data="tableData">
      <el-table-column prop="create_time" width="160" label="订单日期"></el-table-column>
      <el-table-column prop="nick_name" label="销售"></el-table-column>
      <el-table-column prop="order_id" label="订单号"></el-table-column>
      <el-table-column prop="order_status" label="订单状态"></el-table-column>
      <el-table-column prop="pay_all_money" label="订单应收"></el-table-column>
      <el-table-column prop="pay_total_money" label="订单实收"></el-table-column>
      <el-table-column prop="arrearage" label="欠款"></el-table-column>
    </el-table>
    <span slot="footer">
       <el-button @click="" size="mini">取消</el-button>
       <el-button type="primary" @click="saveApportionInfo" size="mini">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import bus, {payOrderInfo} from '../../../common/bus'
  import {dateFmt, deepCopy} from '../../../common/utils.js'

  export default {
    components: {
      addOrEditPayOrder: resolve => {
        require(['./AddOrEditPayOrder.vue'], resolve)
      }
    },
    created: function () {
      bus.$on(payOrderInfo.search, (searchData) => { // 监听外部查询数据事件
      })
    },
    props: ['showDialog', 'editRowId', 'orderInfo'],
    name: 'delivery',
    data: function () {
      return {
        form: {},
        tempCustomerInfo: {},
        tableData: [],
        tempTableData: [],
        customerId: '',
        surplusPrice: 0
      }
    },
    mounted: function () {
      this.show()
      this.init()
    },
    methods: {
      init: function () {
        // 初始化订单数据
        this.$http.post('/manage/order/getCustomers').then(
          (response) => {
            console.log(response)
            this.tempCustomerInfo = response.data
          }
        )
      },
      show: function () { // 显示订单数据
        this.reset()
      },
      reset: function () {
        if (this.$refs['form']) { // 重置校验错误
          this.$refs['form'].resetFields()
        }
        try {
          this.form = Object.assign({}, this.resetForm)
          this.tempTableData = []
        } catch (e) {
        }
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
      selectCustomer: function (customerId) { // 选中客户后加载客户信息
        console.log('customerId:' + customerId)
        // 加载内容
        this.$http.post('/manage/order/getCustomerOrderInfo', {customerId: customerId}).then(
          (response) => {
            this.form = Object.assign({}, response.data[0], this.form)
          }
        )
        this.selectPayOrder(customerId)
      },
      selectPayOrder: function (customerId) { // 加载需要付款的订单列表
        this.$http.post('/manage/order/getCustomerPayOrderInfo', {customerId: customerId}).then(
          (response) => {
            this.tableData = response.data
            this.tempTableData = response.data
            console.log('tempTableData')
            this.customerId = customerId
          }
        )
      },
      submitBefore: function () { // 表单提交前的校验
        console.log(/^\+?[1-9][0-9]*$/.test('+' + this.form.payMoney))
        if (!/^\+?[1-9][0-9]*$/.test(this.form.payMoney) || this.form.payMoney < 0) {
          return false
        }
        return true
      },
      submitPayApportion: function () { // 支付分摊(模拟)
        if (!this.submitBefore()) {
          return
        }
        this.tableData = deepCopy(this.tempTableData)
        this.surplusPrice = 0
        let price = this.form.payMoney
        for (let order of this.tableData) {
          if ((price -= order.arrearage) > 0) {
            // 完整还款
            order.pay_total_money = order.pay_all_money
            order.arrearage = 0
          } else {
            // 部分还款或无金额
            order.pay_total_money += price + order.arrearage
            order.arrearage = order.pay_all_money - order.pay_total_money
            return
          }
        }
        if (price > 0) {
          this.surplusPrice = price
        }
      },
      saveApportionInfo: function () { // 真实分摊
        if (!this.submitBefore()) {
          return
        }
        this.form.payDate = dateFmt(this.form.payDate)
        this.$http.post('/manage/order/saveApportionInfo', Object.assign({}, this.form, {'customerId': this.customerId})).then(
          (response) => {
            this.successMsg('成功分摊')
          }
        )
      }
    }
  }
</script>

<style scoped>
</style>
