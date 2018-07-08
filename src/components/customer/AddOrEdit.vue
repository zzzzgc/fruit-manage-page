<template>
  <div>
    <el-dialog title="客户添加/编辑" :visible="showDialog" @update:visible="(val) => $emit('update:showDialog', val)"
               :close-on-click-modal=false @open="show" @close="reset" :modal="true">
      <el-form ref="form" :model="businessForm" :rules="rules" label-width="100px" label-position="right"
               class="form-style">
        <el-form-item v-if="this.editRowId !== null" label="店铺ID" prop="id">{{businessForm.businessInfo.id}}
        </el-form-item>
        <el-form-item label="店铺名称" prop="business_name">
          <el-input v-model="businessForm.businessInfo.business_name" placeholder="所在城市+店名，如广州嘻果"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="business_contacts">
          <el-input v-model="businessForm.businessInfo.business_contacts"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="businessForm.businessInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="法人姓名" prop="legal_person_name">
          <el-input v-model="businessForm.businessAuth.legal_person_name"></el-input>
        </el-form-item>
        <el-form-item label="省 市" prop="provinceAndCityArray">
          <el-cascader :options="provinceAndCityData" @change="handleChangePriovinceAndCityData"
                       v-model="provinceAndCityArray"></el-cascader>
          <!--<el-input v-model="businessInfo.name"></el-input>-->
        </el-form-item>
        <el-form-item label="收货地址" prop="address_detail">
          <el-input v-model="businessForm.businessInfo.address_detail"></el-input>
        </el-form-item>
        <el-form-item label="店铺地址" prop="address_shop">
          <el-input v-model="businessForm.businessInfo.address_shop" placeholder="若与收货地址一致，则无需填写"></el-input>
        </el-form-item>
        <el-form-item label="物流方式" prop="shipments_type">
          <el-radio-group v-model="businessForm.businessInfo.shipments_type">
            <el-radio :label="0">市场车</el-radio>
            <el-radio :label="1">物流</el-radio>
            <el-radio :label="2">自提</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--<el-form-item label="销售" prop="name">-->
        <!--<el-input v-model="customer.name" placeholder="姓名/电话"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="销售" prop="saleUserId">
          <el-select v-model="saleUser.saleUserId" placeholder="请选择">
            <el-option
              v-for="saleUser in allSaleUserInfo"
              :key="saleUser.id"
              :label="saleUser.nick_name + '/' + saleUser.phone"
              :value="saleUser.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="法人身份证" prop="identity">
          <el-input v-model="businessForm.businessAuth.identity"></el-input>
        </el-form-item>
        <el-form-item label="银行卡账号" prop="name">
          <el-input v-model="businessForm.businessAuth.bank_account"></el-input>
        </el-form-item>
        <el-form-item label="认证类型" prop="auth_type">
          <el-radio-group v-model="businessForm.businessAuth.auth_type">
            <el-radio :label="'1'">实体店认证</el-radio>
            <el-radio :label="'2'">网络认证</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="营业执照号" prop="business_license" v-if="this.businessForm.businessAuth.auth_type=='1'">
          <el-input v-model="businessForm.businessAuth.business_license"></el-input>
        </el-form-item>
        <div style="color:red;margin:10px 0 20px 20px;"><span>请严格依次选择 1.身份证背面照 》 2.身份证正面照 》 3.{{this.businessForm.businessAuth.auth_type == '1'?'实体店营业执照':'支付宝实名认证照'}}</span>
        </div>
        <div style="display: flex;flex-direction: row;">
          <el-form-item label="图片" prop="imgs">
            <el-upload :action="_uploadFilePath" list-type="picture-card" :limit="3"
                       :file-list="customer.imgs" :on-remove="handleRemoveImg"
                       :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <!--<el-form-item label="图片" prop="imgs">-->
          <!--<el-upload :action="_uploadFilePath" list-type="picture-card" :limit="3"-->
          <!--:file-list="customer.imgs" :on-remove="handleRemoveImg"-->
          <!--:on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">-->
          <!--<i class="el-icon-plus"></i>-->
          <!--</el-upload>-->
          <!--</el-form-item>-->
        </div>
        <el-button style="margin-left:30px;" @click="showBigImgae" type="primary">查看认证大图</el-button>
        <!--<div style="display: flex;flex-direction: row;">-->
        <!--<el-form-item label="图片" prop="imgs">-->
        <!--<el-upload :action="_uploadFilePath" list-type="picture-card" :limit="3"-->
        <!--:file-list="customer.imgs" :on-remove="handleRemoveImg"-->
        <!--:on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">-->
        <!--<i class="el-icon-plus"></i>-->
        <!--</el-upload>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="图片" prop="imgs">-->
        <!--<el-upload :action="_uploadFilePath" list-type="picture-card" :limit="3"-->
        <!--:file-list="customer.imgs" :on-remove="handleRemoveImg"-->
        <!--:on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">-->
        <!--<i class="el-icon-plus"></i>-->
        <!--</el-upload>-->
        <!--</el-form-item>-->
        <!--</div>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:showDialog', false)">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
    </el-dialog>
    <component :is="editCompName" :showDialog2.sync="showBigImage" :customerImgs="this.customer.imgs"></component>
  </div>
