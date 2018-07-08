<template>
  <el-dialog title="报损" width="80%" :visible="showDialog"
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
        <el-col :span="6">
          <el-form-item size="mini" label="订单号:">
            {{typeof (orderInfo) === 'undefined'? '' : orderInfo.order_id}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="mini" label="订单状态:">
            {{form.order_status == null? '暂无': orderStatusStore.orderStatusList[form.order_status]}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="mini" label="下单时间:">
            {{form.create_time == null? '暂无': form.create_time}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="mini" label="完成时间:">
            {{form.pay_time == null? '暂无': form.pay_time}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item item="mini" label="商品名称：">
            {{typeof (orderDetail) === 'undefined' ? '无' : orderDetail.product_name}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item item="mini" label="规格名称：">
            {{typeof (orderDetail) === 'undefined' ? '无' : orderDetail.product_standard_name}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item item="mini" label="品牌：">
            {{typeof (orderInfo) === 'undefined' ? '无' : orderInfo.brand}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item item="mini" label="收货地址：">
            {{typeof (orderInfo) === 'undefined' ? '无' : orderInfo.address}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item item="mini" label="报价：">
            {{typeof (orderDetail) === 'undefined' ? '无' : orderDetail.sell_price}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item item="mini" label="下单数量：">
            {{typeof (orderDetail) === 'undefined' ? '无' : orderDetail.num}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item item="mini" label="实发数量：">
            {{typeof (orderDetail) === 'undefined' ? '无' : orderDetail.actual_send_goods_num}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item item="mini" label="实收数量：">
            {{typeof (orderDetail) === 'undefined' ? '无' : orderDetail.actual_deliver_num}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item item="mini" label="商品总额:￥">
            {{typeof (orderDetail) === 'undefined' ? '无' : '2'}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item item="mini" label="报损数量：">
            <el-input v-model="breakage.breakage_num"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item item="mini" label="定损金额：">
            <el-input v-model="breakage.breakage_price"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item item="mini" label="损耗描述：">
            <el-input v-model="breakage.breakage_describe"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="图片" prop="imgs">
            <el-upload :action="_uploadFilePath" list-type="picture-card" :limit="3"
                       :file-list="form.imgs" :on-remove="handleRemoveImg"
                       :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer">
       <!--<el-button type="primary" size="mini">确认</el-button>-->
       <el-button @click="updateBreakage" size="mini" type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {SHIPMENT_TYPE_LIST, ORDER_STATUS_LIST} from '../../../store/action-types'

  export default {
    name: 'add-or-edit',
    props: ['showDialog', 'editRowId', 'orderInfo', 'orderDetail', 'productStandardId'],
    data: function () {
      return {
        isEdit: false,
        breakage: {
          id: null,
          order_id: null,
          breakage_img_id: 0,
          product_id: 0,
          product_standard_id: 0,
          product_name: null,
          product_standard_name: null,
          reference_breakage_price: 0,
          breakage_num: 0,
          breakage_price: 0,
          breakage_describe: null
        },
        form: {
          products: []
        },
        resetForm: {
          products: []
        },
        on_off: {
          isSelectProduct: false,
          isAddProduct: false,
          tempProductInfoLoading: false
        },
        tempCustomerInfo: []
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
      updateBreakage: function () {
        this.breakage.order_id = this.orderInfo.order_id
        this.breakage.product_id = this.orderDetail.product_id
        this.breakage.product_standard_id = this.orderDetail.product_standard_id
        this.breakage.product_name = this.orderDetail.product_name
        this.breakage.product_standard_name = this.orderDetail.product_standard_name

        let imgs = []
        if (typeof (this.form.imgs) !== 'undefined' && this.form.imgs.length > 0) {
          for (let img of this.form.imgs) {
            imgs.push(img.url)
          }
        }
        this.breakage.imgs = imgs
        this.$http.post('/manage/order/updateBreakage', this.breakage, imgs).then((response) => {
          this.$emit('update:showDialog', false)
          this.$message({type: 'success', message: '修改成功！'})
        }).catch((response) => {
          this.$emit('update:showDialog', false)
        })
      },
      handleRemoveImg: function (file, fileList) {
        this._imgUploadChange(fileList)
      },
      handleAvatarScucess: function (response, file, fileList) {
        if (response) {
          this._imgUploadChange(fileList)
        } else {
          this.$message.error('该图片不支持上传，请更换一张！')
        }
      },
      _imgUploadChange: function (fileList) {
        this.form.imgs = []
        for (let img of fileList) {
          this.form.imgs.push({url: img.response != null ? this._downloadFilePath + img.response : img.url}) // 这里的处理是兼容element-ui的数据结构，element-ui上传后的数据结构如上，url为本地图片地址，response才是服务器图片地址
        }
      },
      beforeAvatarUpload: function (file) {
        const isRightType = file.type.indexOf('image/') === 0
        if (!isRightType) {
          this.$message.error('上传图标必须为图片格式!')
        }
        const isRightSize = file.size / 1024 / 1024 < 5
        if (!isRightSize) {
          this.$message.error('上传图标大小不能超过 5MB!')
        }
        return isRightSize && isRightType
      },
      show: function () { // 显示订单数据
        this.getShipmentTypeList()
        this.reset()
        if (typeof (this.productStandardId) === 'undefined') {
          return
        }
        // 最好重新取数据
        this.$http.post('/manage/order/getBreakageInfo', {orderId: this.editRowId, productStandardId: this.productStandardId}).then((response) => {
          if (response.data['orderBreakage'] !== null) {
            this.breakage = response.data['orderBreakage']
          } else {
            this.breakage.id = null
            this.breakage.order_id = null
            this.breakage.breakage_img_id = 0
            this.breakage.product_id = 0
            this.breakage.product_standard_id = 0
            this.breakage.product_name = null
            this.breakage.product_standard_name = null
            this.breakage.reference_breakage_price = 0
            this.breakage.breakage_num = 0
            this.breakage.breakage_price = 0
            this.breakage.breakage_describe = null
          }
          this.form.imgs = []
          if (response.data['orderBreakageImg'] != null && response.data['orderBreakageImg'].length > 0) {
            for (let i = 0; i < response.data['orderBreakageImg'].length; i++) {
              this.form.imgs.push({url: response.data['orderBreakageImg'][i].img_url})
            }
          }
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
      createFilter: function (inputContent) { // 设置拦截规则  类似于equals
        return (myContent) => {
          if (!myContent.value) {
            return
          }
          // 这里是根据获取值的value来判断和输入值是否匹配的,并且组件的赋值才做也需要value才能赋值
          return (myContent.value.toLowerCase().indexOf(inputContent.toLowerCase()) === 0)
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
