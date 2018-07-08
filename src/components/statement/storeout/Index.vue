<template>
  <div class="storeout">
    <table-search></table-search>
    <table-list></table-list>
  </div>
</template>

<script>
import tableList from './List'
import tableSearch from './Search'

export default {
  name: 'storeout',
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
  .procurement {
    position: relative;
    overflow: hidden;
  }
  .standard-enter-active, .standard-leave-active {
    transition: all 0.3s ease;
    left: 30% !important;
  }

  .standard-enter, .standard-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    left: 100% !important;
  }
</style>
