<template>
  <el-container style="height: 100%">
    <el-aside width="200px" style="background-color: aquamarine">Aside</el-aside>
    <el-main style="background-color: greenyellow">Main</el-main>
  </el-container>

</template>

<script>
  export default {
    name: 'Dictionaries',
    data: function () {
      return {
        node_table: [
          {
            id: 0,
            param_name: '嘻果商城设置',
            param: 'web',
            key: 'web',
            describe: '移动端信息',
            update_time: '2018-05-11 12:00:00',
            node: [
              {
                id: 0,
                param_name: '微信mid',
                param: 'wx6546549685',
                key: 'weChar_mid',
                describe: '微信的商户味一标识',
                update_time: '2018-05-11 12:00:00',
                node: []
              },
              {
                id: 0,
                param_name: '微信mid',
                param: 'wx6546549685',
                key: 'weChar_mid',
                describe: '微信的商户味一标识',
                update_time: '2018-05-11 12:00:00',
                node: []
              }
            ]
          },
          {
            id: 0,
            param_name: '指猴ERP管理系统',
            param: 'web',
            key: 'web',
            describe: '移动端信息',
            update_time: '2018-05-11 12:00:00',
            node: [
              {
                id: 0,
                param_name: '微信mid',
                param: 'wx6546549685',
                key: 'weChar_mid',
                describe: '微信的商户味一标识',
                update_time: '2018-05-11 12:00:00',
                node: []
              },
              {
                id: 0,
                param_name: '微信mid',
                param: 'wx6546549685',
                key: 'weChar_mid',
                describe: '微信的商户味一标识',
                update_time: '2018-05-11 12:00:00',
                node: []
              }
            ]
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
