<template>
  <el-dialog title="商品规格添加/编辑" class="product-standard-form" width="60%" :visible="showDialog" @update:visible="(val) => $emit('update:showDialog', val)" :append-to-body=true :close-on-click-modal=false @open="show" @close="reset">
    <el-form ref="form" :model="productStandard" :rules="rules" label-width="100px" label-position="right" class="form-style">
      <el-form-item class="line" v-if="this.editRowId !== null" label="规格ID" prop="id">{{productStandard.id}}</el-form-item>
      <el-form-item class="line" label="规格名" prop="name">
        <el-input v-model="productStandard.name"></el-input>
      </el-form-item>
      <el-form-item class="line" label="副标题" prop="sub_title">
        <el-input v-model="productStandard.sub_title"></el-input>
      </el-form-item>
      <el-form-item label="原售价" prop="original_price">
        <el-input-number v-model="productStandard.original_price" controls-position="right" :min="0" :max="99999999" :step="10"></el-input-number>
      </el-form-item>
      <el-form-item label="现售价" prop="sell_price">
        <el-input-number v-model="productStandard.sell_price" controls-position="right" :min="0" :max="99999999" :step="10"></el-input-number>
      </el-form-item>
      <el-form-item label="现售称重单价" prop="weight_price">
        <el-input-number v-model="productStandard.weight_price" controls-position="right" :min="0" :max="99999999" :step="10"></el-input-number>
      </el-form-item>
      <el-form-item label="进货价" prop="cost_price">
        <el-input-number v-model="productStandard.cost_price" controls-position="right" :min="0" :max="99999999" :step="10"></el-input-number>
      </el-form-item>
      <el-form-item label="基础运费" prop="shipping_fee">
        <el-input-number v-model="productStandard.shipping_fee" controls-position="right" :min="0" :max="99999999" :step="10"></el-input-number>
      </el-form-item>
      <el-form-item label="装箱重量" prop="carton_weight">
        <el-input-number v-model="productStandard.carton_weight" controls-position="right" :min="0" :max="99999999" :step="10"></el-input-number>
      </el-form-item>
      <el-form-item label="单果重量" prop="fruit_weight">
        <el-input-number v-model="productStandard.fruit_weight" controls-position="right" :min="0" :max="99999999" :step="10"></el-input-number>
      </el-form-item>
      <el-form-item label="毛重" prop="gross_weight">
        <el-input-number v-model="productStandard.gross_weight" controls-position="right" :min="0" :max="99999999" :step="10"></el-input-number>
      </el-form-item>
      <el-form-item label="起购数量" prop="purchase_quantity_min">
        <el-input-number v-model="productStandard.purchase_quantity_min" controls-position="right" :min="0" :max="99999999" :step="10"></el-input-number>
      </el-form-item>
      <el-form-item label="限购数量" prop="purchase_quantity_max">
        <el-input-number v-model="productStandard.purchase_quantity_max" controls-position="right" :min="0" :max="99999999" :step="10"></el-input-number>
      </el-form-item>
      <el-form-item label="采购人" prop="procurement_id">
        <el-select v-model="productStandard.procurement_id" placeholder="请 选择">
          <el-option
            v-for="item in procurements"
            :key="item.id"
            :label="item.nick_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item class="line" label="限时销售" prop="buyTimeRange">
        <el-date-picker v-model="productStandard.buyTimeRange" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="采购单排序" prop="sort_purchase">
        <el-input-number v-model="productStandard.sort_purchase" controls-position="right" :min="0" :max="99999999" :step="1"></el-input-number>
      </el-form-item>
      <el-form-item label="出货单排序" prop="sort_sold_out">
        <el-input-number v-model="productStandard.sort_sold_out" controls-position="right" :min="0" :max="99999999" :step="1"></el-input-number>
      </el-form-item>
      <el-form-item label="分拣单排序" prop="sort_split">
        <el-input-number v-model="productStandard.sort_split" controls-position="right" :min="0" :max="99999999" :step="1"></el-input-number>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input-number v-model="productStandard.stock" controls-position="right" :min="0" :max="99999999" :step="10"></el-input-number>
      </el-form-item>
      <el-form-item label="上架" prop="status">
        <el-switch v-model="productStandard.status" :active-value=1 :inactive-value=0 active-text="是" inactive-text="否"></el-switch>
      </el-form-item>
      <el-form-item label="默认" prop="is_default">
        <el-radio-group v-model="productStandard.is_default">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in procurements"
            :key="item.id"
            :label="item.nick_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="item in procurements"
        :key="item.id"
        :label="item.nick_name"
        :value="item.id">
      </el-option>
    </el-select>

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:showDialog', false)">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import bus, {productStandard, product} from '../../common/bus.js'
  import {objNullToBlank, dateFmt, stringFmtDate} from '../../common/utils.js'

  export default {
    name: 'productStandardAddOrEdit',
    props: ['showDialog', 'editRowId', 'productId'],
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
      this.show()
      this.init()
    },
    data: function () {
      return {
        resetForm: {
          id: '',
          name: '',
          sub_title: '',
          original_price: 0,
          sell_price: 0,
          weight_price: 0,
          cost_price: 0,
          shipping_fee: 0,
          carton_weight: 0,
          fruit_weight: 0,
          gross_weight: 0,
          purchase_quantity_min: 0,
          purchase_quantity_max: 0,
          procurement_id: 0,
          procurement_name: '',
          buyTimeRange: [],
          sort_purchase: 100,
          sort_sold_out: 100,
          sort_split: 100,
          stock: 0,
          status: 1,
          is_default: 0
        },
        productStandard: {
          procurement_id: 0
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 1, max: 40, message: '长度在 1 到40 个字符', trigger: 'blur,change'}
          ],
          sub_title: [
            {required: true, message: '请输入副标题', trigger: 'blur'},
            {min: 2, max: 150, message: '长度在 2 到40 个字符', trigger: 'blur,change'}
          ],
          procurement_id: [{required: true, message: '请输入名称', trigger: 'blur,change'}]
        },
        procurements: [],
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '115'
      }
    },
    methods: {
      show: function () { // 首次显示dialog时，show方法不会执行，所以需要在mounted中调用，后续直接通过dialog的open方法调用
        this.reset()
        if (this.editRowId !== null) {
          this.$http.post('/productStandard/info', {id: this.editRowId}, {showLoading: true}).then(
            (response) => {
              console.log('response.data')
              console.log(response.data)
              var timeRange = []
              if (response.data.buy_start_time !== null && response.data.buy_end_time !== null) {
                timeRange.push(stringFmtDate(response.data.buy_start_time))
                timeRange.push(stringFmtDate(response.data.buy_end_time))
              }
              delete response.data.buy_start_time
              delete response.data.buy_end_time
              this.productStandard = Object.assign(this.resetForm, objNullToBlank(response.data), {buyTimeRange: timeRange})
              console.log('productStandard')
              console.log(this.productStandard)
            })
        }
      },
      onSubmit: function () {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return false
          }
          let buyTimeRange = {}
          if (this.productStandard.buyTimeRange.length > 1) {
            buyTimeRange.buy_start_time = dateFmt(this.productStandard.buyTimeRange[0])
            buyTimeRange.buy_end_time = dateFmt(this.productStandard.buyTimeRange[1])
          }
          let postData = Object.assign({}, this.productStandard, buyTimeRange)
          delete postData.buyTimeRange
          if (this.editRowId === null) {
            postData.product_id = this.productId
          }
          this.$http.post('/productStandard/save', postData, {showLoading: true}).then((response) => {
            this.$emit('update:showDialog', false)
            bus.$emit(product.edit, null) // 刷新商品列表
            if (this.productStandard.id !== '') { // 编辑完成（刷新列表当前页）
              this.$message({type: 'success', message: '编辑数据成功'})
              bus.$emit(productStandard.edit, postData)
            } else { // 新增完成（跳到第一页）
              this.$message({type: 'success', message: '添加数据成功'})
              bus.$emit(productStandard.add, postData)
            }
          })
        })
      },
      reset: function () {
        if (this.$refs['form']) { // 重置校验错误，必须执行，否则页面组件有问题
          this.$refs['form'].resetFields()
        }
        this.productStandard = Object.assign({}, this.resetForm)
      },
      init: function () { // 初始化加载所有采购人
        this.$http.post('/manage/user/getAllProcurement').then(
          (response) => {
            console.log(response)
            this.procurements = response.data
          }
        )
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
  .product-standard-form .el-form-item {
    display: inline-block;
    width: 300px;
    margin-right: 20px;
  }

  .product-standard-form .el-form-item.line {
    display: block;
    width: auto;
  }
</style>
