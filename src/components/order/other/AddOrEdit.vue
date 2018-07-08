<template>
  <el-dialog title="客户添加/编辑" width="80%" :visible="showDialog"
             @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @close="reset"
             @open="show">
    <el-form :form="form" :model="form" ref="form" label-width="100px" label-position="right">
      <el-row>
        <el-col :span="6">
          <el-form-item size="mini" label="客户">
            <el-select v-if="!isEdit" :disabled="isEdit" v-model="form.business_user_id" @change="selectCustomer" filterable placeholder="请选择">
              <el-option v-for="item in tempCustomerInfo" :key="item.id" :label="item.business_name" :value="item.id"></el-option>
            </el-select>
            <div v-else>
              {{form.business_name}}
            </div>
          </el-form-item>
        </el-col>
        <el-col v-if="!isEdit" :span="6">
          <el-form-item size="mini" label="创建订单时间">
            <el-date-picker format="yyyy-MM-dd HH:mm:ss" v-model="form.first_day_order_cycle" type="datetime" placeholder="选择日期" :picker-options="pickerOptions"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="mini" label="销售" prop="a_user_sales">
            {{form.a_user_sales == null? '暂无': form.a_user_sales}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="mini" label="配送时间">
            早上 8:00 - 10:00
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item size="mini" label="配送方式" prop="group_key">
            {{form.delivery_type == null? '暂无': shipmentTypeStore.shipmentTypeList[form.delivery_type]}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="mini" label="收货人">
            {{form.buy_user_name == null? '暂无': form.buy_user_name}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="mini" label="收货地址">
            {{form.buy_address == null? '暂无': form.buy_address}}
          </el-form-item>
        </el-col>
      </el-row>

      <hr>
      <el-row>
        <el-col :span="8">
          <el-form-item size="mini" label="订单号">
            {{form.order_id == null? '暂无': form.order_id}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="订单状态">
            {{form.order_status == null? '暂无': orderStatusStore.orderStatusList[form.order_status]}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="下单时间">
            {{form.create_time == null? '暂无': form.create_time}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="下单总额" style="color:red;">
            ￥{{form.pay_need_money == null? '暂无': form.pay_need_money}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="公司货损额">
            暂无
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="应收总额" style="color:red;">
            ￥{{form.pay_reality_need_money == null? '0': (typeof (form.pay_reality_need_money) == 'undefined' ? '0' : form.pay_reality_need_money)}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-button size="mini" type="primary" style="margin-bottom: 10px" @click="onAddProduct">添加商品</el-button>
      <el-row>
        <!--style="border: 1px solid #eeeeee"-->
        <el-col :gutter="10" v-for="product in form.products" :key="product.product_standard_id" :span="4" style="border: 1px solid #eeeeee;padding: 10px;height: 300px;">
          <el-form-item label-width="50px" size="mini" label="商品" class="removeDistance">
            <!--<el-autocomplete style="width: 100%" placeholder="请输入商品名称,选择搜索值" :disabled="isEdit" :fetch-suggestions="productSearch" v-model="form.product_name" @select='selectProduct'>-->
            <!--<template slot-scope="props">-->
            <!--<div class="name">{{ props.item.value }}[{{props.item.brand}}]</div>-->
            <!--</template>-->
            <!--</el-autocomplete>-->
            <!--<el-select style="width: 100%" v-model="product.product_name" filterable remote @change="selectProduct" :remote-method="productSearch" placeholder="请输入关键词"-->
            <!--:loading="on_off.tempProductInfoLoading">-->
            <!--<el-option v-for="productInfo in tempProductsInfo" :key="productInfo.id" :label="productInfo.product_name + '[' + productInfo.brand + ']'" :value="productInfo.id"></el-option>-->
            <!--</el-select>-->
            <!--<el-input size="mini" placeholder="请输入商品" v-model="product.product_name"></el-input>-->

            {{product.product_name}}

          </el-form-item>
          <!--<el-form-item label-width="50px" size="mini" label="品牌">-->
          <!--{{product.brand}}-->
          <!--</el-form-item>-->
          <el-form-item label-width="55px" size="mini" label="规格" class="removeDistance">
            <!--<el-select style="width: 100%" v-model="product.product_standard_id" @change="selectProductStandard" placeholder="请输入关键词">-->
            <!--<el-option v-for="productStandardInfo in tempProductStandardsInfo" :key="productStandardInfo.product_standard_id"-->
            <!--:label="productStandardInfo.product_standard_name + '[' + productStandardInfo.product_standard_id + ']'" :value="productStandardInfo.product_standard_id"></el-option>-->
            <!--</el-select>-->
            <!--<el-input size="mini" placeholder="请输入规格" v-model="product.product_standard_name"></el-input>-->

            {{product.product_standard_name}}
          </el-form-item>
          <el-form-item label-width="55px" size="mini" label="副标题" class="removeDistance">
            {{product.sub_title}}
          </el-form-item>
          <el-form-item label-width="55px" size="mini" label="数量" class="removeDistance">
            <el-input size="mini" placeholder="请输入数量" v-model="product.num"></el-input>
          </el-form-item>
          <!--实发数量-->
          <el-form-item label-width="55px" size="mini" label="实发数" class="removeDistance"
                        v-if="form.order_status != null && form.order_status != '' && form.order_status !=0 && form.order_status != 5">
            <el-input size="mini" placeholder="请输入数量" v-model="product.actual_send_goods_num"></el-input>
          </el-form-item>
          <el-form-item label-width="55px" size="mini" label="实收数" class="removeDistance"
                        v-if="form.order_status != null && form.order_status != '' && form.order_status !=0 && form.order_status != 5 && form.order_status != 10 && form.order_status != 15">
            <el-input size="mini" placeholder="请输入数量" v-model="product.actual_deliver_num"></el-input>
          </el-form-item>
          <el-form-item label-width="55px" size="mini" label="报价" class="removeDistance">
            {{product.original_price}}
          </el-form-item>
          <el-form-item label-width="55px" size="mini" label="单价" class="removeDistance">
            <el-input size="mini" placeholder="请输入单价" v-model="product.sell_price"></el-input>
          </el-form-item>
          <el-form-item label-width="55px" size="mini" label="备注" class="removeDistance">
            <el-input type="textarea" placeholder="请输入备注" v-model="product.buy_remark"></el-input>
          </el-form-item>
          <el-button type="danger" size="mini" style="width: 100%" @click="removeProduct(product)">删除</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!--<el-button type="primary" size="mini" @click="reset('form')">重置</el-button>-->
    <span slot="footer">
       <el-button type="primary" @click="submitAddAndEdit" size="mini">确认</el-button>
       <el-button @click="$emit('update:showDialog', false)" size="mini">取消</el-button>
    </span>

    <!--内嵌的一个用于添加商品的提示框-->
    <el-dialog :center="true" :modal="false" title="添加商品" :visible.sync="on_off.isAddProduct" @close="addProductReset"
               @open="addProductShow">
      <el-form>
        <el-form-item label-width="70px" size="mini" label="商品">
          <el-select style="width: 100%" v-model="tempProduct.product_id" filterable remote @change="selectProduct"
                     :remote-method="productSearch" placeholder="请输入关键词"
                     :loading="on_off.tempProductInfoLoading">
            <el-option v-for="productInfo in tempProductsInfo" :key="productInfo.product_id"
                       :label="productInfo.product_name + '[' + productInfo.brand + ']'"
                       :value="productInfo.product_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="tempProduct.product_id" label-width="70px" size="mini" label="规格">
          <el-select style="width: 100%" v-model="tempProduct.product_standard_id" @change="selectProductStandard"
                     placeholder="请输入关键词">
            <el-option v-for="productStandardInfo in tempProductStandardsInfo"
                       :key="productStandardInfo.product_standard_id"
                       :label="productStandardInfo.product_standard_name + '[' + productStandardInfo.product_standard_id + ']'"
                       :value="productStandardInfo.product_standard_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="tempProduct.product_standard_id" label-width="70px" size="mini" label="副标题">
          {{tempProduct.sub_title}}
        </el-form-item>
        <el-form-item v-show="tempProduct.product_standard_id" label-width="70px" size="mini" label="报价">
          {{tempProduct.original_price}}
        </el-form-item>
        <el-form-item v-show="tempProduct.product_standard_id" label-width="70px" size="mini" label="单价">
          {{tempProduct.sell_price}}
        </el-form-item>
      </el-form>
      <span slot="footer">
       <el-button type="primary" @click="addProduct" size="mini">确认</el-button>
       <el-button @click="addProductCancel" size="mini">取消</el-button>
    </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {SHIPMENT_TYPE_LIST, ORDER_STATUS_LIST} from '../../../store/action-types'
  import bus, {orderOther} from '../../../common/bus.js'
  import {dateFmt} from '../../../common/utils.js'

  export default {
    name: 'add-or-edit',
    props: ['showDialog', 'editRowId'],
    data: function () {
      return {
        isEdit: false,
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
        },
        resetForm: {
          // a_user_sales: '',
          // business_info_id: 0,
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
            //   brand: '',
            //   gross_weight: 0,
            //   num: 0,
            //   original_price: 0.00,
            //   product_name: '',
            //   product_standard_name: '',
            //   sell_price: 0.00
            // }
          ]
        },
        timeout: null,
        on_off: {
          isSelectProduct: false,
          isAddProduct: false,
          tempProductInfoLoading: false
        },
        tempProduct: {
          // brand: '',
          // product_id: '',
          // product_name: '',
          // product_standard_id: '',
          // product_standard_name: '',
          // gross_weight: 0,
          // sell_price: 0.00,
          // original_price: 0.00,
          // num: 0
        },
        tempProductsInfo: [
          // {
          //   product_name: '',
          //   brand: '',
          //   id: ''
          // }
        ],
        tempProductStandardsInfo: [
          {}
        ],
        tempCustomerInfo: [
          //  name
          // {'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号'},
          // {'value': 'Hot honey 首尔炸鸡（仙霞路）', 'address': '上海市长宁区淞虹路661号'},
          // {'value': '新旺角茶餐厅', 'address': '上海市普陀区真北路988号创邑金沙谷6号楼113'},
          // {'value': '泷千家(天山西路店)', 'address': '天山西路438号'},
          // {'value': '胖仙女纸杯蛋糕（上海凌空店）', 'address': '上海市长宁区金钟路968号1幢18号楼一层商铺18-101'},
          // {'value': '贡茶', 'address': '上海市长宁区金钟路633号'},
          // {'value': '豪大大香鸡排超级奶爸', 'address': '上海市嘉定区曹安公路曹安路1685号'},
          // {'value': '茶芝兰（奶茶，手抓饼）', 'address': '上海市普陀区同普路1435号'},
          // {'value': '十二泷町', 'address': '上海市北翟路1444弄81号B幢-107'},
          // {'value': '星移浓缩咖啡', 'address': '上海市嘉定区新郁路817号'},
          // {'value': '阿姨奶茶/豪大大', 'address': '嘉定区曹安路1611号'},
          // {'value': '新麦甜四季甜品炸鸡', 'address': '嘉定区曹安公路2383弄55号'},
          // {'value': 'Monica摩托主题咖啡店', 'address': '嘉定区江桥镇曹安公路2409号1F，2383弄62号1F'},
          // {'value': '浮生若茶（凌空soho店）', 'address': '上海长宁区金钟路968号9号楼地下一层'},
          // {'value': 'NONO JUICE  鲜榨果汁', 'address': '上海市长宁区天山西路119号'},
          // {'value': 'CoCo都可(北新泾店）', 'address': '上海市长宁区仙霞西路'},
          // {'value': '快乐柠檬（神州智慧店）', 'address': '上海市长宁区天山西路567号1层R117号店铺'},
          // {'value': 'Merci Paul cafe', 'address': '上海市普陀区光复西路丹巴路28弄6号楼819'},
          // {'value': '猫山王（西郊百联店）', 'address': '上海市长宁区仙霞西路88号第一层G05-F01-1-306'},
          // {'value': '枪会山', 'address': '上海市普陀区棕榈路'},
          // {'value': '纵食', 'address': '元丰天山花园(东门) 双流路267号'},
          // {'value': '钱记', 'address': '上海市长宁区天山西路'},
          // {'value': '壹杯加', 'address': '上海市长宁区通协路'},
          // {'value': '唦哇嘀咖', 'address': '上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元'},
          // {'value': '爱茜茜里(西郊百联)', 'address': '长宁区仙霞西路88号1305室'},
          // {'value': '爱茜茜里(近铁广场)', 'address': '上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺'},
          // {'value': '鲜果榨汁（金沙江路和美广店）', 'address': '普陀区金沙江路2239号金沙和美广场B1-10-6'},
          // {'value': '开心丽果（缤谷店）', 'address': '上海市长宁区威宁路天山路341号'},
          // {'value': '超级鸡车（丰庄路店）', 'address': '上海市嘉定区丰庄路240号'},
          // {'value': '妙生活果园（北新泾店）', 'address': '长宁区新渔路144号'},
          // {'value': '香宜度麻辣香锅', 'address': '长宁区淞虹路148号'},
          // {'value': '凡仔汉堡（老真北路店）', 'address': '上海市普陀区老真北路160号'},
          // {'value': '港式小铺', 'address': '上海市长宁区金钟路968号15楼15-105室'},
          // {'value': '蜀香源麻辣香锅（剑河路店）', 'address': '剑河路443-1'},
          // {'value': '北京饺子馆', 'address': '长宁区北新泾街道天山西路490-1号'},
          // {'value': '饭典*新简餐（凌空SOHO店）', 'address': '上海市长宁区金钟路968号9号楼地下一层9-83室'},
          // {'value': '焦耳·川式快餐（金钟路店）', 'address': '上海市金钟路633号地下一层甲部'},
          // {'value': '动力鸡车', 'address': '长宁区仙霞西路299弄3号101B'},
          // {'value': '浏阳蒸菜', 'address': '天山西路430号'},
          // {'value': '四海游龙（天山西路店）', 'address': '上海市长宁区天山西路'},
          // {'value': '樱花食堂（凌空店）', 'address': '上海市长宁区金钟路968号15楼15-105室'},
          // {'value': '壹分米客家传统调制米粉(天山店)', 'address': '天山西路428号'},
          // {'value': '福荣祥烧腊（平溪路店）', 'address': '上海市长宁区协和路福泉路255弄57-73号'},
          // {'value': '速记黄焖鸡米饭', 'address': '上海市长宁区北新泾街道金钟路180号1层01号摊位'},
          // {'value': '红辣椒麻辣烫', 'address': '上海市长宁区天山西路492号'},
          // {'value': '(小杨生煎)西郊百联餐厅', 'address': '长宁区仙霞西路88号百联2楼'},
          // {'value': '阳阳麻辣烫', 'address': '天山西路389号'},
          // {'value': '南拳妈妈龙虾盖浇饭', 'address': '普陀区金沙江路1699号鑫乐惠美食广场A13'}
        ],
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        }
      }
    },
    mounted: function () {
      this.show()
      this.init()
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
      show: function () { // 显示订单数据
        this.reset()
        if (this.editRowId) {
          this.isEdit = true
          // 最好重新取数据
          this.$http.post('/manage/order/getOtherDataInfo', {orderId: this.editRowId}).then((response) => {
            this.form = response.data
          })
          return
        }
        this.isEdit = false
      },
      reset: function (form) { // 重置信息
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
        this.form = Object.assign({}, this.resetForm)
        this.form.products = []
        // this.form.first_day_order_cycle = dateFmt(new Date())
        this.on_off.isSelectProduct = false
        this.tempProductStandardsInfo = []
      },
      addProductReset: function () { // 添加商品结束 清理temp数据
        this.tempProductStandardsInfo = []
        this.tempProductsInfo = []
        this.tempProduct = {}
      },
      addProductShow: function () { // 添加商品显示的时候
        this.addProductReset()
      },
      addProductCancel: function () { // 添加商品选取消
        this.on_off.isAddProduct = false
        this.addProductReset()
      },
      removeProduct: function (item) { // 删除商品
        if (this.isEdit) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/manage/order/deleteProductForEdit', {orderDetailId: item.id}).then(
              (response) => {
                let index = this.form.products.indexOf(item)
                if (index !== -1) {
                  this.form.products.splice(index, 1)
                }
                this.successMsg('删除成功')
              }
            )
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          let index = this.form.products.indexOf(item)
          if (index !== -1) {
            this.form.products.splice(index, 1)
          }
        }
      },
      addProductBefore: function () { // 添加商品之前表单校验
        let flag = false
        if (typeof (this.tempProduct.product_id) === 'undefined' || this.tempProduct.product_id === null || this.tempProduct.product_id === '') {
          flag = true
          this.warningMsg('商品名不能为空')
        } else if (typeof (this.tempProduct.product_standard_id) === 'undefined' || this.tempProduct.product_standard_id === null || this.tempProduct.product_standard_id === '') {
          flag = true
          this.warningMsg('商品规格不能为空')
        }
        return flag
      },
      addProduct: function () { // 添加商品到订单
        if (this.addProductBefore()) { // 表单校验
          return
        }
        this.form.products.push(this.tempProduct)
        this.successMsg('成功添加商品')
        this.on_off.isAddProduct = false
      },
      onAddProduct: function () { // 打开添加商品嵌套页面
        this.on_off.isAddProduct = true
        // 提交后才保存或更新所有商品,所以不操作后台
        // 存放一个key值用来识别唯一的那一个选项
        // this.form.products.push({
        //   key: Date.now()
        // })
      },
      customerSearch: function (inputContent, cb) { // 客户查询
        let tempCustomerInfo = this.tempCustomerInfo
        // console.log('初始数据')
        // console.log(tempCustomerInfo)
        // console.log('inputContent:' + inputContent)
        let results = inputContent ? tempCustomerInfo.filter(this.createFilter(inputContent)) : '不存在该客户'
        // console.log('输出内容')
        // console.log(results)
        cb(results)

        // clearTimeout(this.timeout)
        // this.timeout = setTimeout(() => {
        //   this.$http.post('/manage/customer/getCustomerInfoByQuery', {'QueryString': inputContent}).then(
        //     (response) => {
        //       this.tempCustomerInfo = response.data
        //       cb(response.data)
        //     }
        //   )
        // }, 3000 * Math.random())
      },
      // productSearch: function (inputContent, cb) { // 商品查询
      //   console.log('商品查询开始')
      //   clearTimeout(this.timeout)
      //   this.timeout = setTimeout(() => {
      //     this.$http.post('/manage/order/getProductInfoByQuery', {'queryString': inputContent}).then(
      //       (response) => {
      //         // 直接返回对象数组,每个对象包含一个value
      //         cb(response.data)
      //       }
      //     )
      //   }, 3000 * Math.random())
      // },
      productSearch: function (inputContent) {
        if (inputContent !== '') {
          this.on_off.tempProductInfoLoading = true
          this.$http.post('/manage/order/getProductInfoByQuery', {'queryString': inputContent}).then(
            (response) => {
              this.on_off.tempProductInfoLoading = false
              this.tempProductsInfo = response.data
            }
          )
        } else {
          this.tempProductsInfo = ''
        }
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
      init: function () { // 初始化加载一些数据
        // 初始化订单数据
        this.$http.post('/manage/order/getCustomers').then(
          (response) => {
            this.tempCustomerInfo = response.data
          }
        )
        this.getShipmentTypeList()
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
      },
      submitBefore: function () { // 表单提交之前验证
        let flag = false
        if (typeof (this.form.business_user_id) === 'undefined' || this.form.business_user_id === null || this.form.business_user_id === '') {
          flag = true
          this.warningMsg('请选择一个客户')
        } else if (this.form.products !== null && this.form.products !== '' && this.form.products.length > 0) { // 判断添加的商品是否为null
          let serial = 0
          for (var index in this.form.products) {
            serial = 1 + parseInt(index)
            if (typeof (this.form.products[index].product_name) === 'undefined' ||
              this.form.products[index].product_name === null ||
              this.myTrim(this.form.products[index].product_name) === '') { // 判断商品是否为null
              this.warningMsg('第' + serial + '个商品名不能为空！')
              flag = true
            } else if (!/^\+?[1-9][0-9]*$/.test(this.form.products[index].num)) { // 验证输入的值是否为非0的正整数
              this.warningMsg('第' + serial + '个商品的数量输入有误！')
              flag = true
            } else if (!/^[0-9]+(.[0-9]{1})?$/.test(this.form.products[index].sell_price)) { // 验证输入的值是否为最多保留一个小数的可以为0的正数值
              this.warningMsg('第' + serial + '个商品的单价请输入正确的值，最多保留一位小数！')
              flag = true
            }
          }
        } else {
          flag = true
          this.warningMsg('请至少添加一条商品')
        }
        return flag
      },
      submitAddAndEdit: function () {
        if (this.submitBefore()) {
          return
        }
        this.form.first_day_order_cycle = dateFmt(this.form.first_day_order_cycle)
        this.$http.post('/manage/order/save', Object.assign({}, this.form, {'products': JSON.stringify(this.form.products), 'orderId': this.editRowId})).then(
          (response) => {
            this.$emit('update:showDialog', false)
            if (this.editRowId) {
              this.successMsg('编辑数据成功')
              bus.$emit(orderOther.edit)
            } else {
              this.successMsg('添加数据成功')
              bus.$emit(orderOther.add)
            }
          }
        )
      },
      selectProduct: function (productId) { // 选中商品 后加载商品规格信息
        let productsInfo = this.tempProductsInfo
        for (let i = 0; i < productsInfo.length; i++) {
          if (productsInfo[i].product_id === productId) {
            this.tempProduct = Object.assign({}, this.tempProduct, productsInfo[i])
            break
          }
        }
        // for (productsInfo in this.tempProductsInfo) {
        //   console.log(productsInfo.brand)
        //   // if (productsInfo.product_id === productId) {
        //   //
        //   // }
        // }
        this.$http.post('/manage/order/getProductIdStandardsInfo', {'productId': productId}).then(
          (response) => {
            this.tempProductStandardsInfo = response.data
            this.on_off.isSelectProduct = true
          }
        )
      },
      selectProductStandard: function (productStandardId) { // 选中商品规格 后加载所有信息出来
        let productsStandardsInfo = this.tempProductStandardsInfo
        for (let i = 0; i < productsStandardsInfo.length; i++) {
          if (productsStandardsInfo[i].product_standard_id === productStandardId) {
            this.tempProduct = Object.assign({}, this.tempProduct, productsStandardsInfo[i])
            break
          }
        }
      }
    },
    watch: {
      'form.products': { // 监控form.products被修改的值
        handler: function (val, oldVal) {
          let totalMoney = 0
          for (var product in val) {
            let isANum = false
            let isASellPrice = false
            if (!/^\+?[1-9][0-9]*$/.test(val[product].num)) {
              // val[product].num = 1
              isANum = true
            }
            if (!/^[0-9]+(.[0-9]{1})?$/.test(val[product].sell_price)) {
              // val[product].sell_price = 1.0
              isASellPrice = true
            }
            // 计算总价格
            totalMoney += ((isANum === true ? 0 : (val[product].num)) * (isASellPrice === true ? 0 : val[product].sell_price * 10)) / 10.0
          }
          this.form.pay_need_money = totalMoney
        },
        deep: true
      }
    }
    // watch: {
    //   customerChange: function (val, oldVal) {
    //     this.$http.post('/manage/order/getCustomerInfo', {'businessUserName': val}).then(
    //       (response) => {
    //         console.log('订正的值')
    //         console.log(response)
    //         this.form = Object.assign({}, this.form, response.data)
    //       }
    //     )
    //   }
    // },
    // computed: {
    //   customerChange: function () {
    //     // 返回商户名,因为用watch直接监听数组需要用特殊的方法才能监听而且太麻烦维护和开发都挺恶心的.
    //     // 所以直接用计算属性来获取该值,并让watch监听该计算属性,就能实现监听对象数组中的元素了
    //     return this.form.business_name
    //   }
    // }
  }
</script>

<style scoped>
  .removeDistance {
    margin: 0;
    padding: 0;
  }
</style>
