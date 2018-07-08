<template>
  <el-dialog :center="true" title="出库费用" :visible="showDialog"
             @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @close="reset"
             @open="show">
    <el-form :form="logisticInfo" :model="logisticInfo" ref="logisticInfo" label-width="100px" label-position="right">
      <el-form-item label="运费" prop="freight_cost">
        <el-input v-model="logisticInfo.freight_cost"></el-input>
      </el-form-item>
      <el-form-item label="装车费" prop="embarkation_cost">
        <el-input v-model="logisticInfo.embarkation_cost"></el-input>
      </el-form-item>
      <el-form-item label="中转费/短途费" prop="transshipment_cost">
        <el-input v-model="logisticInfo.transshipment_cost"></el-input>
      </el-form-item>
      <el-form-item label="三轮车费" prop="tricycle_cost">
        <el-input v-model="logisticInfo.tricycle_cost"></el-input>
      </el-form-item>
      <el-form-item label="打包费" prop="package_cost">
        <el-input v-model="logisticInfo.package_cost"></el-input>
      </el-form-item>
      <el-form-item label="打包件数" prop="package_num">
        <el-input v-model="logisticInfo.package_num"></el-input>
      </el-form-item>
      <el-form-item label="摘要" prop="abstract">
        <el-input v-model="logisticInfo.abstract"></el-input>
      </el-form-item>
      <el-form-item label="接货信息" prop="delivery_info">
        <el-input v-model="logisticInfo.delivery_info"></el-input>
      </el-form-item>
      <el-form-item label="车牌信息" prop="license_plate_number">
        <el-input v-model="logisticInfo.license_plate_number"></el-input>
      </el-form-item>

      <!--<el-form-item label="车牌" prop="license_plate_number">-->
        <!--<el-input v-model="logisticInfo.license_plate_number"></el-input>-->
      <!--</el-form-item>-->
    </el-form>
    <span slot="footer">
              <el-button @click="cancelAddDeliveryAfter" size="mini">取消</el-button>
              <el-button type="primary" @click="submitAddAndEdit" size="mini">配送</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import bus, {orderOther} from '../../../common/bus'

  export default {
    components: {},
    name: 'delivery-after',
    props: ['showDialog', 'editRowId', 'orderInfo'],
    methods: {
      submitBefore: function () {
        let flag = false
        let errorMsg = ''
        if (!/^[0-9]+(.[0-9]{2})?$/.test(this.logisticInfo.freight_cost)) { // 判断运费和装车费是否为空
          flag = true
          errorMsg = '装车费用填写格式有误!'
        } else if (!/^[0-9]+(.[0-9]{2})?$/.test(this.logisticInfo.package_cost)) { // 验证输入的值是否为非0的正整数
          flag = true
          errorMsg = '打包费用填写格式有误!'
        } else if (!/^\+?[0-9][0-9]*$/.test(this.logisticInfo.package_num)) { // 验证输入的值是否为最多保留一个小数的可以为0的正数值
          flag = true
          errorMsg = '发货数量填写格式有误!'
        } else if (!/^[0-9]+(.[0-9]{2})?$/.test(this.logisticInfo.tricycle_cost)) { // 验证输入的值是否为非0的正整数
          flag = true
          errorMsg = '三路车费用填写格式有误!'
        } else if (!/^[0-9]+(.[0-9]{2})?$/.test(this.logisticInfo.transshipment_cost)) { // 验证输入的值是否为非0的正整数
          flag = true
          errorMsg = '中转费/短途费填写格式有误!'
        } else if (typeof (this.logisticInfo.license_plate_number) === 'undefined' || this.logisticInfo.license_plate_number.length > 8) {
          console.log(this.logisticInfo.license_plate_number)
          flag = true
          errorMsg = '车牌号输入有问题!'
        }
        if (flag) {
          this.warningMsg(errorMsg)
        }
        return flag
      },
      warningMsg: function (msg) {
        this.$message({
          message: msg,
          type: 'warning'
        })
      },
      reset: function () {
      },
      show: function () {
      },
      submitAddAndEdit: function () {
        if (this.submitBefore()) {
          console.log('false')
          return
        }
        console.log(this.orderInfo)
        this.$http.post('/manage/order/saveLogisticInfo', Object.assign({}, this.logisticInfo, this.orderInfo)).then((response) => {
          this.$emit('update:showDialog', false)
          this.$http.post('/manage/order/setStatus', {'isNext': 1, 'orderId': this.orderInfo.order_id}).then(
            (response2) => {
              this.$emit('update:showDialog', false)
              bus.$emit(orderOther.deliveryAfter)
            }
          )
        })
      },
      cancelAddDeliveryAfter: function () {
        this.$emit('update:showDialog', false)
        bus.$emit(orderOther.deliveryAfter)
      }
    },
    data: function () {
      return {
        logisticInfo: {
          freight_cost: '',
          package_cost: '',
          package_num: '',
          delivery_info: '',
          tricycle_cost: '',
          transshipment_cost: 0,
          license_plate_number: ''
          // freight_cost: '',
          // package_cost: '',
          // package_num: '',
          // delivery_info: '',
          // tricycle_cost: '',
          // transshipment_cost: '',
          // license_plate_number: ''
        }
      }
    },
    mounted: function () {
    }
  }
</script>

<style scoped>

</style>
