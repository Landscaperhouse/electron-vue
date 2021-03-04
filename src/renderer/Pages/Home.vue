<template>
  <div>
    <el-container class='main'>
      <el-header>
        <head-nav @selected='searched'></head-nav>
      </el-header>
      <el-container>
        <el-aside width="200px" class='scroll'>
          <aside-silder @leadingin='getlocalmusic' @opneCollect='handlecollect'></aside-silder>
        </el-aside>
        <el-container>
          <el-main class='scroll'>
            <ul  v-loading="loading">
              <template v-for="(item,index) in musicarry">
                 <li :class="{selected:active==index}"  :key="index" @click="playUrl(item,index)" v-if="item.url">
                    <div class="li_left pubspan">
                        <span>{{index+1}}</span>
                        <span  @click="selectcollect(item,index)" @click.stop>
                          <i :class="item.collect?'el-icon-star-on':'el-icon-star-off'"></i>
                          </span>
                        <span  @click="downMusic(item)" @click.stop><i class="el-icon-bottom"></i></span>
                        <span>{{item.title}}</span>
                    </div>
                    <div class="li_right pubspan">
                      <span v-if="item.author">{{item.author}}</span>
                      <span v-if="item.pic">
                        <img :src="item.pic" alt="">
                      </span>
                    </div>
                  </li>
              </template>
              <img class='empty' v-if="musicarry.length==0" src="../assets/image/emptory.jpg" alt="">
            </ul>
            <el-button class="loadingmore" v-if="(musicarry.length>0)&&getmore" type="text"  @click="uploading">加载更多</el-button>
          </el-main>
          <el-footer>
            <fdooter :musicarryd='musicarry' ref="footed" @getactive="getactive"></fdooter>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
    <mask-view v-drag></mask-view>
  </div>
</template>

