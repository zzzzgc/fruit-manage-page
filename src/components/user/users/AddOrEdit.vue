<template>
  <el-dialog title="添加/编辑-用户"  :visible="showDialog" @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @close="reset" @open="show">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right" class="form-style">
      <el-form-item label="用户昵称" prop="nick_name">
        <el-input v-model="form.nick_name"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="关联角色" prop="roleIds">
        <el-checkbox-group v-model="form.roleIds">
          <el-checkbox v-for="item in roleStore.roleList" :label="item.id" :key="item.id">{{item.role_name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:showDialog', false)">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import bus, {user} from '../../../common/bus.js'
import {objNullToBlank} from '../../../common/utils.js'
import { ROLE_ALL_LIST } from '../../../store/action-types'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'user-AddOrEdit',
  props: ['showDialog', 'editRowId'],
  mounted: function () {
    this.getRoles()
    this.show()
  },
  data: function () {
    return {
//      showForm: false,
//      loading: false,
      resetForm: {id: '', nick_name: '', phone: '', roleIds: []},
      form: {},
      rules: {
        nick_name: [
          {type: 'string', required: true, message: '请输入用户昵称', trigger: 'blur'}
        ],
        phone: [
          {type: 'string', required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        roleIds: [
          {type: 'array', required: true, message: '请授予角色', trigger: 'blur,change'}
        ]
      }
    }
  },
  computed: mapState({
    'roleStore': 'role'
  }),
  methods: {
    show: function () {
      this.reset()
      if (this.editRowId !== null) {
        this.$http.post('/manage/user/info', {id: this.editRowId}).then((response) => {
          this.form = Object.assign({}, this.resetForm, objNullToBlank(response.data))
        })
      }
    },
    ...mapActions({
      getRoles: ROLE_ALL_LIST
    }),
    onSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return false }
        this.$http.post('/manage/user/save', this.form, {showLoading: true}).then((response) => {
//          this.showForm = false
          this.$emit('update:showDialog', false)
          if (this.form.id !== '') { // 编辑完成（刷新列表当前页）
            this.$message({type: 'success', message: '编辑数据成功'})
            bus.$emit(user.refreshListForEdit, this.form)
          } else { // 新增完成（跳到第一页）
            this.$message({type: 'success', message: '添加数据成功'})
            bus.$emit(user.refreshListForAdd, this.form)
          }
        })
      })
    },
    reset: function () {
      if (this.$refs['form']) { // 重置校验错误
        this.$refs['form'].resetFields()
      }
      try {
        this.form = Object.assign({}, this.resetForm)
      } catch (e) {}
    }
  }
}
</script>

<style>
.pic-uploader .el-upload{
  border: 1px dashed #bfcbd9;
  border-radius: 6px;
  cursor: pointer;
}
.pic-uploader .el-upload:hover{
  border-color: #20a0ff;
}
.pic-uploader img{
  width: 350px;
}
.pic-uploader-icon{
  padding: 100px 160px;
  font-size: 28px;
}
</style>
