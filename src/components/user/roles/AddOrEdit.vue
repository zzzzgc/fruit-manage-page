<template>
  <el-dialog title="添加/编辑-角色"  :visible="showDialog" @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @close="reset" @open="show">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right" class="form-style">
      <el-form-item label="角色标识" prop="role_key">
        <el-input v-model="form.role_key"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="role_name">
        <el-input v-model="form.role_name"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="describe">
        <el-input type="textarea" v-model="form.describe"></el-input>
      </el-form-item>
      <el-form-item label="关联菜单" prop="menuIds">
        <el-checkbox-group v-model="form.menuIds">
          <el-checkbox v-for="item in menuStore.menuList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="关联权限" prop="permissionIds">
        <el-checkbox-group v-model="form.permissionIds">
          <el-checkbox v-for="item in permissionStore.permissionList" :label="item.id" :key="item.id">{{item.permission_name}}</el-checkbox>
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
import bus, {role} from '../../../common/bus.js'
import {objNullToBlank} from '../../../common/utils.js'
import { MENU_ALL_LIST, PERMISSION_LIST } from '../../../store/action-types'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'role-AddOrEdit',
  props: ['showDialog', 'editRowId'],
  mounted: function () {
    this.getPermissions()
    this.getMenus()
    this.show()
  },
  data: function () {
    return {
//      showForm: false,
//      loading: false,
      resetForm: {id: '', role_key: '', role_name: '', describe: '', menuIds: [], permissionIds: []},
      form: {},
      rules: {
        role_key: [
          {type: 'string', required: true, message: '请输入角色标识', trigger: 'blur'}
        ],
        role_name: [
          {type: 'string', required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        menuIds: [
          {type: 'array', required: true, message: '请授予访问菜单', trigger: 'blur,change'}
        ],
        permissionIds: [
          {type: 'array', required: true, message: '请授予权限', trigger: 'blur,change'}
        ]
      }
    }
  },
  computed: mapState({
    'permissionStore': 'permission',
    'menuStore': 'menu'
  }),
  methods: {
    show: function () {
      this.reset()
      if (this.editRowId !== null) {
        this.$http.post('/manage/role/info', {id: this.editRowId}).then((response) => {
          this.form = Object.assign({}, this.resetForm, objNullToBlank(response.data))
        })
      }
    },
    ...mapActions({
      getMenus: MENU_ALL_LIST,
      getPermissions: PERMISSION_LIST
    }),
    onSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return false }
        this.$http.post('/manage/role/save', this.form, {showLoading: true}).then((response) => {
//          this.showForm = false
          this.$emit('update:showDialog', false)
          if (this.form.id !== '') { // 编辑完成（刷新列表当前页）
            this.$message({type: 'success', message: '编辑数据成功'})
            bus.$emit(role.refreshListForEdit, this.form)
          } else { // 新增完成（跳到第一页）
            this.$message({type: 'success', message: '添加数据成功'})
            bus.$emit(role.refreshListForAdd, this.form)
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
