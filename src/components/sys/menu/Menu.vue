<template>
  <el-container style="height: 100%">
    <el-aside width="300px" style="">
      <div style="margin: 50px;">
        <el-tree :data="tempMenus" :props="defaultProps" @node-click="handleNodeClick">
          <span :id="data.id" class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{data.name}}</span>
            <span>
              <el-button type="text" size="mini" @click.stop="() => append(data)">
                添加
              </el-button>
              <el-button type="text" size="mini" @click.stop="() => remove(node, data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </el-aside>
    <el-main>
      <!--展示信息,用来直接修改-->
      <el-form ref="form" :model="form" label-position="top" label-width="80px">
        <el-form-item label="id">
          <el-input size="mini" v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="parent_id">
          <el-input size="mini" v-model="form.parent_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input size="mini" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input size="mini" v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="相对路径">
          <el-input size="mini" v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="saveAndUpdate">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: 'Menu',
    data: function () {
      /* [{
       update_time: '2017-11-20 16:59:45',
       create_time: '2017-11-20 16:59:44',
       parent_id: 0,
       name: '商品管理',
       icon: null,
       sonMenu: [{update_time: '2017-11-20 16:59:45', create_time: '2017-11-20 16:59:44', parent_id: 1, name: '商品管理', icon: '', 'id': 41, 'url': '/product'}, {
         update_time: '2017-11-21 13:38:02',
         create_time: '2017-11-21 13:38:00',
         parent_id: 1,
         name: '幻灯片管理',
         icon: '',
         'id': 42,
         'url': '/manage/banner'
       }, {update_time: '2017-11-21 13:39:08', create_time: '2017-11-21 13:39:06', parent_id: 1, name: '分类管理', icon: null, 'id': 44, 'url': '/manage/type'}, {
         update_time: '2017-11-21 13:38:42',
         create_time: '2017-11-21 13:38:40',
         parent_id: 1,
         name: '标签管理',
         icon: null,
         'id': 46,
         'url': '/manage/typeGroup'
       }],
       'id': 1,
       'url': ''
     }, {
       update_time: '2017-11-28 15:42:49',
       create_time: '2017-11-28 15:42:47',
       parent_id: 0,
       name: '订单管理',
       icon: null,
       sonMenu: [{update_time: '2018-03-14 20:18:24', create_time: '2018-03-14 20:18:22', parent_id: 2, name: '待确认订单', icon: null, 'id': 30, 'url': '/manage/order/other/0'}, {
         update_time: '2018-03-14 20:18:24',
         create_time: '2018-03-14 20:18:22',
         parent_id: 2,
         name: '已确认订单',
         icon: '',
         'id': 31,
         'url': '/manage/order/other/5'
       }, {update_time: '2018-03-14 20:18:24', create_time: '2018-03-14 20:18:22', parent_id: 2, name: '已配货订单', icon: '', 'id': 32, 'url': '/manage/order/other/10'}, {
         update_time: '2018-03-14 20:18:24',
         create_time: '2018-03-14 20:18:22',
         parent_id: 2,
         name: '已配送订单',
         icon: '',
         'id': 33,
         'url': '/manage/order/other/15'
       }, {update_time: '2018-03-14 20:18:24', create_time: '2018-03-14 20:18:22', parent_id: 2, name: '已送达订单', icon: '', 'id': 34, 'url': '/manage/order/other/20'}, {
         update_time: '2018-03-14 20:18:24',
         create_time: '2018-03-14 20:18:22',
         parent_id: 2,
         name: '待付款订单',
         icon: '',
         'id': 35,
         'url': '/manage/order/other/25'
       }, {update_time: '2018-03-14 20:18:24', create_time: '2018-03-14 20:18:22', parent_id: 2, name: '已完成订单', icon: '', 'id': 36, 'url': '/manage/order/other/30'}, {
         update_time: '2018-03-14 20:18:24',
         create_time: '2018-03-14 20:18:22',
         parent_id: 2,
         name: '已删除订单',
         icon: '',
         'id': 38,
         'url': '/manage/order/other/50'
       }, {update_time: '2018-03-14 20:18:24', create_time: '2018-03-14 20:18:22', parent_id: 2, name: '所有订单', icon: '', 'id': 39, 'url': '/manage/order'}],
       'id': 2,
       'url': ''
     }, {update_time: '2018-03-21 12:15:11', create_time: '2018-03-21 12:15:08', parent_id: 0, name: '财务管理', icon: null, sonMenu: null, 'id': 3, 'url': null}, {
       update_time: '2018-03-21 12:00:43',
       create_time: '2018-03-21 12:00:39',
       parent_id: 0,
       name: '采购管理',
       icon: null,
       sonMenu: [{update_time: '2018-03-21 12:01:35', create_time: '2018-03-21 12:01:32', parent_id: 4, name: '采购计划', icon: null, 'id': 47, 'url': '/manage/procurement/plan'}, {
         update_time: '2018-03-21 12:01:35',
         create_time: '2018-03-21 12:01:32',
         parent_id: 4,
         name: '采购配额',
         icon: '',
         'id': 48,
         'url': '/manage/procurement/quota'
       }],
       'id': 4,
       'url': ''
     }, {
       update_time: '2018-03-21 12:16:08',
       create_time: '2018-03-21 12:16:06',
       parent_id: 0,
       name: '仓库管理',
       icon: null,
       sonMenu: [{update_time: '2018-04-02 10:47:35', create_time: '2018-04-02 10:47:31', parent_id: 5, name: '入库单', icon: null, 'id': 49, 'url': '/manage/warehouse/put'}, {
         update_time: '2018-04-02 10:48:06',
         create_time: '2018-04-02 10:48:03',
         parent_id: 5,
         name: '出库单',
         icon: null,
         'id': 50,
         'url': '/manage/warehouse/out'
       }, {update_time: '2018-04-02 10:48:06', create_time: '2018-04-02 10:48:03', parent_id: 5, name: '库存盘点单', icon: '', 'id': 51, 'url': '/manage/warehouse/inventory'}],
       'id': 5,
       'url': null
     }, {update_time: '2018-03-21 12:16:46', create_time: '2018-03-21 12:16:44', parent_id: 0, name: '物流管理', icon: null, sonMenu: null, 'id': 6, 'url': null}, {
       update_time: '2018-03-21 12:17:29',
       create_time: '2018-03-21 12:17:23',
       parent_id: 0,
       name: '运营报表',
       icon: null,
       sonMenu: null,
       'id': 7,
       'url': null
     }, {
       update_time: '2018-03-08 16:13:25',
       create_time: '2018-03-08 16:13:23',
       parent_id: 0,
       name: '商户管理',
       icon: null,
       sonMenu: [{update_time: '2018-03-08 16:13:25', create_time: '2018-03-08 16:13:23', parent_id: 8, name: '商户库', icon: '', 'id': 45, 'url': '/manage/customer'}],
       'id': 8,
       'url': ''
     }, {
       update_time: '2017-11-20 16:53:27',
       create_time: '2017-11-20 16:53:25',
       parent_id: 0,
       name: '系统管理',
       icon: null,
       sonMenu: [{update_time: '2018-03-15 16:53:27', create_time: '2018-03-15 16:53:25', parent_id: 9, name: '用户管理', icon: '', 'id': 40, 'url': '/manage/user'}, {
         update_time: '2017-11-20 16:59:18',
         create_time: '2017-11-20 16:59:16',
         parent_id: 9,
         name: '角色管理',
         icon: null,
         'id': 43,
         'url': '/manage/role'
       }, {update_time: '2018-05-11 17:41:51', create_time: '2018-05-11 17:41:49', parent_id: 9, name: '系统字典', icon: null, 'id': 52, 'url': '/manage/dictionaries'}, {
         update_time: '2018-05-17 15:32:14',
         create_time: '2018-05-17 15:32:12',
         parent_id: 9,
         name: '菜单管理',
         icon: null,
         'id': 53,
         'url': '/manage/memu'
       }],
       'id': 9,
       'url': ''
     }] */
      return {
        // 用来修改的临时表,原来的表用来还原的
        menus: [],
        tempMenus: [],
        defaultProps: {
          children: 'sonMenu',
          label: 'name'
        },
        form: {}
      }
    },
    mounted: function () {
      this.init()
    },
    methods: {
      init: function () {
        this.$http.post('/manage/menu/getAllMenu').then(
          (response) => {
            // JSON.parse(JSON.stringify(this.menus))
            this.menus = response.data
            this.tempMenus = response.data
          },
          (response) => {
          }
        )
      },
      handleNodeClick: function (data, node, thisNode) {
        this.form = data
      },
      saveAndUpdate: function () {
        this.$http.post('/manage/menu/saveAndUpdate', this.form).then(
          (response) => {
            this.successMsg('添加或更新成功')
          }
        )
      },
      remove: function (node, data) {
        this.$confirm('此操作将删除该目录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 所有父节点的子节点(包含删除节点)
          let allSonMenu = node.parent.data.sonMenu || node.parent.data
          if (data.sonMenu && data.sonMenu.length > 0) {
            // 包含子节点,不许删除
            this.warningMsg('包含子节点,不可删除')
            return false
          }
          if (data.id != null) {
            // 删除id指定的菜单 TODO
            this.$http.post('/manage/menu/remove', data).then(
              (response) => {
                this.successMsg('删除成功')
              },
              (response) => {
              }
            )
          }
          // 删除的节点所在的下标
          let index = allSonMenu.findIndex(menu => menu.$treeNodeId === node.data.$treeNodeId)
          // 删除
          allSonMenu.splice(index, 1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      append: function (data) {
        if (data.sonMenu == null) {
          // this.warningMsg('不可以添加三级节点') TODO
          // return false
          if (data.id < 14) {
            this.$set(data, 'sonMenu', [])
          } else {
            this.warningMsg('不可创建的节点')
            return false
          }
        }
        let newMenu = {name: '新增标签', parent_id: data.id, url: '/'}
        this.$http.post('/manage/menu/saveAndUpdate', newMenu).then(
          (response) => {
            newMenu.id = response.data.id
            data.sonMenu.push(newMenu)
            this.handleNodeClick(newMenu)
            // console.log(document.getElementById(newMenu.id))
          }
        )
        // document.getElementById(newMenu.id).children.click()
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
      }
    }
  }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