<script>
var { ipcRenderer, remote, shell } = require("electron");
var remote = require("electron").remote;
var dialog = remote.dialog;
const path = require('path')
const fs = require('fs');
const Store = require("electron-store");
const store = new Store();
import { mapGetters, mapActions } from 'vuex'
import HeadNav from '@/components/head'
import fdooter from '@/components/footer'
import asideSilder from '@/components/aside'
import maskView from '@/components/mask'
import { getsong } from '@/api/index'
export default {
  name: '',
  components: {
    HeadNav,
    fdooter,
    asideSilder,
    maskView
  },
  data () {
    return {
      dynamicValidateForm: {
        email: '',
        name: '',
        intresting: '',
        jobs: ''
      },
      active:-1,//选中状态
      tablelist: [],
      musicarry:[],
      currentUrl:'',
      loading:false,//加载状态
      collect:[],//收藏集合
      getmore:true,//加载状态
      orginmusic:[],//原搜索数据
    }
  },
  mounted () {
    this.$refs.footed.url = '' //初始化url数据为空
  },
  methods: {
    searched(music){ //搜索返回
      this.musicarry = []
      this.active = 0
      if(music!==''){
         music.map((item)=>{
          item.play = false
          item.collect = false
          item.down = true
        })
        this.getmore = true
        this.musicarry = music
        this.orginmusic = music
        this.$refs.footed.musicarry = music
      }
    },
    getactive(val){
      this.active = val
    },
    getlocalmusic(list){//获取本地音乐
      this.musicarry = []
      this.active = 0
      list.map((item,index)=>{
        console.log('item',item)
          let label = {
            url:'',
            title:'李四',
            author:'夏天',
            pic:'',
            play:false
          }
          const uint8Buffer = Uint8Array.from(item);
          const bolb = new Blob([uint8Buffer]);
          console.log('blod',bolb)
          label.url = bolb
          this.musicarry.push(label)
          // item.url = item
          // item.title= '李四'
          // item.author = '夏天'
          // item.pic=''
          // item.play=false
      })
      console.log('list',this.musicarry)
      // this.musicarry = list
      this.$refs.footed.musicarry = this.musicarry
    },
    handlecollect(val){//打开收藏音乐
      if(val==1){
        this.getmore = false
        this.musicarry = this.collect
        this.$refs.footed.musicarry = this.collect
      }else if(val==2){
        this.getmore = true
        this.musicarry = this.orginmusic
        this.$refs.footed.musicarry = this.orginmusic
      }
      console.log('收藏',this.collect)
    },
    selectcollect(item,index){ //收藏
      console.log(888,item,index)
      this.musicarry[index].collect = !this.musicarry[index].collect
      console.log('music',this.musicarry[index])
      if(item.collect){
        console.log(111)
        if(this.collect.lemgth>0){
          console.log(222)
          this.collect.map((items,indexs)=>{
            if(item.title==items.title){
              this.notice('提示','当前音乐已经收藏过了!','warning')
            }else{
              this.collect.push(item)
            }
          })
        }else{
          console.log(333)
          this.collect.push(item)
        }
      }else{
        console.log(444)
        this.collect.map((items,indexs)=>{
          if(item.title==items.title){
            this.collect.splice(indexs,1);
          } 
        })
      }
    },
    playUrl(item,index){ //点击列表播放
      this.active = index
      this.currentUrl = item.url 
      this.$refs.footed.url = item.url 
      this.$refs.footed.active = index
      if(item.play == false){
        this.$refs.footed.play = true
        setTimeout(() => {
           this.$refs.footed.playAudio()
        }, 200);
        this.musicarry[index].play = true
      }else{
        this.$refs.footed.play = false
        this.$refs.footed.stopAudio()
        this.musicarry[index].play = false
      }
      this.$store.commit('playstatus',item)
    },
    uploading(){  //加载更多数据
      this.loading = true
      let list = {
         input: this.$store.state.Counter.pragram.input,
         filter: this.$store.state.Counter.pragram.filter,
         type: this.$store.state.Counter.pragram.type,
         page: this.$store.state.Counter.pragram.page+1,
         size:15
      }
      if(this.$store.state.Counter.pragram.page>0){
        this.$store.commit('update',list)
        this.$http.post('http://vip.nicoun.com/music/api',list).then(res => {
            if(res.data.code=='200'){
              //this.$store.commit('updatelist',res.data.data)
              let list = res.data.data
              list.map((item)=>{
                item.play = false
                item.collect = false
                item.down = true
              })
              this.musicarry = this.musicarry.concat(list)
              this.orginmusic = this.musicarry
              this.$refs.footed.musicarry = this.musicarry
              this.$store.state.Counter.playlist = this.$store.state.Counter.playlist.concat(res.data.data)
              setTimeout(() => {
                this.loading = false
              }, 300);
            }else{
              this.loading = false
              this.$message('没有更多的数据了呢！');
            }
        }).catch(()=>{
           setTimeout(() => {
                this.loading = false
            }, 300);
        })
      }
    },
    downMusic(item){ //下载音乐
      ipcRenderer.send('download',item);
      setTimeout(()=>{
        ipcRenderer.on('downsuccess',(event,items)=>{
          // this.$notify({
          //   title: "成功",
          //   message: `${items.title}下载完毕`,
          //   type: "success",
          // });
          this.notice('成功',`${items.title}下载完毕`,'success')
        })
      },1000)
      
    },
    notice(title,message,type){ //消息提示
      this.$notify({
          title: title,
          message:message,
          type: type
      });
    }
  },

  watch: {}
}
</script>
<style lang="scss" scoped>
.main{
  .el-header{
    position: fixed;
    top: 0;
    padding: 0;
    width: 100%;
    -webkit-app-region:drag;
  }
  .el-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 0;
  }
  .el-aside {
    background-color: white;
    color: #333;
    text-align: center;
    height: 100%;
    position: fixed;
    left: 0;
    top: 60px;
    overflow-y: auto;
    border-right: 1px solid #D3DCE6;
  }
  .el-main {
    background-color: white;
    color: #333;
    text-align: center;
    height: calc(100vh - 120px);
    overflow-y: auto;
    overflow-x: hidden;
    margin-left: 200px;
    margin-top: 50px;
    padding: 0;
    padding-bottom: 20px;
    ul{
      padding: 0;
      .empty{
        width: 450px;
        height: 450px;
      }
        li{
          height:30px;
          padding: 5px 0;
          cursor: pointer;
          line-height: 30px;
          list-style: none;
          display: flex;
          border-bottom: 1px solid #cccc;
          justify-content: space-between;
          .li_left{
            span:nth-child(4){
              width:400px;
              overflow: hidden;
              text-align: left;
	            text-overflow: ellipsis;
	            white-space: nowrap;
            }
            .el-icon-star-on{
              color: orange;
            }
          }
          .li_right{
            padding-right: 20px;
          }
          .pubspan{
            display: flex;
            justify-content: start;
            span{
              margin-left: 15px;
              img{
                width: 30px;
                height: 30px;
              }
            }
          }
        }
        .selected{
          background: #E3E3E5;
        }
      }
    .loadingmore{
        cursor: pointer;
    }
    
  }
  .scroll::-webkit-scrollbar {
        width: 6px;
        background-color: #F5F5F5;
    }
    .scroll::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #666666;
    }
    .scroll::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
        background-color: #F5F5F5;
    }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
}
</style>
