<template>
  <el-dialog title="入库单编辑/添加" :visible="showDialog" @update:visible="(val) => $emit('update:showDialog', val)"
             :close-on-click-modal=false @open="show" @close="reset">
    <el-form ref="form" :model="inventoryDetail" label-width="100px" label-position="right"
             class="form-style">
      <el-form-item v-if="this.editRowId !== null" label="编号" prop="id">{{inventoryDetail.id}}</el-form-item>
      <!--<el-input v-model="inventoryDetail.product_name" placeholder="请输入商品名"></el-input>-->


      <el-form-item label="商品名称" prop="product_name">
        <span v-model="inventoryDetail.product_name">{{inventoryDetail.product_name}}</span>
      </el-form-item>
      <el-form-item label="规格名称" prop="product_standard_name">
        <!--<el-input v-model="inventoryDetail.product_standard_name" placeholder="请输入规格名称"></el-input>-->
        <span  v-model="inventoryDetail.product_standard_name">{{inventoryDetail.product_standard_name}}</span>
      </el-form-item>
      <el-form-item label="规格编号" prop="product_standard_id">
        <!--<el-input v-model="inventoryDetail.product_standard_id" placeholder="请输入规格编号"></el-input>-->
        <span  v-model="inventoryDetail.product_standard_id">{{inventoryDetail.product_standard_id}}</span>
      </el-form-item>

      <el-form-item label="重量斤" prop="product_weight">
        <!--<el-input v-model="inventoryDetail.product_weight" placeholder="请输入重量"></el-input>-->
        <span  v-model="inventoryDetail.product_weight">{{inventoryDetail.product_weight}}</span>
      </el-form-item>

      <el-form-item label="库存数量" prop="inventory_num">
        <!--<el-input v-model="inventoryDetail.inventory_num" placeholder="请输入库存数量"></el-input>-->
        <span v-model="inventoryDetail.inventory_num" >{{inventoryDetail.inventory_num}}</span>
        <!--<span  v-model="inventoryDetail.booth_cost">{{inventoryDetail.booth_cost}}</span>-->
      </el-form-item>

      <el-form-item label="盘点数量" prop="check_inventory_num">
        <el-input v-model="inventoryDetail.check_inventory_num" placeholder="请输入盘点数量"></el-input>
      </el-form-item>

      <el-form-item label="库存单价" prop="inventory_price">
        <!--<el-input v-model="inventoryDetail.inventory_price" placeholder="请输入采购单价"></el-input>-->
        <span  v-model="inventoryDetail.inventory_price">{{inventoryDetail.inventory_price}}</span>
      </el-form-item>
      <el-form-item label="库存总额" prop="inventory_total_price">
        <!--<el-input v-model="inventoryDetail.product_standard_num" placeholder="请输入下单数量"></el-input>-->
        <span  v-model="inventoryDetail.inventory_total_price">{{inventoryDetail.inventory_total_price}}</span>
      </el-form-item>
      <el-form-item label="盘点人" prop="user_name">
        <el-input v-model="inventoryDetail.user_name" placeholder="请输入库存数量"></el-input>
        <!--<span  v-model="inventoryDetail.user_name">{{inventoryDetail.user_name}}</span>-->
      </el-form-item>
      <el-form-item label="备注" prop="procurement_id">
        <el-input v-model="inventoryDetail.inventory_remark" placeholder="请输入备注" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:showDialog', false)">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import bus, {warehouseInventoryDetail} from '../../../../common/bus.js'
  // import { createNamespacedHelpers } from 'vuex'

  // const { mapState, mapActions } = createNamespacedHelpers('types')

  export default {
    components: {},
    name: 'warehouseInventoryDetailAddOrEdit',
    props: ['showDialog', 'editRowId', 'putId'],
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
    },
    data: function () {
      return {
        addKeywords: '',
        resetForm: {
        },
        inventoryDetail: {
        },
        options: [
        ],
        on_off: {
          tempProductInfoLoading: false
        },
        tempProductStandardsInfo: [
        ],
        tempProduct: {
        },
        tempProductsInfo: [
        ]
      }
    },
    methods: {
      deleteKeywords: function (tag) {
        this.procurementDetail.keywords.splice(this.procurementDetail.keywords.indexOf(tag), 1)
      },
      handleKeywordsConfirm: function () {
        let inputValue = this.addKeywords
        if (inputValue) {
          this.procurementDetail.keywords.push(inputValue)
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
        this.procurementDetail = Object.assign({}, this.resetForm)
      },
      show: function () { // 首次显示dialog时，show方法不会执行，所以需要在mounted中调用，后续直接通过dialog的open方法调用
        this.reset()
        // 获取所有的采购用户人员
        this.getAllSaleUserInfo()
        if (this.editRowId !== null) {
          this.$http.post('/manage/warehouse/inventory/detail/getCheckInventoryById', {id: this.editRowId}, {showLoading: true}).then((response) => {
            this.inventoryDetail = response.data
          }).catch(() => {
            this.$emit('update:showDialog', false) // 关闭弹窗，这里的处理方式不太好，应该在加载完成数据后显示弹窗，这里是先显示弹窗，异常后关闭弹窗，所以会出现弹窗闪过的问题，但是因为是异步加载编辑页面的，所以无法使用事件通知弹窗
          })
        }
      },
      getAllSaleUserInfo: function () {
        this.$http.post('/manage/procurement/plan/detail/getAllProcurementUser').then((response) => {
          this.options = response.data
        })
      },
      warningMsg: function (msg) {
        this.$message({
          message: msg,
          type: 'warning'
        })
      },
      submitBefore: function () {

      },
      onSubmit: function () {
        if (this.editRowId == null && this.putId != null) {
          this.inventoryDetail.put_id = this.putId
        }
        this.$http.post('/manage/warehouse/inventory/detail/updateInventoryDetail', this.inventoryDetail).then((response) => {
          if (this.editRowId != null) {
            this.$emit('update:showDialog', false)
            bus.$emit(warehouseInventoryDetail.showAddOrEdit)
          } else {
            this.$emit('update:showDialog', false)
            bus.$emit(warehouseInventoryDetail.refreshListForAdd)
          }
        })
      },
      selectProductStandard: function (productStandardId) { // 选中商品规格 后加载所有信息出来
        let productsStandardsInfo = this.tempProductStandardsInfo
        for (let i = 0; i < productsStandardsInfo.length; i++) {
          if (productsStandardsInfo[i].product_standard_id === productStandardId) {
            this.tempProduct = Object.assign({}, this.tempProduct, productsStandardsInfo[i])
            break
          }
        }
      },
      selectProduct: function (productId) { // 选中商品 后加载商品规格信息
        let productsInfo = this.tempProductsInfo
        for (let i = 0; i < productsInfo.length; i++) {
          if (productsInfo[i].product_id === productId) {
            this.tempProduct = Object.assign({}, this.tempProduct, productsInfo[i])
            break
          }
        }
        this.$http.post('/manage/order/getProductIdStandardsInfo', {'productId': productId}).then(
          (response) => {
            this.tempProductStandardsInfo = response.data
            this.on_off.isSelectProduct = true
          }
        )
      },
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
      }
    },
    watch: {
      inventoryDetail: { // 监控inventoryDetail被修改的值,统计实采总价格
        handler (val, oldVal) {
          let isANum = false
          let isASellPrice = false
          let isABoothCost = false
          let totalMoney = 0
          let averagePrice = 0
          if (!/^\+?[1-9][0-9]*$/.test(val.put_num)) {
            isANum = true
          }
          if (!/^[0-9]+(.[0-9]{1})?$/.test(val.procurement_price)) {
            isASellPrice = true
          }
          if (!/^[0-9]+(.[0-9]{1})?$/.test(val.booth_cost)) {
            isABoothCost = true
          }
          // 计算总价格
          totalMoney = ((isANum === true ? 0 : (val.put_num)) * (isASellPrice === true ? 0 : val.procurement_price * 100)) / 100.0
          averagePrice = (((totalMoney === 0 ? 0 : totalMoney * 100) + (isABoothCost === true ? 0 : val.booth_cost * 100))) / ((isANum === true ? 0 : (val.put_num)) * 100)
          this.inventoryDetail.procurement_total_price = totalMoney
          if (!isNaN(averagePrice) && isFinite(averagePrice)) {
            this.inventoryDetail.put_average_price = Math.round(averagePrice) // Math.round(averagePrice, Math.pow(10, 2), 10) / Math.pow(10, 2)
          } else {
            this.inventoryDetail.put_average_price = 0
          }
        },
        deep: true
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
