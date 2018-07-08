<template>
  <div>
    <table-search></table-search>
    <table-list></table-list>
  </div>
</template>

<script>
import tableSearch from './Search'
import tableList from './List'
// import addOrEdit from './AddOrEdit'

export default {
  name: 'banner',
  components: {
    tableSearch,
    tableList
  }
}
</script>

<style scoped>

</style>
