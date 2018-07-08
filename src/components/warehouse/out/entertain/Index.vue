<template>
  <div class="procurement-detail">
    <table-search></table-search>
    <table-list></table-list>
  </div>
</template>

<script>
  import tableList from './List'
  import tableSearch from './Search'

  export default {
    name: 'procurement-detail',
    components: {
      tableList,
      tableSearch
    },
    data: function () {
      return {
        showStandard: false
      }
    }
  }
</script>

<style scoped>
</style>