</template>

<script>
  import bus, {customer} from '../../common/bus.js'
  import {objNullToBlank} from '../../common/utils.js'
  import {PRODUCT_TYPE_LIST} from '../../store/action-types'
  import {mapState, mapActions} from 'vuex'
  import {provinceAndCityData, CodeToText, TextToCode} from 'element-china-area-data'
  // import { createNamespacedHelpers } from 'vuex'

  // const { mapState, mapActions } = createNamespacedHelpers('types')

  export default {
    components: {
      bigImage: resolve => {
        require(['./BigImage'], resolve)
      }
    },
    name: 'customerAddOrEdit',
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
      this.getAllSaleUserInfo()
    },
    data: function () {
      return {
        showBigImage: false,
        editCompName: '',
        isAddKeywordsShow: false,
        addKeywords: '',
        resetForm: {
          id: '',
          name: '',
          types: [],
          fruit_type: '',
          keywords: [],
          produceArea: [],
          sort: 999,
          brand: '',
          recommendTypes: [],
          measure_unit: '',
          status: 1,
          fresh_time: '',
          fruit_des: '',
          store_way: '',
          imgs: []
        },
        businessForm: {
          businessInfo: {
            id: '',
            business_name: '',
            business_contacts: ' ',
            phone: '',
            address_province: '',
            address_city: '',
            address_detail: '',
            address_shop: '',
            shipments_type: 0
          },
          businessAuth: {
            id: '',
            legal_person_name: '',
            identity: '',
            bank_account: '',
            business_license: '',
            img_identity_front: '', // 身份证正面
            img_identity_reverse: '', // 身份证反面
            img_online_shop: '', // 网络店铺认证图片地址
            img_license: '', // 实体店认证
            auth_type: '1' // 认证类型
          }
        },
        businessAuthExt: {
          businessAuthExtID: 0
        },
        allSaleUserInfo: {},
        saleUser: {
          saleUserId: '请选择'
        },
        customer: {}, // 这里使用resetForm作为添加数据时的初始数据，不要指望数据框架去重置数据，因为该组件挂载后，即使弹窗关闭，组件不会销毁，下次使用同样的组件，所以需要重置数据，当然也可以每次关闭弹窗后销毁组件
//      showForm: false,
//      types: [],
//      topMenu: [],
//      typeDisable: false,
//      topMenuDisable: false,
//      resetForm: {id: '', type: '', parent_id: 0, parent_name: '', name: '', url: '', icon: '', weight: 99, is_hot: false, ext: '', remark: '', status: 1},
        provinceAndCityData: provinceAndCityData,
        provinceAndCityArray: [],
        provinceAndCityArrayRevert: [],  // 省份和城市的字段的转换值，先复制给这个字段，再直接复制给provinceAndCityArray，就不会有不展示的BUG
        rules: {
          // business_name: [
          //   {required: true, message: '请输入店铺名', trigger: 'blur'},
          //   {min: 2, max: 10, message: '长度在 2 到10 个字符之间'}
          // ],
          // business_contacts: [
          //   {required: true, message: '请输入联系人', trigger: 'blur'},
          //   {min: 2, max: 10, message: '长度在 2 到10 个字符之间'}
          // ],
          // phone: [
          //   {
          //     required: true,
          //     message: '请输入手机号码',
          //     trigger: 'blur'
          //   },
          //   {
          //     validator: function (rule, value, callback) {
          //       if (/^1[34578]\d{9}$/.test(value) === false) {
          //         callback(new Error('请输入正确的手机号'))
          //       } else {
          //         callback()
          //       }
          //     },
          //     trigger: 'blur'
          //   }
          // ],
          saleUserId: [],
          provinceAndCityArray: [],
          // address_detail: [
          //   {required: true, message: '请输入详细地址', trigger: 'blur'},
          //   {max: 50, message: '详细地址最多50个字符'}
          // ],
          address_shop: [
            {required: false},
            {max: 50, message: '详细地址最多50个字符'}
          ]
        }
      }
    },
    computed: mapState({
      'customerStore': 'customer'
    }),
