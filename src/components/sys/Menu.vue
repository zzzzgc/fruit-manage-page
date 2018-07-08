<template>
  <div class="left">
    <div class="top">
      <div class="icon">
        <img src="../../assets/user-head.png">
      </div>
    </div>
    <div class="center">
      <el-menu default-active="2" class="el-menu-1" :router=true text-color="#fff" active-text-color="#2d8cf0">
        <!--<el-submenu index="1" class="el-menu-2">-->
        <!--<template slot="title">-->
        <!--<i class="el-icon-message"></i>-->
        <!--<span>导航一</span>-->
        <!--</template>-->
        <!--<el-menu-item index="/hello" class="el-menu-2">选项1</el-menu-item>-->
        <!--<el-menu-item index="1-2" class="el-menu-2">选项2</el-menu-item>-->
        <!--<el-menu-item index="1-3" class="el-menu-2">选项3</el-menu-item>-->
        <!--<el-menu-item index="1-4-1" class="el-menu-2">选项1</el-menu-item>-->
        <!--</el-submenu>-->

        <!--<el-menu-item v-for="item in menuByUidStore.menuList" :index="item.url" :label="item.id" :key="item.id">-->
        <!--<i class="el-icon-menu"></i>-->
        <!--<span slot="title">{{item.name}}</span>-->
        <!--</el-menu-item>-->

        <!--route为空,默认取index做为route的值,但是如果url相同,会出现重复选中的现象,所以改为使用route作为路由的值-->
        <el-submenu v-for="(item, index) in menuByUidStore.menuList" :index="item.id + ''" :key="item.id">
          <template slot="title" :index="item.url">
            <i class="el-icon-menu"></i>
            <span slot="title">{{item.name}}</span>
          </template>
          <el-menu-item v-for="(sonItem, index) in item.sonMenu"  :route="sonItem.url" :index="sonItem.id + ''" :key="sonItem.id">
            <i class="el-icon-menu"></i>
            <span slot="title">{{sonItem.name}}</span>
          </el-menu-item>
        </el-submenu>
        <!--<el-submenu index="3">-->
        <!--<template slot="title">导航三</template>-->
        <!--<el-menu-item index="3-1" class="el-menu-2">选项1234</el-menu-item>-->
        <!--</el-submenu>-->
      </el-menu>
    </div>
    <!--<div class="bottom">bottom</div>-->
  </div>
</template>

<script>
  import {MENU_LIST} from '../../store/action-types'
  import {mapState, mapActions} from 'vuex'

  export default {
    name: 'sys-meun',
    mounted: function () {
      this.getMenusByUid()
    },
    computed: mapState({
      'menuByUidStore': 'menuByUid'
    }),
    methods: {
      ...mapActions({
        getMenusByUid: MENU_LIST
      })
    }
  }
</script>

<style scoped lang="scss">
  .left {
    position: absolute;
    left: 0;
    height: 100%;
    box-sizing: border-box;
    padding-top: 90px;
    width: 200px;
    background: #495060;
    .top {
      position: absolute;
      top: 0;
      width: 100%;
      /*z-index: 1;*/
      /*background: #545c64;*/
      padding: 10px 0;
      /*border-bottom: 1px solid #6f6f6f;*/
      .icon {
        margin: 0 auto;
        width: 69px;
        height: 69px;
        border-radius: 50px;
        background: white;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
    }
    .center {
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      overflow: auto;
      overflow-x: hidden;
    }
    .bottom {
      position: absolute;
      width: 100%;
      bottom: 0;
      border-top: 1px solid #7e7b7b;
    }
  }
</style>
<style>
  .el-menu {
    /*border-right: 0;*/
    height: 100%;
    background-color: initial;
    border-right: 0;
  }

  /*.el-menu.el-menu-1>li {*/
  /*border-bottom: 1px solid #f0f0f0;*/
  /*}*/
  .el-menu > li.el-menu-2 {
    border-top: 1px solid #f0f0f0;
  }

  .el-menu-item:focus, .el-menu-item:hover {
    background: #363e4f;
  }
</style>
