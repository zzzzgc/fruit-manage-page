<template>
  <el-dialog :visible.sync="showDialog" :visible="showDialog" @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @close="reset" @open="show">
    <el-form label-width="80px" label-position="right">
      <el-row >
        <el-col v-if="importParam.id" :span="10">
          <el-form-item label="商品名">
            {{addOrEditInfo.product_name}}
          </el-form-item>
        </el-col>
        <el-col v-if="importParam.id" :span="8">
          <el-form-item label="规格名">
            {{addOrEditInfo.product_standard_name}}
          </el-form-item>
        </el-col>

        <el-col v-if="!importParam.id" :span="10">
          <el-form-item label="商品名称">
            <el-select style="width: 100%" v-model="addOrEditInfo.product_id" size="mini" filterable remote @change="selectProduct" :remote-method="productSearch" placeholder="请输入关键词" :loading="on_off.tempProductInfoLoading">
              <el-option v-for="productInfo in tempProductsInfo" :key="productInfo.product_id" :label="productInfo.product_name + '[' + productInfo.brand + ']'" :value="productInfo.product_id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="!importParam.id" :span="8">
          <el-form-item label="规格名称">
            <el-select style="width: 100%" v-model="addOrEditInfo.product_standard_id" size="mini" @change="selectProductStandard" placeholder="请输入关键词">
              <el-option v-for="productStandardInfo in tempProductStandardsInfo" :key="productStandardInfo.product_standard_id" :label="productStandardInfo.product_standard_name + '[' + productStandardInfo.product_standard_id + ']'" :value="productStandardInfo.product_standard_id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col  :span="6">
          <el-form-item label="规格编号">
            <!--<el-input v-model="addOrEditInfo.product_standard_id" size="mini" placeholder="请输入"></el-input>-->
            {{addOrEditInfo.product_standard_id}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="重量(斤)">
            <el-input v-model="addOrEditInfo.product_weight" size="mini" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出库数量">
            <el-input v-model="addOrEditInfo.out_num" size="mini" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="招待时间">
            <el-date-picker v-model="addOrEditInfo.out_time" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" size="mini" placeholder="请选择时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="领用人">
            <el-input v-model="addOrEditInfo.user_name" size="mini" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审批人">
            <el-input v-model="addOrEditInfo.approver_name" size="mini" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="招待备注">
            <el-input v-model="addOrEditInfo.out_remark" size="mini" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="$emit('update:showDialog', false)">取 消</el-button>
      </span>
  </el-dialog>
</template>

<script>
  import bus, {warehouseOutDetail} from '../../../../common/bus.js'

  export default {
    components: {},
    name: 'warehouseOutEntertainAddOrEdit',
    props: ['showDialog', 'importParam'],
    mounted: function () {
      this.show()
    },
    data: function () {
      return {
        on_off: {
          isSelectProduct: false,
          tempProductInfoLoading: false,
          isEdit: false
        },
        resetForm: {
          out_type: 1
        },
        addOrEditInfo: {
          out_type: 1
        },
        tempProduct: {},
        tempProductsInfo: [],
        tempProductStandardsInfo: []
      }
    },
    methods: {
      show: function () {
        this.reset()
        // console.log('show')
        if (this.importParam.id != null) {
          this.$http.post('/manage/warehouse/out/detail/getWarehouseDetailInfo', {id: this.importParam.id}).then(
            (response) => {
              this.addOrEditInfo = response.data
            }
          )
        }
      },
      reset: function () {
        // console.log('reset')
        if (this.$refs['form']) { // 重置校验错误
          this.$refs['form'].resetFields()
        }
        try {
          this.addOrEditInfo = Object.assign({}, this.resetForm)
        } catch (e) {
        }
      },
      successMsg: function (msg) {
        this.$message({
          message: msg,
          type: 'success'
        })
      },
      warningMsg: function (msg) {
        this.$message({
          message: msg,
          type: 'warning'
        })
      },
      onSubmit: function () { // 提交编辑信息
        console.log(Object.assign({}, this.addOrEditInfo, this.tempProduct, this.importParam))
        this.addOrEditInfo.out_Id = this.importParam.out_id
        this.$http.post('/manage/warehouse/out/detail/editWarehouseDetailInfo', Object.assign({}, this.addOrEditInfo, this.tempProduct, this.importParam)).then(
          (response) => {
            this.successMsg('提交成功')
            this.$emit('update:showDialog', false)
            bus.$emit(warehouseOutDetail.refreshListForEdit)
          },
          () => {
            this.$emit('update:showDialog', false)
            this.warningMsg('提交失败')
          }
        )
      },
      productSearch: function (inputContent) { // 查询商品
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
      selectProduct: function (productId) { // 选中商品 后加载商品规格信息
        console.log('选中商品啦')
        console.log(productId)
        let productsInfo = this.tempProductsInfo
        for (let i = 0; i < productsInfo.length; i++) {
          if (productsInfo[i].product_id === productId) {
            this.tempProduct = Object.assign({}, this.tempProduct, productsInfo[i])
            break
          }
        }
        this.$http.post('/manage/order/getProductIdStandardsInfo', {'productId': productId}).then(
          (response) => {
            console.log('获取商品规格信息')
            console.log(response.data)
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
            this.addOrEditInfo.product_standard_id = this.tempProduct.product_standard_id
            break
          }
        }
      }
    }
  }
</script>

<style scoped>
</style>