//  computed: mapState({
//    types: state => state.types.types // 如果使用了模块，但是没指定命名空间，则使用该方式将状态树种的数据混合到组件中
//  }),
    methods: {
      showBigImgae: function () {
        console.log(this.customer.imgs)
        this.editCompName = 'bigImage'
        this.showBigImage = true
      },
      showBigImageByOne: function () {
        console.log('showBigImageByOne')
        console.log(this.customer.imgs)
        console.log(this.customer.imgs[0])
      },
      deleteKeywords: function (tag) {
        this.customer.keywords.splice(this.customer.keywords.indexOf(tag), 1)
      },
      handleKeywordsConfirm: function () {
        let inputValue = this.addKeywords
        if (inputValue) {
          this.customer.keywords.push(inputValue)
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
        this._imgUploadChange(fileList)
      },
      reset: function () {
        if (this.$refs['form']) { // 重置校验错误，必须执行，否则页面组件有问题
          this.$refs['form'].resetFields()
        }
        this.customer = Object.assign({}, this.resetForm)
      },
      ...mapActions({
        getTypes: PRODUCT_TYPE_LIST
      }),
      show: function () { // 首次显示dialog时，show方法不会执行，所以需要在mounted中调用，后续直接通过dialog的open方法调用
        this.resetData()
        this.reset()
        let _this = this
        if (this.editRowId !== null) {
          this.$http.post('/manage/customer/info', {id: this.editRowId}, {showLoading: true}).then((response) => {
            let businessAuth = response.data.businessAuth
            let businessInfo = response.data.businessInfo
            _this.businessForm.businessInfo = businessInfo
            _this.businessForm.businessAuth = response.data.businessAuth
            _this.businessForm.businessAuth.id = businessAuth.id
            _this.saleUser.saleUserId = response.data.saleUser.id
            _this.provinceAndCityArrayRevert[0] = TextToCode[businessInfo.address_province].code // 对中转值进行省份赋值
            _this.provinceAndCityArrayRevert[1] = TextToCode[businessInfo.address_province][businessInfo.address_city].code // 对中转值进行城市赋值
            _this.provinceAndCityArray = _this.provinceAndCityArrayRevert // 用中转值进行对原始值进行赋值
            // _this.provinceAndCityArray[0] = TextToCode[businessInfo.address_province].code
            // _this.provinceAndCityArray[1] = TextToCode[businessInfo.address_province][businessInfo.address_city].code
            let imgs = []
            imgs.push({url: businessAuth.img_identity_reverse})
            imgs.push({url: businessAuth.img_identity_front})
            if (businessAuth.img_license === 'null' || businessAuth.img_license === null || businessAuth.img_license === '') {
              imgs.push({url: businessAuth.img_online_shop})
            } else {
              imgs.push({url: businessAuth.img_license})
            }
            _this.customer = Object.assign({}, objNullToBlank(response.data), {imgs: imgs})
          }).catch(() => {
            this.$emit('update:showDialog', true) // 关闭弹窗，这里的处理方式不太好，应该在加载完成数据后显示弹窗，这里是先显示弹窗，异常后关闭弹窗，所以会出现弹窗闪过的问题，但是因为是异步加载编辑页面的，所以无法使用事件通知弹窗
          })
        }
      },
      getAllSaleUserInfo: function () {
        this.$http.post('/manage/customer/getAllSaleUser').then((response) => {
          this.allSaleUserInfo = response.data
        })
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
//        name: "20171105091908.png"
//        percentage: 100
//        response: "http://localhost:8080/media/upload/img_8addd9d776b04a11a93793371da7f258.png"
//        size: 461384
//        status: "success"
//        uid: 1509856412714
//        url: "blob:http://localhost:8085/64453705-8cbc-4b97-9793-76e944cd5921"
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
        console.log('---------------------------------')
        console.log(this.businessForm.businessInfo.business_name.length)
        console.log(this.businessForm.businessInfo.business_contacts.length)
        console.log(this.businessForm.businessAuth.bank_account.length)
        console.log(this.businessForm.businessAuth.business_license)
        // console.log(this.businessForm.businessAuth.business_license.length)
        console.log('---------------------------------')

        if (this.businessForm.businessInfo.business_name === null || this.businessForm.businessInfo.business_name === '') {
          this.warningMsg('请输入正确的店铺名称')
          flag = false
        } else if (this.businessForm.businessInfo.business_contacts === null || this.businessForm.businessInfo.business_contacts === '' || this.businessForm.businessInfo.business_contacts.length > 10 || this.businessForm.businessInfo.business_contacts.length < 2) {
          this.warningMsg('请输入正确的联系人')
          flag = false
        } else if (/^1[34578]\d{9}$/.test(this.businessForm.businessInfo.phone) === false) {
          this.warningMsg('请输入正确的手机号码')
          flag = false
        } else if (this.businessForm.businessInfo.address_province === '' && this.businessForm.businessInfo.address_city === '') {
          this.warningMsg('请选择省份')
          flag = false
        } else if (this.saleUser.saleUserId === '请选择') {
          this.warningMsg('请选择销售人员')
          flag = false
        } else if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.businessForm.businessAuth.identity)) {
          flag = false
          this.warningMsg('输入身份证号码有误')
        } else if (this.businessForm.businessAuth.bank_account.length > 20) {
          flag = false
          this.warningMsg('输入的银行卡号有误' + this.businessForm.businessAuth.bank_account.length)
        } else if (this.businessForm.businessAuth.auth_type === 1) {
          // 只有实体店认证不可以跳过该验证
          if (this.businessForm.businessAuth.business_license === null || this.businessForm.businessAuth.business_license.length > 18) {
            flag = false
            this.warningMsg('输入的营业执照号有误' + this.businessForm.businessAuth.business_license.length)
          }
        }
        if (this.businessForm.businessInfo.address_shop === null || this.businessForm.businessInfo.address_shop === '') {
          this.businessForm.businessInfo.address_shop = this.businessForm.businessInfo.address_detail
        }
        return flag
      },
      onSubmit: function () {
        if (!this.submitBefore()) {
          return
        }
        // 如果店铺地址为null，则默认是指为收货地址
        if (this.businessForm.businessInfo.address_shop === '') {
          this.businessForm.businessInfo.address_shop = this.businessForm.businessInfo.address_detail
        }
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return false
          }
          // let address = {}
          // if (this.customer.produceArea.length > 0) {
          //   address.country = this.customer.produceArea[0]
          // }
          // if (this.customer.produceArea.length > 1) {
          //   address.province = this.customer.produceArea[1]
          // }

          let imgs = []
          let imgByIndex = 0
          // 循环上传的图片数组到对应的字段中并进行赋值
          this.businessAuthExt.businessAuthExtID = this.businessForm.businessAuth.id
          for (let img of this.customer.imgs) {
            if (imgByIndex === 0) {
              this.businessForm.businessAuth.img_identity_reverse = img.url
            } else if (imgByIndex === 1) {
              this.businessForm.businessAuth.img_identity_front = img.url
            } else if (imgByIndex === 2) {
              if (this.businessForm.businessAuth.auth_type === '1') {
                this.businessForm.businessAuth.img_license = img.url
              } else {
                this.businessForm.businessAuth.img_online_shop = img.url
              }
            }
            imgByIndex++
            imgs.push(img.url)
          }
          // 判断是否选择了三张图片
          if (imgs.length < 3) {
            this.warningMsg('请选择严格依次三张图片')
            return false
          }
          this.$http.post('/manage/customer/getBusinessUserByPhone', this.businessForm.businessInfo).then((response) => {
            let flag = false
            if (this.businessForm.businessInfo.id === '' && response.data !== null) {
              this.warningMsg('商户联系电话已存在！')
              flag = true
            }
            if (flag) { // 判断该商户是否已经注册过
              return
            }
            let postData = Object.assign(this.businessForm.businessAuth, this.businessForm.businessInfo, this.saleUser, this.businessAuthExt)
            // let postData = Object.assign(this.businessForm, this.saleUser, this.businessAuthExt)
            this.$http.post('/manage/customer/save', postData, {showLoading: true}).then((response) => {
              this.$emit('update:showDialog', false) // 关闭弹窗
              if (this.businessForm.businessInfo.id !== '') { // 编辑完成（刷新列表当前页）
                this.$message({type: 'success', message: '编辑数据成功'})
                bus.$emit(customer.refreshListForEdit)
              } else { // 新增完成（跳到第一页）
                this.$message({type: 'success', message: '添加数据成功'})
                bus.$emit(customer.refreshListForAdd)
              }
            })
          })
        })
      },
      handleChangePriovinceAndCityData: function () { // 选中省市的时候并给相关字段进行赋值操作
        this.businessForm.businessInfo.address_province = CodeToText[this.provinceAndCityArray[0]]
        this.businessForm.businessInfo.address_city = CodeToText[this.provinceAndCityArray[1]]
      },
      resetData: function () {
        this.businessForm.businessInfo.id = ''
        this.businessForm.businessInfo.business_name = ''
        this.businessForm.businessInfo.business_contacts = ''
        this.businessForm.businessInfo.phone = ''
        this.businessForm.businessInfo.address_province = ''
        this.businessForm.businessInfo.address_city = ''
        this.businessForm.businessInfo.address_detail = ''
        this.businessForm.businessInfo.address_shop = ''
        this.businessForm.businessInfo.shipments_type = 0
        this.businessForm.businessAuth.id = ''
        this.businessForm.businessAuth.legal_person_name = ''
        this.businessForm.businessAuth.identity = ''
        this.businessForm.businessAuth.bank_account = ''
        this.businessForm.businessAuth.business_license = ''
        this.businessForm.businessAuth.img_identity_front = '' // 身份证正面
        this.businessForm.businessAuth.img_identity_reverse = '' // 身份证反面
        this.businessForm.businessAuth.img_online_shop = '' // 网络店铺认证图片地址
        this.businessForm.businessAuth.img_license = '' // 实体店认证
        this.businessForm.businessAuth.auth_type = '1' // 认证类型
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
