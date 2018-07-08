<template>
  <el-dialog title="行情添加/编辑" :visible="showDialog" @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @open="show" @close="reset">
    <el-form ref="form" :model="productMarket" :rules="rules" label-width="100px" label-position="right" class="form-style">
      <el-form-item label="商品名" prop="name">{{product.name}}</el-form-item>
      <el-form-item label="平台建议" prop="buy_suggest">
        <el-input v-model="productMarket.buy_suggest"></el-input>
      </el-form-item>
      <el-form-item label="市场反馈" prop="market_feedback">
        <el-select v-model="productMarket.market_feedback" placeholder="请选择">
          <el-option v-for="item in productStore.marketFeedbackList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供货" prop="supply_goods">
        <el-select v-model="productMarket.supply_goods" placeholder="请选择">
          <el-option v-for="item in productStore.supplyGoodsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="果质特点" prop="fruit_des">
        <el-input v-model="productMarket.fruit_des"></el-input>
      </el-form-item>
      <el-form-item label="服务支持" prop="support_des">
        <el-input v-model="productMarket.support_des"></el-input>
      </el-form-item>
      <el-form-item label="其他" prop="remark">
        <el-input v-model="productMarket.remark"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="imgs">
        <el-upload :action="_uploadFilePath" list-type="picture-card" :limit="20"
                   :file-list="productMarket.imgs" :on-remove="handleRemoveImg"
                   :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:showDialog', false)">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import bus, { product } from '../../common/bus.js'
import { objNullToBlank } from '../../common/utils.js'
import { PRODUCT_TYPE_LIST } from '../../store/action-types'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'market',
  props: ['showDialog', 'editRowId'],
  mounted: function () {
    this.show()
  },
  data: function () {
    return {
      product: {},
      resetForm: {id: '', product_id: '', buy_suggest: '', market_feedback: 1, supply_goods: 1, fruit_des: '', support_des: '', remark: '', imgs: []},
      productMarket: {}, // 这里使用resetForm作为添加数据时的初始数据，不要指望数据框架去重置数据，因为该组件挂载后，即使弹窗关闭，组件不会销毁，下次使用同样的组件，所以需要重置数据，当然也可以每次关闭弹窗后销毁组件
      rules: {
        buy_suggest: [
          {required: false, message: '', trigger: 'blur,change'},
          {min: 2, max: 50, message: '长度在 2 到100 个字符之间', trigger: 'blur,change'}
        ],
        fruit_des: [
          {required: true, message: '请填写果质特点', trigger: 'blur,change'},
          {min: 2, max: 50, message: '长度在 2 到255 个字符之间'}
        ]
      }
    }
  },
  computed: mapState({
    'productStore': 'product'
  }),
  methods: {
    ...mapActions({
      getTypes: PRODUCT_TYPE_LIST
    }),
    reset: function () {
      if (this.$refs['form']) { // 重置校验错误，必须执行，否则页面组件有问题
        this.$refs['form'].resetFields()
      }
      this.product = {}
      this.productMarket = Object.assign({}, this.resetForm)
    },
    show: function () { // 首次显示dialog时，show方法不会执行，所以需要在mounted中调用，后续直接通过dialog的open方法调用
      this.reset()
      console.log('this.editRowId:' + this.editRowId)
      if (this.editRowId !== null) {
        this.$http.post('/productMarket/info', Object.assign({}, {productId: this.editRowId}), {showLoading: true}).then((response) => {
          let imgs = []
          if (response.data.imgs) {
            for (let img of response.data.imgs) {
              imgs.push({url: img.img_url})
              // this.product.imgs.push({url: img.response ? this._downloadFilePath + img.response : img.url})
            }
            delete response.data.imgs
          }
          if (response.data.productName) {
            this.product.name = response.data.productName
            delete response.data.productName
          }
          this.productMarket = Object.assign(this.resetForm, {product_id: this.editRowId}, objNullToBlank(response.data), {imgs: imgs})
        }).catch((e) => {
          this.$emit('update:showDialog', false) // 关闭弹窗，这里的处理方式不太好，应该在加载完成数据后显示弹窗，这里是先显示弹窗，异常后关闭弹窗，所以会出现弹窗闪过的问题，但是因为是异步加载编辑页面的，所以无法使用事件通知弹窗
        })
      }
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
      this.productMarket.imgs = []
      for (let img of fileList) {
//        name: "20171105091908.png"
//        percentage: 100
//        response: "http://localhost:8080/media/upload/img_8addd9d776b04a11a93793371da7f258.png"
//        size: 461384
//        status: "success"
//        uid: 1509856412714
//        url: "blob:http://localhost:8085/64453705-8cbc-4b97-9793-76e944cd5921"
        this.productMarket.imgs.push({url: img.response != null ? this._downloadFilePath + img.response : img.url}) // 这里的处理是兼容element-ui的数据结构，element-ui上传后的数据结构如上，url为本地图片地址，response才是服务器图片地址
      }
    },
    onSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return false }
        let imgs = []
        for (let img of this.productMarket.imgs) {
          imgs.push(img.url)
        }
        let postData = Object.assign({}, this.productMarket, {imgs: imgs})
//        console.info(postData)
//        let a = 1
//        if (a === 1) {
//          return
//        }

        this.$http.post('/productMarket/save', postData, {showLoading: true}).then((response) => {
          this.$emit('update:showDialog', false) // 关闭弹窗
          this.$message({type: 'success', message: '编辑数据成功'})
          bus.$emit(product.edit, postData)
        })
      })
    }
  }
}
</script>

<style scoped>
.avatar-uploader-icon{
  font-size: 15px;
  border: 1px solid #bfcbd9;
  padding: 14px 17px;
  border-radius: 5px;
}
.avatar-img{
  max-width: 60px;
}
</style>

<style>
  .el-select,.el-cascader {
    width: 100%;
  }
  .el-upload-list--picture-card .el-upload-list__item,.el-upload--picture-card {
    width: 150px;
    height: 150px;
  }
  .el-upload--picture-card {
    line-height: 150px;
  }
</style>
