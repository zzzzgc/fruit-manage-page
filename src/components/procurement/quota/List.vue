<template>
  <div class="quota-content">
    <div class="table-list action">
      <el-button type="primary" size="small" @click="outExcel">导出商品库</el-button>
      <el-button type="primary" size="small" @click="intoExcel">导入采购配额</el-button>
      <span style="font-size: 12px;color: #48576a">xls表头顺序：商品名 商品编码 规格名 采购姓名 采购人编号</span>
      <!--{{$route.params.quotaStatus}}-->
    </div>

    <el-table :data="tableData" :default-sort="defaultSort" @sort-change="sortChange" border highlight-current-row style="width: 100%">
      <el-table-column prop="product_name" label="商品名称"></el-table-column>
      <el-table-column prop="product_standard_id" label="商品编码"></el-table-column>
      <el-table-column prop="product_standard_name" label="规格名称"></el-table-column>
      <el-table-column prop="product_standard_id" label="规格名称"></el-table-column>
      <el-table-column prop="procurement_name" label="采购姓名"></el-table-column>
      <el-table-column prop="procurement_id" label="采购编号"></el-table-column>
      <el-table-column prop="create_user_name" label="创建人"></el-table-column>
      <el-table-column prop="create_time" sortable label="创建时间"></el-table-column>
      <!--<el-table-column prop="update_time" sortable label="修改时间"></el-table-column>-->
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageInfo.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalRec" style="text-align: center;">
    </el-pagination>
    <el-dialog ref="update_from" title="导入采购配额" :visible.sync="on_off.updateDialog" width="30%">
      <el-upload class="upload-demo" :limit="1" drag :action="_uploadFilePath" :on-success="uploadSuccess" :before-upload="uploadBefore">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过600kb</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="on_off.updateDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateExcelUrl">确 定</el-button>
      </span>
    </el-dialog>
    <!--<component :is="addAndEdit.editCompName" :showDialog.sync="addAndEdit.showEdit" :editRowId="addAndEdit.editRowId"></component>-->
  </div>
</template>
<script>
  import {localStorageKeys} from '../../../common/const.js'
  import bus, {procurementQuota} from '../../../common/bus.js'

  export default {
    created: function () {
      bus.$on(procurementQuota.search, (searchData) => { // 监听外部查询数据事件
        this.search(searchData)
      })
      this.getData()
    },
    components: {},
    computed: {},
    data: function () {
      let pageSize = localStorage.getItem(localStorageKeys.orderPageSize)
      return {
        pageInfo: { // 页面信息
          pageNum: 1,
          totalRec: 0,
          pageSize: pageSize == null ? 10 : parseInt(pageSize)
        },
        updateInfo: {
          fileName: ''
        },
        defaultSort: {
          prop: 'create_time',
          order: 'descending'
        },
        searchData: {},
        tableData: [],
        on_off: {
          updateDialog: false
        }
      }
    },
    methods: {
      getData: function () { // 获取服务器数据
        this.$http.post('/manage/procurement/quota/getData', Object.assign({}, this.defaultSort, this.searchData, this.pageInfo)).then((response) => {
          console.log(response)
          this.pageInfo.totalRec = response.data.totalRow
          this.tableData = response.data.list
        })
      },
      handleSizeChange: function (val) { // 每页条数改变时重新加载记录
        this.pageInfo.pageSize = val
        localStorage.setItem(localStorageKeys.procurementQuotaPageSize, val)
        this.getData()
      },
      handleCurrentChange: function (val) { // 页码改变时重新加载记录
        this.pageInfo.pageNum = val
        this.getData()
      },
      search: function (data) { // 点击搜索时执行
        this.resetPageInfo()
        this.searchData = data
        this.getData()
      },
      resetPageInfo: function () { // 重置分页参数
        this.pageInfo.totalRec = 0
        this.pageInfo.pageNum = 1
      },
      isSure: function (Promptmsg, yesMsg, noMsg) { // 提示确认
        this.$confirm('此操作' + Promptmsg + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$http.post('/manage/quota/setStatusAll').then(
          //   (response) => {
          //     this.successMsg(yesMsg)
          //   }
          // )
          this.getData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: noMsg
          })
        })
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
      outExcel: function () { // 导出表格
        // console.log(this._downloadFilePath)
        // console.log(this._uploadFilePath)
        // TODO 获取服务器文件
        // location.href = this._downloadExcelFilePath + 'getProductStandardAllInfoExcel'
        location.href = this._downloadExcelFilePath + 'getProductStandardAllInfoExcel'
        // location.href = 'http://localhost:8080/manage/excel/getProductStandardAllInfoExcel'
      },
      intoExcel: function () {
        this.on_off.updateDialog = true
      },
      uploadSuccess: function (response, file, fileList) {
        if (response) {
          console.log(response)
          this.updateInfo.fileName = response
        } else {
          this.$message.error('该文件不支持上传，请更换一张！')
        }
      },
      uploadBefore: function (file) {
        console.log(file)
        const isRightType = file.type.indexOf('application/vnd') === 0
        const isRightSize = file.size / 1024 / 1024 < 6
        if (!isRightType) {
          this.$message.error('上传文件必须为xlsx格式!')
        }
        if (!isRightSize) {
          this.$message.error('上传图片大小不能超过 6MB!')
        }
        return isRightSize && isRightType
      },
      reset: function () {
        if (this.$refs['update_from']) { // 重置校验错误
          this.$refs['update_from'].resetFields()
        }
        try {
          this.form = Object.assign({}, this.resetForm)
        } catch (e) {}
      },
      updateExcelUrl: function () {
        this.$http.post('/manage/excel/setProcurementQuota', {fileName: this.updateInfo.fileName}).then(
          (response) => {
            this.on_off.updateDialog = false
            this.successMsg('导入成功')
            this.getData()
          }
        )
      },
      sortChange: function ({column, prop, order}) { // 排序改变
        if (prop === this.pageInfo.prop && order === this.pageInfo.order) {
          return
        }
        this.pageInfo.prop = prop
        this.pageInfo.order = order
        this.resetPageInfo()
        this.getData()
      }
    }
  }
</script>

<style scoped lang="scss">
  .quota-content {
    .action {
      padding: 10px;
      background: white;
    }
  }

</style>
