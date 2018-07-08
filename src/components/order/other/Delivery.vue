<template>
  <el-dialog title="配送" width="60%" :visible="showDialog"
             @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @close="reset"
             @open="show">
    <el-form :form="form" :model="form" ref="form" label-position="right">
      <el-row>
        <el-col :gutter="10" v-for="(product, index) in form.products" :key="index" :span="6"
                style="border: 1px solid #eeeeee;padding: 10px">
          <el-form-item label-width="60px" size="mini" label="商品">{{product.product_name}}</el-form-item>
          <el-form-item label-width="60px" size="mini" label="规格">
            {{product.product_standard_name}}
          </el-form-item>
          <el-form-item label-width="60px" size="mini" label="毛重">
            {{product.gross_weight}}
          </el-form-item>
          <el-form-item label-width="60px" size="mini" label="数量">
            <!--<el-input size="mini" placeholder="请输入数量" v-model="product.num"></el-input>-->
            {{product.num}}
          </el-form-item>
          <el-form-item label-width="60px" size="mini" label="库存量">
            {{product.stock}}
          </el-form-item>
          <el-form-item label-width="60px" size="mini" label="实发数">
            <el-input size="mini" placeholder="请输入数量" v-model="product.actual_send_goods_num"></el-input>
          </el-form-item>
          <el-form-item label-width="60px" size="mini" label="报价">
            {{product.original_price}}
          </el-form-item>
          <el-form-item label-width="60px" size="mini" label="单价">
            <!--<el-input size="mini" placeholder="请输入单价" v-model="product.sell_price"></el-input>-->
            {{product.sell_price}}
          </el-form-item>
          <!--<el-button type="danger" size="mini" style="width: 100%" @click="removeProduct(product)">删除</el-button>-->
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer">
       <el-button type="primary" @click="submitAddAndEdit" size="mini">确认</el-button>
       <el-button @click="cancelAdd" size="mini">取消</el-button>
    </span>

  </el-dialog>
</template>

<script>
  import bus, {orderOther} from '../../../common/bus'

  export default {
    components: {},
    name: 'delivery',
    data: function () {
      return {
        form: {
          // a_user_sales: '',
          // business_info_id: 0,
          // business_user_id: 0,
          // business_name: '',
          // buy_address: '',
          // buy_phone: '',
          // buy_user_name: '',
          // create_time: '',
          // delivery_type: 0,
          // order_id: '',
          // order_status: 0,
          // pay_need_money: 0.00,
          products: [
            // {
            //   product_id: '',
            //   brand: '',
            //   product_standard_id: '',
            //   gross_weight: 0,
            //   num: 0,
            //   original_price: 0.00,
            //   product_name: '',
            //   product_standard_name: '',
            //   sell_price: 0.00
            // }
          ]
        }
      }
    },
    props: ['showDialog', 'editRowId', 'orderInfo'],
    mounted: function () {
      this.show()
    },
    methods: {
      reset: function () {
      },
      warningMsg: function (msg) {
        this.$message({
          message: msg,
          type: 'warning'
        })
      },
      submitBefore: function () { // 表单提交之前验证
        let flag = false
        if (this.form.products !== null && this.form.products !== '' && this.form.products.length > 0) { // 判断添加的商品是否为null
          let serial = 0
          for (var index in this.form.products) {
            serial = 1 + parseInt(index)
            if (!/^\+?[0-9][0-9]*$/.test(this.form.products[index].actual_send_goods_num)) { // 验证输入的值为正整数
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
                  bus.$emit(orderOther.delivery, Object.assign({}, this.orderInfo))
                }
              }
            )
          }
        )
      },
      show: function () { // 显示订单数据
        this.reset()
        if (this.editRowId) {
          this.isEdit = true
          this.$http.post('/manage/order/getOtherDataInfo', {orderId: this.editRowId}).then((response) => {
            this.form = response.data
          })
          return
        }
        this.isEdit = false
      },
      cancelAdd: function () {
        this.$emit('update:showDialog', false)
      }
    }
  }
</script>

<style scoped>

</style>
