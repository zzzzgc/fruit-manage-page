<template>
  <div class="table-list">
    <div class="action">
      <el-button type="primary" size="small" @click="add">添加</el-button>
      <el-upload style="display:inline-block;margin-left:10px;"
                 class="upload-demo"
                 :action="_uploadFilePath"
                 :on-change="handleChange"
                 :before-upload="uploadBefore"
                 :show-file-list="false"
                 :file-list="fileList">
        <el-button size="small" type="primary">导入商品行情</el-button>
      </el-upload>
      <el-button type="success" size="small" @click="setStatus(1)">批量上架</el-button>
      <el-button size="small" @click="setStatus(0)">批量下架</el-button>
      <el-button type="danger" size="small" @click="setStatus(-1)">批量删除</el-button>
    </div>
    <el-table :data="tableData" @row-dblclick="showStandardList" @selection-change="selectChange" :default-sort="orderInfo" @sort-change="sortChange" highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <!--<el-table-column fixed type="index" label="序号" width="70"></el-table-column>-->
      <el-table-column fixed prop="id" label="ID" min-width="50"></el-table-column>
      <!--<el-table-column fixed prop="name" label="名称" min-width="70"></el-table-column>-->
      <el-table-column fixed prop="name" label="名称" min-width="100">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.errorInfo" trigger="hover" placement="top">
            <p>{{ scope.row.errorInfo }}</p>
            <div slot="reference" style="color: red;">
              {{ scope.row.name }}
            </div>
          </el-popover>
          <div v-else>
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="country" label="国家" min-width="70"></el-table-column>
      <el-table-column prop="brand" label="品牌" min-width="70"></el-table-column>
      <el-table-column prop="fruit_type" label="水果类型" show-overflow-tooltip min-width="100"></el-table-column>
      <el-table-column sortable prop="sort" label="排序" min-width="50"></el-table-column>
      <el-table-column sortable prop="fresh_time" label="保鲜时长(天)" width="90" :formatter="formatterFreshTime"></el-table-column>
      <el-table-column prop="fruit_des" label="果品特征" width="180"></el-table-column>
      <el-table-column prop="store_way" label="存储方式" width="180"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="update_time" label="更新时间" width="180"></el-table-column>
      <el-table-column fixed="right" prop="total_sell_num" label="总销量" width="70"></el-table-column>
      <el-table-column fixed="right" prop="week_sell_num" label="周销量" width="70"></el-table-column>
      <el-table-column fixed="right" prop="status" label="状态" width="70">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value=1 :inactive-value=0 @change="val => setStatus(val, scope.row.id)"></el-switch>
          <!--<el-tag :type="scope.row.status === 1 ? 'success' : 'gray'" close-transition>{{scope.row.status === 1 ? '启用' :  '禁用'}}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="market(scope.row)" type="text" size="small">行情</el-button>
          <!--<el-button @click="setStatus(scope.row.status === 1 ? 0 : 1, [scope.row.id])" type="text" size="small" :class="scope.row.status === 1 ? 'disable' : 'enable'">{{scope.row.status === 1 ? '禁用' : '启用'}}</el-button>-->
          <el-button @click="setStatus(-1, [scope.row.id])" type="text" size="small" class="delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="pageInfo.totalRec" class="table-pager">
    </el-pagination>
    <!--layout="total, sizes, prev, pager, next, jumper"-->
    <component :is="editCompName" :showDialog.sync="showEdit" :editRowId="editRowId"></component>
  </div>
</template>

