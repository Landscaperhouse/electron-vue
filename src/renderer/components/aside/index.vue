<template>
  <div class="aside_wrap">
    <p class="aside">我的音乐</p>
    <ul class="music_menu">
      <li :class="{active:seleted==1}">
        <span @click="opennow">
          <i class="el-icon-search"></i>当前搜索音乐
        </span>
      </li>
      <li :class="{active:seleted==2}">
        <span @click="opencollect">
          <i class="iconfont">&#xe60f;</i>我的收藏音乐
        </span>
      </li>
      <li :class="{active:seleted==3}">
        <span @click="openfile">
          <i class="iconfont">&#xe641;</i>导入本地音乐
        </span>
      </li>
      <li :class="{active:seleted==4}">
        <span @click="changeFile">
          <i class="el-icon-folder-opened"></i>
          <span class="catalogue">{{catalogue}}</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
const { BrowserWindow } = require('electron').remote
const { dialog } = require('electron').remote
const Store = require("electron-store");
const store = new Store();
const path = require('path')
const fs = require('fs');
var mainWindow = BrowserWindow.getFocusedWindow()
export default {
    name:'asidenav',
    props:[''],
    data () {
      return {
        seleted:1,
        catalogue:"请选择保存目录"
      };
    },
    watch: {},
    components: {},

    computed: {},

    beforeMount() {},

    mounted() {
      //store.delete("savepath")
      let pathsave = store.get("savepath");
      if(pathsave!=undefined){
        this.catalogue = pathsave
      }
    },
    methods: {
      opennow(){ //返回搜索音乐
        this.seleted = 1
        this.$emit('opneCollect',2)
      },
      opencollect(){  //收藏音乐
        this.seleted = 2
        this.$emit('opneCollect',1)
      },
      openfile(){ //打开文件目录
         this.seleted = 3
         dialog.showOpenDialog({
            title: '选择音乐文件', // 对话框的标题
            properties: ['openFile','multiSelections'],
            filters: [{name: 'Music',extensions: ['mp3']}],
            buttonLabel: '确定' // 自定义按钮文本显示内容
          }).then((res) => {
            // 选择文件之后的处理
            console.log('文件',res)
            if (!res.canceled) { // 如果不是点击的 取消按钮
             console.log(999,res)
             this.$emit('leadingin',res.filePaths)
            }
          })
      },
      changeFile(){ //更改目录
        this.seleted = 4
         dialog.showOpenDialog(mainWindow, {
         properties: ["openDirectory"],
       }) .then((res) => {
         store.set("savepath", res.filePaths[0]);
         this.catalogue = res.filePaths[0]
       }).catch((err) => {
          console.log(err);
       });
      }
    },
  }

</script>
<style lang='scss' scoped>
.aside_wrap{
    .aside{
        text-align: left;
        text-indent: 15px;
    }
    .music_menu{
      padding: 0;
      li{
        list-style: none;
        text-align: left;
        font-size: 13px;
        cursor: pointer;
        padding: 10px 15px;
        span{
          i{
            font-size:16px;
            margin-right: 5px;
          }
          .catalogue{
              width: 130px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: inline-block;
              line-height: 13px;
              margin-left: -3px;
          }
        }
      }
      .active{
        background: #E6E7EA;
      }
    }
}
</style>