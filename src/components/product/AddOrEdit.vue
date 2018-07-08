<template>
  <el-dialog title="商品添加/编辑" :visible="showDialog" @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @open="show" @close="reset">
    <el-form ref="form" :model="product" :rules="rules" label-width="100px" label-position="right" class="form-style">
      <el-form-item v-if="this.editRowId !== null" label="商品ID" prop="id">{{product.id}}</el-form-item>
      <el-form-item label="商品名" prop="name">
        <el-input v-model="product.name"></el-input>
      </el-form-item>
      <el-form-item label="分类名" prop="types">
        <el-select v-model="product.types" multiple filterable placeholder="请选择">
          <el-option v-for="item in productStore.typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="植物属类" prop="fruit_type">
        <el-select v-model="product.fruit_type" filterable placeholder="请选择">
          <el-option v-for="item in productStore.fruitTypeList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜索关键字" prop="keywords">
        <el-tag :key="item" v-for="item in product.keywords" closable :disable-transitions="false" @close="deleteKeywords(item)">{{item}}</el-tag>
        <el-input v-if="isAddKeywordsShow" class="input-new-tag" v-model="addKeywords" ref="addKeywordsInput" size="small" @keyup.enter.native="handleKeywordsConfirm" @blur="handleKeywordsConfirm"></el-input>
        <el-button v-else size="small" @click="showAddKeywords">+ New Tag</el-button>
      </el-form-item>
      <el-form-item label="产地" prop="produceArea">
        <el-cascader v-model="product.produceArea" placeholder="请选择产地" :options="productStore.productionInfoList" filterable change-on-select></el-cascader>
      </el-form-item>
      <el-form-item label="显示顺序" prop="sort">
        <el-input-number v-model="product.sort" :min="1" :max="9999999"></el-input-number>
        <span>越大越靠前</span>
      </el-form-item>
      <el-form-item label="品牌" prop="brand">
        <el-input v-model="product.brand"></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="recommendTypes">
        <el-checkbox-group v-model="product.recommendTypes">
          <el-checkbox v-for="item in productStore.recommendList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="销售单位" prop="measure_unit">
        <el-select v-model="product.measure_unit" placeholder="请选择">
          <el-option v-for="item in productStore.measureUnitList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上架" prop="status">
        <el-radio-group v-model="product.status">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="保鲜期" prop="fresh_time">
        <el-select v-model="product.fresh_time" placeholder="请选择">
          <el-option v-for="item in productStore.freshMinuteList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="果品特征" prop="fruit_des">
        <el-input v-model="product.fruit_des"></el-input>
      </el-form-item>
      <el-form-item label="保藏方法" prop="store_way">
        <el-input v-model="product.store_way"></el-input>
      </el-form-item>
      <el-form-item label="本周商家购买数量" prop="week_sell_num">
        <el-input v-model="product.week_sell_num"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="imgs">
        <el-upload :action="_uploadFilePath" list-type="picture-card" :limit="20"
                   :file-list="product.imgs" :on-remove="handleRemoveImg"
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
// import { createNamespacedHelpers } from 'vuex'

// const { mapState, mapActions } = createNamespacedHelpers('types')

