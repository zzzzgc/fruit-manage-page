<template>
  <el-dialog title="客户添加/编辑" :visible="showDialog" @update:visible="(val) => $emit('update:showDialog', val)"
             :close-on-click-modal=false @open="show" @close="reset">
    <el-form ref="form" :model="procurementPlanDetail" label-width="100px" label-position="right"
             class="form-style">
      <el-form-item v-if="this.editRowId !== null" label="店铺ID" prop="id">{{procurementPlanDetail.id}}</el-form-item>
      <el-form-item label="商品名称" prop="product_name">
        <!--<el-input v-model="procurementPlanDetail.product_name" placeholder="请输入商品名"></el-input>-->
        <span v-model="procurementPlanDetail.product_name">{{procurementPlanDetail.product_name}}</span>
      </el-form-item>
      <el-form-item label="规格名称" prop="product_standard_name">
        <!--<el-input v-model="procurementPlanDetail.product_standard_name" placeholder="请输入规格名称"></el-input>-->
        <span  v-model="procurementPlanDetail.product_standard_name">{{procurementPlanDetail.product_standard_name}}</span>
      </el-form-item>
      <el-form-item label="规格编号" prop="product_standard_id">
        <!--<el-input v-model="procurementPlanDetail.product_standard_id" placeholder="请输入规格编号"></el-input>-->
        <span  v-model="procurementPlanDetail.product_standard_id">{{procurementPlanDetail.product_standard_id}}</span>
      </el-form-item>
      <el-form-item label="报价" prop="sell_price">
        <!--<el-input v-model="procurementPlanDetail.sell_price" placeholder="请输入报价"></el-input>-->
        <span  v-model="procurementPlanDetail.sell_price">{{procurementPlanDetail.sell_price}}</span>
      </el-form-item>
      <el-form-item label="下单数量" prop="product_standard_num">
        <!--<el-input v-model="procurementPlanDetail.product_standard_num" placeholder="请输入下单数量"></el-input>-->
        <span  v-model="procurementPlanDetail.product_standard_num">{{procurementPlanDetail.product_standard_num}}</span>
      </el-form-item>
      <el-form-item label="库存数量" prop="inventory_num">
        <!--<el-input v-model="procurementPlanDetail.inventory_num" placeholder="请输入库存数量"></el-input>-->
        <span  v-model="procurementPlanDetail.inventory_num">{{procurementPlanDetail.inventory_num}}</span>
      </el-form-item>
      <el-form-item label="采购人" prop="procurement_id">
        <el-select v-model="procurementPlanDetail.procurement_id" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采购数量" prop="procurement_num">
        <el-input v-model="procurementPlanDetail.procurement_num" placeholder="请输入采购数量"></el-input>
      </el-form-item>
      <el-form-item label="实采单价" prop="procurement_need_price">
        <el-input v-model="procurementPlanDetail.procurement_need_price" placeholder="请输入实采单价"></el-input>
      </el-form-item>
      <el-form-item label="实采总价" prop="procurement_total_price">
        <!--<el-input v-model="procurementPlanDetail.procurement_total_price" placeholder="请输入实采总价"></el-input>-->
        <span v-model="procurementPlanDetail.procurement_total_price">{{procurementPlanDetail.procurement_total_price}}</span>
      </el-form-item>
      <el-form-item label="采购备注" prop="procurement_remark">
        <el-input type="textarea" v-model="procurementPlanDetail.procurement_remark" placeholder="请输入采购备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:showDialog', false)">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import bus, {procurementDetail} from '../../../../common/bus.js'
  // import { createNamespacedHelpers } from 'vuex'

  // const { mapState, mapActions } = createNamespacedHelpers('types')

  export default {
    components: {},
    name: 'procurementDetailAddOrEdit',
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
      this.show()
    },
    data: function () {
      return {
        addKeywords: '',
        resetForm: {
        },
        procurementPlanDetail: {
        },
        options: [
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
          this.$http.post('/manage/procurement/plan/detail/getPPlanDetailByID', {id: this.editRowId}, {showLoading: true}).then((response) => {
            if (response.data.procurement_remark === 'null') {
              response.data.procurement_remark = ''
            }
            this.procurementPlanDetail = response.data
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
        this.$http.post('/manage/procurement/plan/detail/updatePPlanDetailTwo', this.procurementPlanDetail).then((response) => {
          console.log(response)
          if (response.data) {
            this.showAddDialog = false
            this.$emit('update:showDialog', false)
            bus.$emit(procurementDetail.showAddOrEdit)
          }
        })
      }
    },
    watch: {
      procurementPlanDetail: { // 监控procurementPlanDetail被修改的值,统计实采总价格
        handler (val, oldVal) {
          let isANum = false
          let isASellPrice = false
          let totalMoney = 0
          if (!/^\+?[1-9][0-9]*$/.test(val.procurement_num)) {
            // val[product].num = 1
            isANum = true
          }
          if (!/^[0-9]+(.[0-9]{1})?$/.test(val.procurement_need_price)) {
            // val[product].sell_price = 1.0
            isASellPrice = true
          }
          // 计算总价格
          totalMoney += ((isANum === true ? 0 : (val.procurement_num)) * (isASellPrice === true ? 0 : val.procurement_need_price * 10)) / 10.0
          this.procurementPlanDetail.procurement_total_price = totalMoney
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
