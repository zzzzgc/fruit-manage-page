<template>
  <el-dialog :title="title" :visible="showDialog3" @update:visible="(val) => $emit('update:showDialog3', val)"
             :close-on-click-modal=false >
      <img :src="imgUrl" width = "100%" height="100%"/>
    <!--<el-carousel :interval="5000" arrow="always" :modal-append-to-body="true">-->
      <!--<el-carousel-item v-for="item in customerImgs" :key="item">-->
        <!--<a :href="item.url" target="_blank">-->
        <!--<img :src="item.url" width="100%" height="100%" />-->
        <!--</a>-->
      <!--</el-carousel-item>-->
    <!--</el-carousel>-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:showDialog3', false)">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    components: {},
    name: 'orderPayBigImage',
    props: ['showDialog3', 'imgUrl', 'title']
  }
</script>

<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