export default {
  name: 'productAddOrEdit',
  props: ['showDialog', 'editRowId'],
//  created: function () {
//    // 监听外部查询数据事件
//    bus.$on(setting.showAddOrEdit, (id) => {
//      this.reset()
//      if (id !== undefined) {
//        this.getData(id)
//      } else {
//        this.showForm = true
//      }
//    })
//  },
  mounted: function () {
    this.getTypes()
    this.show()
  },
  data: function () {
    return {
      isAddKeywordsShow: false,
      addKeywords: '',
      resetForm: {id: '', name: '', types: [], fruit_type: '', keywords: [], produceArea: [], sort: 999, brand: '', total_sell_num: 0, recommendTypes: [], measure_unit: '', status: 1, fresh_time: '', fruit_des: '', store_way: '', imgs: []},
      product: {}, // 这里使用resetForm作为添加数据时的初始数据，不要指望数据框架去重置数据，因为该组件挂载后，即使弹窗关闭，组件不会销毁，下次使用同样的组件，所以需要重置数据，当然也可以每次关闭弹窗后销毁组件
//      showForm: false,
//      types: [],
//      topMenu: [],
//      typeDisable: false,
//      topMenuDisable: false,
//      resetForm: {id: '', type: '', parent_id: 0, parent_name: '', name: '', url: '', icon: '', weight: 99, is_hot: false, ext: '', remark: '', status: 1},
      rules: {
        name: [
          {required: true, message: '请输入商品名', trigger: 'blur'},
          {min: 2, max: 50, message: '长度在 2 到50 个字符之间'}
        ],
        types: [
          {type: 'array', required: true, message: '请至少选择一个分类名', trigger: 'blur,change'}
        ],
        keywords: [
          {type: 'array', required: true, message: '请至少添加一个关键字', trigger: 'blur,change'}
        ],
        produceArea: [
          {type: 'array', required: true, message: '请选择产地', trigger: 'blur,change'}
        ],
        measure_unit: [
          {required: true, message: '请选择销售单位', trigger: 'blur,change'}
        ],
        status: [
          {type: 'number', required: true, message: '请选择是否上架', trigger: 'blur,change'}
        ]
      }
    }
  },
  computed: mapState({
    'productStore': 'product'
  }),
//  computed: mapState({
//    types: state => state.types.types // 如果使用了模块，但是没指定命名空间，则使用该方式将状态树种的数据混合到组件中
//  }),
  methods: {
    deleteKeywords: function (tag) {
      this.product.keywords.splice(this.product.keywords.indexOf(tag), 1)
    },
    handleKeywordsConfirm: function () {
      let inputValue = this.addKeywords
      if (inputValue) {
        this.product.keywords.push(inputValue)
      }
      this.isAddKeywordsShow = false
      this.addKeywords = ''
    },
    showAddKeywords: function () {
      this.isAddKeywordsShow = true
      this.$nextTick(_ => {
        this.$refs.addKeywordsInput.$refs.input.focus()
      })
    },
    handleRemoveImg: function (file, fileList) {
      this._imgUploadChange(file, fileList)
    },
    reset: function () {
      if (this.$refs['form']) { // 重置校验错误，必须执行，否则页面组件有问题
        this.$refs['form'].resetFields()
      }
      this.product = Object.assign({}, this.resetForm)
    },
    ...mapActions({
      getTypes: PRODUCT_TYPE_LIST
    }),
    show: function () { // 首次显示dialog时，show方法不会执行，所以需要在mounted中调用，后续直接通过dialog的open方法调用
      this.reset()
      if (this.editRowId !== null) {
        this.$http.post('/product/info', {id: this.editRowId}, {showLoading: true}).then((response) => {
          let imgs = []
          for (let img of response.data.imgs) {
            imgs.push({url: img.img_url})
          }
          delete response.data.imgs

          let produceArea = []
          if (response.data.country && response.data.country !== null) {
            produceArea.push(response.data.country)
          }
          delete response.data.country
          if (response.data.province && response.data.province !== null) {
            produceArea.push(response.data.province)
          }
          delete response.data.province

          this.product = Object.assign({}, objNullToBlank(response.data), {imgs: imgs, produceArea: produceArea})
        }).catch(() => {
          this.$emit('update:showDialog', false) // 关闭弹窗，这里的处理方式不太好，应该在加载完成数据后显示弹窗，这里是先显示弹窗，异常后关闭弹窗，所以会出现弹窗闪过的问题，但是因为是异步加载编辑页面的，所以无法使用事件通知弹窗
        })
      }
    },
    handleAvatarScucess: function (response, file, fileList) {
      if (response) {
        this._imgUploadChange(file, fileList)
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
    _imgUploadChange: function (file, fileList) {
      this.product.imgs = []
      // console.log('fileListBefore')
      // console.log(fileList)
      // console.log(file)
      // console.log('fileListAfter')
      for (let img of fileList) {
        // console.log('-----------------------------')
        // console.log(img)
        // console.log(this.product.imgs)
        this.product.imgs.push({url: img.response ? this._downloadFilePath + img.response : img.url})
        // console.log(this.product.imgs)
        // console.log('-----------------------------')

//        name: "20171105091908.png"
//        percentage: 100
//        response: "http://localhost:8080/media/upload/img_8addd9d776b04a11a93793371da7f258.png"
//        size: 461384
//        status: "success"
//        uid: 1509856412714
//        url: "blob:http://localhost:8085/64453705-8cbc-4b97-9793-76e944cd5921"
//         this.product.imgs.push({url: img.response || img.url}) // 这里的处理是兼容element-ui的数据结构，element-ui上传后的数据结构如上，url为本地图片地址，response才是服务器图片地址
      }
    },
    onSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return false }
        let address = {}
        if (this.product.produceArea.length > 0) {
          address.country = this.product.produceArea[0]
        }
        if (this.product.produceArea.length > 1) {
          address.province = this.product.produceArea[1]
        }

        let imgs = []
        for (let img of this.product.imgs) {
          imgs.push(img.url)
        }
        this.product.fresh_time = this.product.fresh_time * 24 * 60 // 分钟
        let postData = Object.assign(this.resetForm, this.product, address, {imgs: imgs})
        delete postData.produceArea
        this.$http.post('/product/save', postData, {showLoading: true}).then((response) => {
          this.$emit('update:showDialog', false) // 关闭弹窗
          if (this.product.id !== '') { // 编辑完成（刷新列表当前页）
            this.$message({type: 'success', message: '编辑数据成功'})
            bus.$emit(product.edit, postData)
          } else { // 新增完成（跳到第一页）
            this.$message({type: 'success', message: '添加数据成功'})
            bus.$emit(product.add, postData)
          }
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
  .input-new-tag.el-input {
    width: auto;
  }
  span.el-tag {
    margin-right: 10px;
  }
  .el-upload-list--picture-card .el-upload-list__item,.el-upload--picture-card {
    width: 150px;
    height: 150px;
  }
  .el-upload--picture-card {
    line-height: 150px;
  }
</style>
