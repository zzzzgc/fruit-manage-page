<template>
  <div class="table-list">
    <div class="action">
      <el-button type="primary" size="small" @click="add">新增合作商家</el-button>
    </div>
    <el-table :data="tableData" @selection-change="selectChange" :default-sort="orderInfo" @sort-change="sortChange" highlight-current-row style="width: 100%">
      <!--{{scope.row}}-->
      <el-table-column type="selection" width="30"></el-table-column>
      <!--<el-table-column fixed type="index" label="序号" width="70"></el-table-column>-->
      <!--<el-table-column fixed prop="business_id" label="编号" min-width="25"></el-table-column>-->
      <el-table-column fixed prop="uid" label="商家编号" min-width="50"></el-table-column>
      <el-table-column fixed prop="business_phone" label="手机号" min-width="80"></el-table-column>
      <el-table-column prop="business_name" label="商家名" min-width="80"></el-table-column>
      <el-table-column prop="address_province" label="省" min-width="50"></el-table-column>
      <el-table-column prop="address_city" label="市" show-overflow-tooltip min-width="50"></el-table-column>
      <el-table-column prop="address_detail" label="收货地址" min-width="180"></el-table-column>
      <el-table-column prop="address_shop" label="店铺地址" width="180"></el-table-column>
      <el-table-column prop="sales_name" label="销售名" width="60"></el-table-column>
      <el-table-column prop="sales_phone" label="销售手机号" width="80"></el-table-column>
      <el-table-column prop="create_time" label="注册时间" width="180"></el-table-column>
      <!--<el-table-column prop="audit" label="状态" width="40"></el-table-column>-->
      <el-table-column fixed="right" prop="audit" label="审核状态" width="100">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.audit != null" v-model="scope.row.audit" :active-value=2 :inactive-value=1 @change="status => setStatus(status, scope.row.uid)"></el-switch>
          <div v-else-if="scope.row.business_id != null" style="color: red">
            用户未认证
          </div>
          <div v-else style="color: red">
            用户未绑定店铺
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" prop="audit" label="禁单开关" width="100">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.audit != null" v-model="scope.row.lock" :active-value=1 :inactive-value=0 @change="status => setLockStatus(status, scope.row.uid)"></el-switch>
          <div v-else-if="scope.row.business_id != null" style="color: red">
            用户未认证
          </div>
          <div v-else style="color: red">
            用户未绑定店铺
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">+
          <el-button :disabled="scope.row.audit == null" @click="edit(scope.row)" type="text" size="small">编辑</el-button>
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
    <component :is="editCompName" :showDialog.sync="showEdit" :editRowId="editRowId"></component>
  </div>
</template>

<script>
  import bus, {customer} from '../../common/bus.js'
  import {localStorageKeys} from '../../common/const.js'

  export default {
    name: 'customer',
    components: {
      // customerEdit: resolve => require(['./AddOrEdit'], resolve) // 必须用下面的方式加载，否则会出现组件加载完成后立即销毁（一闪而过）
      customerEdit: resolve => {
        require(['./AddOrEdit'], resolve)
      }
    },
    created: function () {
      bus.$on(customer.search, (searchData) => { // 监听外部查询数据事件
        this.search(searchData)
      })
      bus.$on(customer.refreshListForEdit, () => { // 监听数据更改后的列表刷新（刷新当前页）
        this.getData()
      })
      bus.$on(customer.refreshListForAdd, () => { // 监听数据添加后的列表刷新
        this.resetPageInfo()
        this.orderInfo.prop = 'buser.create_time'
        this.orderInfo.order = 'descending'
        this.getData()
      })
    },
    watch: {
      '$route': function (to, from) {
        this.getData()
      }
    },
    data: function () {
      let pageSize = localStorage.getItem(localStorageKeys.productPageSize)
      return {
        editCompName: '', // 用于动态加载编辑组件
        showEdit: false, // 是否展示编辑弹窗
        editRowId: null, // 编辑的记录ID,
        tableData: [],
        selectIds: [],
        searchData: {},
        pageInfo: {
          pageNum: 1,
          totalRec: 0,
          pageSize: pageSize == null ? 10 : parseInt(pageSize)
        },
        orderInfo: {prop: 'buser.create_time', order: 'descending'}
      }
    },
    methods: {
      add: function () { // 添加记录
        this.editCompName = 'customerEdit'
        this.editRowId = null
        this.showEdit = true
      },
      edit: function (row) { // 编辑某条记录
        this.editCompName = 'customerEdit'
        this.editRowId = row.business_id
        this.showEdit = true
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
      getData: function () { // 获取服务器数据
        this.$http.post('/manage/customer/getData', Object.assign({}, this.searchData, this.pageInfo, this.orderInfo)).then((response) => {
          this.pageInfo.totalRec = response.data.totalRow
          this.tableData = response.data.list
        })
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
      setStatus: function (status, uid) { // 审核状态改变
        console.log(uid + '号用户,审核状态改变后: ' + status)
        this.$http.post('/manage/customer/setStatus', {status: status, uid: uid}).then(
          (response) => {
            console.log('修改成功')
          },
          (response) => {
            console.log('修改失败')
          }
        )
        this.getData()
      },
      setLockStatus: function (status, uid) { // 禁单状态改变
        console.log(uid + '号用户,审核状态改变后: ' + status)
        this.$http.post('/manage/customer/setLockStatus', {status: status, uid: uid}).then(
          (response) => {
            console.log('修改成功')
          },
          (response) => {
            console.log('修改失败')
          }
        )
        this.getData()
      }
    }
  }
</script>

<style scoped>

</style>