<script>
  import bus, {product, productStandard} from '../../common/bus.js'
  import {localStorageKeys} from '../../common/const.js'

  export default {
    name: 'product',
    components: {
      // productEdit: resolve => require(['./AddOrEdit'], resolve) // 必须用下面的方式加载，否则会出现组件加载完成后立即销毁（一闪而过）
      productEdit: resolve => {
        require(['./AddOrEdit'], resolve)
      },
      market: resolve => {
        require(['./Market'], resolve)
      }
    },
    created: function () {
      bus.$on(product.search, (searchData) => { // 监听外部查询数据事件
        this.search(searchData)
      })
      bus.$on(product.edit, () => { // 监听数据更改后的列表刷新（刷新当前页）
        this.getData()
      })
      bus.$on(product.add, () => { // 监听数据添加后的列表刷新
        this.resetPageInfo()
        this.orderInfo.prop = 'create_time'
        this.orderInfo.order = 'descending'
        this.getData()
      })
    },
    data: function () {
      let pageSize = localStorage.getItem(localStorageKeys.productPageSize)
      return {
        editCompName: '', // 用于动态加载编辑组件
        showEdit: false, // 是否展示编辑弹窗
        editRowId: null, // 编辑的记录ID
        showStandard: false, // 是否展示规格
        fileList: [],
        pageInfo: {
          pageNum: 1,
          totalRec: 0,
          pageSize: pageSize == null ? 10 : parseInt(pageSize)
        },
        searchData: {},
        orderInfo: {prop: 'create_time', order: 'descending'},
        tableData: [],
        selectIds: []
      }
    },
    methods: {
      search: function (data) { // 点击搜索时执行
        this.resetPageInfo()
        this.searchData = data
        this.getData()
      },
      resetPageInfo: function () { // 重置分页参数
        this.pageInfo.totalRec = 0
        this.pageInfo.pageNum = 1
      },
      getData: function () { // 获取服务器数据
        this.$http.post('/product/getData', Object.assign({}, this.searchData, this.pageInfo, this.orderInfo)).then((response) => {
          this.pageInfo.totalRec = response.data.totalRow
          this.tableData = response.data.list
        })
      },
      setStatus: function (status, selectIds) { // 请求服务器设置状态
        selectIds = selectIds || this.selectIds
        if (selectIds.length === 0) {
          this.$alert('未选择记录', '提示', {confirmButtonText: '确定', closeOnClickModal: true, type: 'warning'})
          return
        }
        if (status === -1) { // 如果是删除，则提示
          this.$confirm('确认要删除数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this._setStatus(status, selectIds)
          }).catch(() => {
          })
        } else {
          this._setStatus(status, selectIds)
        }
      },
      _setStatus: function (status, selectIds) {
        // let testObj = {id: 1, name: 'test', mark: 'test'}
        // let testObj = [{id: 1, name: 'test', mark: 'test'}, [id: 2, name: 'test2', mark: 'test2'], [id: 3, name: 'test3', mark: 'test3']}
        this.$http.post('/product/setStatus', {ids: selectIds, status: status}).then((response) => {
          this.getData()
        }).catch((e) => { // 异常后重新获取数据，正确显示状态
          this.getData()
        })
      },
      edit: function (row) { // 编辑某条记录
        this.editCompName = 'productEdit'
        this.editRowId = row.id
        this.showEdit = true
      },
      uploadBefore: function (file) {
        console.log(file)
        const isRightType = file.type.indexOf('application/vnd') === 0
        const isRightSize = file.size / 1024 < 500
        if (!isRightType) {
          this.$message.error('上传文件必须为xlsx或xls格式!')
        }
        if (!isRightSize) {
          this.$message.error('上传文件大小不能超过 500kb!')
        }
        return isRightSize && isRightType
      },
      handleChange: function (file, fileList) {
        if (typeof (file.response) !== 'undefined') {
          let loading = this.$loading({
            lock: true,
            text: '正在导入商品行情表,请稍等...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.$http.post('/manage/excel/importProductAllInfo', {'fileName': file.response}).then(
            (response) => {
              console.log(response)
              if (response != null) {
                let sendMsg = ''
                for (let msg of response.data) {
                  sendMsg += msg + '<br>'
                }
                this.$alert(sendMsg, '警告', { dangerouslyUseHTMLString: true, confirmButtonText: '确定' })
              }
              loading.close()
              this.getData()
              this.successMsg('导入成功!')
            },
            (response) => {
              loading.close()
            }
          ).catch((response) => {
            loading.close()
            this.warningMsg('导入失败!')
          })
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
      market: function (row) {
        this.editCompName = 'market'
        this.editRowId = row.id
        this.showEdit = true
      },
      showStandardList: function (row) {
        bus.$emit(productStandard.search, row.id)
      },
      add: function () { // 添加记录
        this.editCompName = 'productEdit'
        this.editRowId = null
        this.showEdit = true
      },
      handleSizeChange: function (val) { // 每页条数改变时重新加载记录
        this.pageInfo.pageSize = val
        localStorage.setItem(localStorageKeys.productPageSize, val)
        this.getData()
      },
      handleCurrentChange: function (val) { // 页码改变时重新加载记录
        this.pageInfo.pageNum = val
        this.getData()
      },
      selectChange: function (selectRows) { // 每次选择行时，更新选择的记录ID
        this.selectIds.splice(0, this.selectIds.length) // 清空选择的id
        for (let i = 0; i < selectRows.length; i++) {
          this.selectIds.push(selectRows[i].id)
        }
      },
      sortChange: function ({column, prop, order}) { // 排序改变
        if (prop === this.orderInfo.prop && order === this.orderInfo.order) {
          return
        }
        this.orderInfo.prop = prop
        this.orderInfo.order = order
        this.resetPageInfo()
        this.getData()
      },
      formatterFreshTime: function (row, column) {
        return row.fresh_time / (24 * 60)
      }
    }
  }
</script>

<style scoped>
</style>
