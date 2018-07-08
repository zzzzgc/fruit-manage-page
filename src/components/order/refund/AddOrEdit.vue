<template>
  <el-dialog :modal="false" title="添加退款" :visible="showDialog2" @update:visible="(val) => $emit('update:showDialog2', val)"
             :close-on-click-modal=false @open="show" @close="reset" style="width: 100%;">
    <el-form ref="form" :model="payOrder" :rules="rules" label-width="100px" label-position="right"
             class="form-style">
      <div >
        <el-form-item size="mini" label="客户：">
          <el-select  v-model="form.user_id" @change="selectCustomer" filterable placeholder="请选择">
            <el-option v-for="item in tempCustomerInfo" :key="item.id" :label="item.business_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="selectCustomerForm.isSelectCustomer" label="订单号：">
          <el-select  v-model="form.order_id"  filterable placeholder="请选择">
            <el-option v-for="item in selectCustomerForm.orders" :key="item.id" :label="item.order_id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="selectCustomerForm.isSelectCustomer" label="销售人：">
          {{selectCustomerForm.businessUser.nick_name}}
        </el-form-item>
        <el-form-item label="支付方式" prop="refund_of_type">
          <el-radio-group v-model="form.refund_of_type">
            <el-radio :label="0">微信支付</el-radio>
            <el-radio :label="1">支付宝支付</el-radio>
            <el-radio :label="2">银行转账</el-radio>
            <el-radio :label="3">现金</el-radio>
            <el-radio :label="4">余额</el-radio>
            <el-radio :label="5">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="selectCustomerForm.isSelectCustomer" label="账户余额：">
          {{selectCustomerForm.businessUser.money}}
        </el-form-item>
        <el-form-item label="退款金额：">
          <el-input v-model="form.refund_the_money"></el-input>
        </el-form-item>
        <el-form-item label="支付凭证" prop="imgs">
          <el-upload :action="_uploadFilePath" list-type="picture-card" :limit="1"
                     :file-list="customer.imgs" :on-remove="handleRemoveImg"
                     :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:showDialog2', false)">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import bus, {refund} from '../../../common/bus.js'
  export default {
    components: {},
    name: 'refund-add-edit',
    props: ['showDialog2', 'editRowId'],
    mounted: function () {
      this.show()
      this.init()
    },
    data: function () {
      return {
        form: {
          id: '',
          operation_id: '',
          user_id: '',
          order_id: '',
          sale_id: '',
          operation_type: '',
          refund_of_type: 0,
          refund_the_money: '',
          refund_of_evidence: ''
        },
        selectCustomerForm: {
          isSelectCustomer: false,
          businessUser: {
          },
          orders: {
          }
        },
        tempCustomerInfo: [
        ],
        payOrder: {
        },
        resetForm: {
          imgs: []
        },
        customer: {},
        rules: {
        }
      }
    },
    methods: {
      handleRemoveImg: function (file, fileList) {
        this._imgUploadChange(fileList)
      },
      reset: function () {
        if (this.$refs['form']) { // 重置校验错误，必须执行，否则页面组件有问题
          this.$refs['form'].resetFields()
        }
        this.customer = Object.assign({}, this.resetForm)
      },
      show: function () {
        this.reset()
        if (this.editRowId !== null) {
        }
      },
      init: function () { // 初始化加载一些数据
        // 初始化订单数据
        this.$http.post('/manage/order/getCustomers').then(
          (response) => {
            this.tempCustomerInfo = response.data
          }
        )
      },
      customerSearch: function (inputContent, cb) { // 客户查询
        let tempCustomerInfo = this.tempCustomerInfo
        let results = inputContent ? tempCustomerInfo.filter(this.createFilter(inputContent)) : '不存在该客户'
        cb(results)
      },
      selectCustomer: function (customerId) { // 选中客户后加载客户信息
        this.selectCustomerForm.isSelectCustomer = true
        this.$http.post('/manage/order/refund/getRefundAllInfo', {'userId': customerId}).then(
          (response) => {
            this.selectCustomerForm.businessUser = response.data['businessUser']
            this.selectCustomerForm.orders = response.data['orders']
          }
        )
      },
      handleAvatarScucess: function (response, file, fileList) {
        if (response) {
          this._imgUploadChange(fileList)
        } else {
          this.$message.error('该图片不支持上传，请更换一张！')
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
      _imgUploadChange: function (fileList) {
        this.customer.imgs = []
        for (let img of fileList) {
          this.customer.imgs.push({url: img.response != null ? this._downloadFilePath + img.response : img.url}) // 这里的处理是兼容element-ui的数据结构，element-ui上传后的数据结构如上，url为本地图片地址，response才是服务器图片地址
        }
      },
      warningMsg: function (msg) {
        this.$message({
          message: msg,
          type: 'warning'
        })
      },
      submitBefore: function () {
        let flag = true
        let msg = ''
        if (!this.selectCustomerForm.isSelectCustomer) {
          flag = false
          msg = '请至少选择一个客户！'
        } else if (!/^\+?[1-9][0-9]*$/.test(this.form.refund_the_money)) {
          flag = false
          msg = '请输入有效的退款金额！'
        } else if (this.form.refund_the_money > this.selectCustomerForm.businessUser.money) {
          flag = false
          msg = '您的个人余额不足以退款！'
        }
        if (!flag) {
          this.warningMsg(msg)
        }
        return flag
      },
      onSubmit: function () {
        if (!this.submitBefore()) {
          return
        }
        if (typeof (this.customer.imgs) !== 'undefined' && this.customer.imgs.length > 0) {
          this.form.refund_of_evidence = this.customer.imgs[0].url
        }
        this.form.sale_id = this.selectCustomerForm.businessUser.a_user_sales_id
        let formData = Object.assign({}, this.form)
        this.$refs['form'].validate((valid) => {
          this.$http.post('/manage/order/refund/addRefundRecord', formData).then((response) => {
            this.$emit('update:showDialog2', false)
            bus.$emit(refund.showAddOrEdit)
          })
        })
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader-icon {
    font-size: 15px;
    border: 1px solid #bfcbd9;
    padding: 14px 17px;
    border-radius: 5px;
  }

  .avatar-img {
    max-width: 60px;
  }
</style>

