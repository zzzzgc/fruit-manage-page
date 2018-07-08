<template>
  <el-dialog title="添加/编辑-幻灯片"  :visible="showDialog" @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @close="reset" @open="show">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right" class="form-style">
      <el-form-item label="分组标签" prop="group_key">
        <el-input v-model="form.group_key"></el-input>
      </el-form-item>
      <el-form-item label="分组内标签" prop="key">
        <el-input v-model="form.key"></el-input>
      </el-form-item>
      <el-form-item label="幻灯片名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="des">
        <el-input type="textarea" v-model="form.des"></el-input>
      </el-form-item>
      <el-form-item label="权重" prop="sort">
        <el-input-number v-model="form.sort" :min="1" :max="9999999"></el-input-number>
      </el-form-item>
      <el-form-item label="链接地址" prop="click_url">
        <el-input v-model="form.click_url"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="img_url">
        <el-upload class="pic-uploader"
          :action="_uploadFilePath"
          :show-file-list="false"
          :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">
          <img v-if="form.img_url" :src="form.img_url" class="pic-img" @error="imgError">
          <i v-else class="el-icon-plus pic-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model=form.status placeholder="请选择状态">
          <el-option label="下线" :value=0></el-option>
          <el-option label="上线" :value=1></el-option>
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
import bus, {banner} from '../../common/bus.js'
import {objNullToBlank} from '../../common/utils.js'

export default {
  name: 'banner-AddOrEdit',
  props: ['showDialog', 'editRowId'],
  mounted: function () {
    this.show()
  },
  data: function () {
    return {
//      showForm: false,
//      loading: false,
      resetForm: {id: '', group_key: '', key: '', name: '', des: '', status: null, sort: '99', click_url: '', img_url: ''},
      form: {},
      rules: {
        group_key: [
          {type: 'string', required: true, message: '请输入分组标签', trigger: 'blur'}
        ],
        key: [
          {type: 'string', required: true, message: '请输入分组内标签', trigger: 'blur'}
        ],
        name: [
          {type: 'string', required: true, message: '请输入幻灯片名称', trigger: 'blur'}
        ],
        sort: [
          {type: 'integer', required: true, message: '请输入权重', trigger: 'blur'}
        ],
        url: [
          {type: 'url', message: '必须为URL格式', trigger: 'blur'}
        ],
        img_url: [
          {required: true, message: '请上传图片', trigger: 'blur'}
        ],
        status: [
          {type: 'integer', required: true, message: '请选择状态', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    imgError: function () {
      this.form.img_url = ''
    },
    show: function () {
      this.reset()
      if (this.editRowId !== null) {
        this.$http.post('/manage/banner/info', {id: this.editRowId}).then((response) => {
//          this.showForm = true
          this.form = Object.assign({}, this.resetForm, objNullToBlank(response.data))
        })
      }
    },
    handleAvatarScucess: function (res, file) {
      if (res) {
        console.log(res)
        this.form.img_url = this._downloadFilePath + res
      } else {
        this.$message.error('该图片不支持上传，请更换一张！')
      }
    },
    beforeAvatarUpload: function (file) {
      const isRightType = file.type.indexOf('image/') === 0
      const isRightSize = file.size / 1024 / 1024 < 5
      if (!isRightType) {
        this.$message.error('上传文件必须为图片格式!')
      }
      if (!isRightSize) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isRightSize && isRightType
    },
    onSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return false }
        this.$http.post('/manage/banner/save', this.form, {showLoading: true}).then((response) => {
//          this.showForm = false
          this.$emit('update:showDialog', false)
          if (this.form.id !== '') { // 编辑完成（刷新列表当前页）
            this.$message({type: 'success', message: '编辑数据成功'})
            bus.$emit(banner.refreshListForEdit, this.form)
          } else { // 新增完成（跳到第一页）
            this.$message({type: 'success', message: '添加数据成功'})
            bus.$emit(banner.refreshListForAdd, this.form)
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
