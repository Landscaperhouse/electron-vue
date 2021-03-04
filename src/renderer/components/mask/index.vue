<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2021-02-28 20:27:01
 * @LastEditors: Andy
 * @LastEditTime: 2021-02-28 21:41:16
-->
<template>
  <div class="mask" id="drag" ondragstart="myScript">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div>
    </el-card>
  </div>
</template>

<script>
  const { ipcRenderer } = require('electron')
  // document.getElementById('drag').ondragstart = (event) => {
  //   event.preventDefault()
  //   ipcRenderer.send('dragstart')
  //   // ipcRenderer.on('downsuccess',(event,items)=>{

  //   //     })
  // }
  export default {
    name:'',
    props:[''],
    data () {
      return {

      };
    },

    components: {},

    computed: {},

    beforeMount() {},

    mounted() {},

    methods: {},

    watch: {}

  }

</script>
<style lang='scss' scoped>
.mask{
   position: absolute;
   background: black;
   opacity: 0.8;
   z-index: 9999;
   left: 33%;
   top: 30%;
   border-radius: 5px;
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }  
}
</style>
