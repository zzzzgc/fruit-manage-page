<template>
  <div>
    <h2>欢迎来到嘻果ERP后台管理</h2>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    methods: {
      getUserInfo: function () {
        this.$http.post('')
      }
    }
  }
</script>

<style scoped>

</style>
