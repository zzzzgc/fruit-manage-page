<template>
  <div class="content">
    <div class="header">
      <el-button @click="loginOut" type="text">注销</el-button>
    </div>
    <div class="center">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sys-content',
  methods: {
    loginOut: function (data) { // 点击搜索时执行
      this.$http.post('/login/logout', Object.assign({})).then((response) => {
        this.$router.push({path: '/login'})
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .content {
    position: relative;
    height: 100%;
    box-sizing:border-box;
    width: 100%;
    overflow: auto;
    padding-top: 50px;
    .header {
      position: absolute;
      top: 0;
      z-index: 5;
      width: 100%;
      box-sizing: border-box;
      height: 50px;
      line-height: 50px;
      text-align: right;
      font-size: 12px;
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3);
      padding: 0 20px;
    }
    .center {
      height: 100%;
      min-height: 50px;
      overflow: auto;
    }
  }
</style>
