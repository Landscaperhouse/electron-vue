<template>
  <div id='header'>
      <div class="head_left">
        <img src="../../../assets/image/user.jpg" alt="">
        <el-dropdown trigger="click" size="small" >
          <span class="el-dropdown-link">
            子叶流风<i class="el-icon-arrow-down el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown" style="width:150px">
            <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus-outline">螺蛳粉</el-dropdown-item>
            <el-dropdown-item icon="el-icon-check">双皮奶</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-check">蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="nav">
          <button @click='min()'><i class='el-icon-minus'></i></button>
          <button @click='max()'> <i class='el-icon-full-screen'></i></button>
          <button @click='close()'><i class='el-icon-close'></i></button>
      </div>
  </div>
</template>

<script>
var { ipcRenderer, remote, shell } = require("electron");
export default {
  name: 'screen',
  props: [''],
  data () {
    return {}
  },

  components: {},

  computed: {},

  beforeMount () {},

  mounted () {

  },

  methods: {
    min () {
      ipcRenderer.send('window-min')
    },
    max () {
      ipcRenderer.send('window-max')
    },
    close () {
      ipcRenderer.send('window-close')
    }
  },

  watch: {}
}
</script>
<style lang="scss" scoped>
    #header{
        height: 50px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        .head_left{
          height: 30px;
          margin-top: 10px;
          margin-left: 10%;
          img{
              width: 30px;
              height: 30px;
              margin-right: 5px;
              border-radius: 50%;
              cursor: pointer;
            }
          .el-dropdown{
            height: 30px;
            -webkit-app-region: no-drag;
            .el-dropdown-link{
              -webkit-app-region: no-drag;
              line-height: 30px;
              float: left;
              cursor: pointer;
            }
          }
        }
        .nav{
            position: absolute;
            right: 0;
            button{
                background: none;
                outline: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 5px 10px;
                -webkit-app-region: no-drag;
            }
           /*  button:hover{
                background: #F0F0F0;
            } */
        }
        
    }
</style>
