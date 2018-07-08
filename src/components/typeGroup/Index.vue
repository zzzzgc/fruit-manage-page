<template>
  <div>
    <table-search></table-search>
    <table-list></table-list>
    <!--<add></add>-->
  </div>
</template>

<script>
import tableSearch from './Search'
import tableList from './List'

export default {
  name: 'typeGroup',
  components: {
    tableSearch,
    tableList
  }
}
</script>

<style scoped>

</style>
