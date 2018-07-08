<template>
  <el-dialog title="添加标签类型" :visible="showDialog" @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @close="reset" @open="show">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" label-position="right" class="form-style">
      <el-form-item label="分类标签名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="权重" prop="sort">
        <el-input-number v-model="form.sort" :min="1" :max="9999999"></el-input-number>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status">
          <el-option label="启用" :value=1></el-option>
          <el-option label="禁用" :value=0></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:showDialog', false)">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import bus, {typeGroup} from '../../common/bus.js'

export default {
  name: 'typeGroupAdd',
  props: ['showDialog', 'editRowId'],
  data: function () {
    return {
      showForm: false,
      resetForm: {name: '', sort: '99', status: 0},
      form: {},
      rules: {
        name: [
          {required: true, message: '请输入分类标签名称', trigger: 'blur'},
          {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}
        ],
        sort: [
          {type: 'integer', required: true, message: '请输入权重', trigger: 'blur'}
        ]
      }
    }
  },
  mounted: function () {
    this.show()
  },
  methods: {
    show: function () {
      this.reset()
    },
    onSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return false }
        this.$http.post('/manage/typeGroup/save', this.form, {showLoading: true}).then((response) => {
          this.$message({type: 'success', message: '添加数据成功'})
//          this.showForm = false
          this.$emit('update:showDialog', false)
          bus.$emit(typeGroup.refreshListForAdd)
        })
      })
    },
    reset: function () {
      if (this.$refs['form']) { // 重置校验错误
        this.$refs['form'].resetFields()
      }
      this.form = Object.assign({}, this.resetForm)
    }
  }
}
</script>

<style scoped>
</style>
