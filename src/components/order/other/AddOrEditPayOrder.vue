<template>
  <el-dialog :modal="false" title="添加支付" :visible="showDialog2" @update:visible="(val) => $emit('update:showDialog2', val)"
             :close-on-click-modal=false @open="show" @close="reset" style="width: 100%;">
    <el-form ref="form" :model="payOrder" :rules="rules" label-width="100px" label-position="right"
             class="form-style">
      <el-form-item v-if="this.editRowId !== null" label="店铺ID" prop="id">{{payOrder.id}}</el-form-item>
      <el-form-item label="支付方式" prop="pay_of_type">
        <el-radio-group v-model="payOrder.pay_of_type">
          <el-radio :label="0">微信支付</el-radio>
          <el-radio :label="1">支付宝支付</el-radio>
          <el-radio :label="2">银行转账</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="需应付：">
        <label><span style="color:red;">￥{{payOrderInfo2.allTotalCost - payOrderInfo2.reallyPayMoney}}</span></label>
      </el-form-item>
      <el-form-item label="支付金额" prop="pay_the_money" >
        <el-input v-model="payOrder.pay_the_money"></el-input>
      </el-form-item>
      <div style="display: flex;flex-direction: row;">
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
  import bus, {payOrderInfo} from '../../../common/bus.js'
  export default {
    components: {},
    name: 'customerAddOrEdit',
    props: ['showDialog2', 'editRowId', 'payOrderInfo2'],
    mounted: function () {
    },
    data: function () {
      return {
        resetForm: {
          imgs: []
        },
        payOrder: {
          pay_of_type: 0,
          pay_the_money: 0.0
        },
        businessAuth: {
          id: '',
          legal_person_name: '蔡赐州',
          identity: '441571198001212014',
          bank_account: '01321654654',
          business_license: '121434654',
          img_identity_front: '', // 身份证正面
          img_identity_reverse: '', // 身份证反面
          img_online_shop: '', // 网络店铺认证图片地址
          img_license: '', // 实体店认证
          auth_type: '1' // 认证类型
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
        if (!/^[0-9]+(.[0-9]{2})?$/.test(this.payOrder.pay_the_money)) {
          this.warningMsg('请输入正确的价格')
          flag = false
        }
        return flag
      },
      onSubmit: function () {
        if (!this.submitBefore()) {
          return
        }
        if (typeof (this.customer.imgs) !== 'undefined' && this.customer.imgs.length > 0) {
          this.payOrder.pay_of_evidence = this.customer.imgs[0].url
        }
        let flag = false
        if (this.payOrder.pay_the_money > this.payOrderInfo2.allTotalCost - this.payOrderInfo2.reallyPayMoney) {
          this.$confirm('支付金额大于应付金额将会存入个人余额，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            flag = true
            this.submit(this.payOrder.pay_the_money > this.payOrderInfo2.allTotalCost - this.payOrderInfo2.reallyPayMoney, flag)
          })
        } else {
          this.submit(this.payOrder.pay_the_money > this.payOrderInfo2.allTotalCost - this.payOrderInfo2.reallyPayMoney, flag)
        }
        // console.log('flag: ' + flag)
        // console.log(flag)
        // if (( && flag) || this.payOrder.pay_the_money <= this.payOrderInfo2.allTotalCost - this.payOrderInfo2.reallyPayMoney) {
        //
        // }
      },
      submit: function (isBig, isTip) {
        if ((isBig && isTip) || !isBig) {
          this.$refs['form'].validate((valid) => {
            this.$http.post('/manage/payOrder/addPayOrder', Object.assign({}, this.payOrder, this.payOrderInfo2)).then((response) => {
              this.$emit('update:showDialog2', false)
              bus.$emit(payOrderInfo.showAddOrEdit)
            })
          })
        }
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

<style>
  .el-select, .el-cascader {
    width: 100%;
  }

  .input-new-tag.el-input {
    width: auto;
  }

  span.el-tag {
    margin-right: 10px;
  }

  .el-upload-list--picture-card .el-upload-list__item, .el-upload--picture-card {
    width: 150px;
    height: 150px;
  }

  .el-upload--picture-card {
    line-height: 150px;
  }
</style>
