<template>
  <el-dialog :visible.sync="showDialog" @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @open="show" @close="reset">
    <el-form ref="form" label-width="80px" label-position="right">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="客户名">
            <el-input v-model="addOrEditInfo.user_name" size="mini" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户编号">
            {{ addOrEditInfo.user_id}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单数量">
            {{ addOrEditInfo.order_num}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单时间">
            {{ addOrEditInfo.ordre_time}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品名">
            {{ addOrEditInfo.product_name}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格名">
            {{ addOrEditInfo.product_standard_name}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格编号">
            {{ addOrEditInfo.product_standard_id}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="重量(斤)">
            <el-input v-model=" addOrEditInfo.product_weight" size="mini" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出库数量">
            <el-input v-model=" addOrEditInfo.out_num" size="mini" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出库单价">
            {{ addOrEditInfo.out_price}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出库总额">
            {{ addOrEditInfo.out_total_price}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品备注">
            {{ addOrEditInfo.out_remark}}
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
    name: 'warehouseOutDetailAddOrEdit',
    props: ['showDialog', 'importParam'],
    mounted: function () {
      this.show()
    },
    data: function () {
      return {
        resetForm: {
          out_type: 0
        },
        addOrEditInfo: {
          out_type: 0
        }
      }
    },
    methods: {
      show: function () {
        console.log('show')
        this.$http.post('/manage/warehouse/out/detail/getWarehouseDetailInfo', {id: this.importParam}).then(
          (response) => {
            console.log(response)
            this.addOrEditInfo = response.data
          }
        )
      },
      onSubmit: function () { // 提交编辑信息
        console.log('onSubmit')
        this.$http.post('/manage/warehouse/out/detail/editWarehouseDetailInfo', this.addOrEditInfo).then(
          (response) => {
            this.successMsg('提交成功')
            this.$emit('update:showDialog', false)
            bus.$emit(warehouseOutDetail.refreshListForEdit)
          },
          () => {
            this.warningMsg('提交失败')
          }
        )
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
      reset: function () {
        console.log('reset')
        if (this.$refs['form']) { // 重置校验错误
          this.$refs['form'].resetFields()
        }
        try {
          this.addOrEditInfo = Object.assign({}, this.resetForm)
        } catch (e) {
        }
      }
    }
  }
</script>

<style scoped>
</style>
