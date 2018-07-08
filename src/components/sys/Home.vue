<template>
  <div class="home">
    <sys-menu></sys-menu>
    <sys-content></sys-content>
  </div>
</template>

<script>
import sysMenu from './Menu'
import sysContent from './Content'
export default {
  name: 'sys-home',
  components: {
    sysMenu,
    sysContent
  }
}
</script>

<style scoped>
  .home {
    height: 100%;
    width: 100%;
  }
</style>
