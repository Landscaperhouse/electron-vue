<template>
  <div class='playbody'>
      <audio   @timeupdate="updateTime" @loadedmetadata="onLoadedmetadata" ref="audio" :src="url" id='audio' @ended="handnext()"></audio>
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="play_contol">
              <span @click="previous"><i class='iconfont conicon'>&#xe607;</i></span>
              <span class='played' @click="playAudio" v-if="play"><i class="iconfont conicon">&#xe647;</i></span>
              <span class='played' @click="stopAudio" v-else><i class="iconfont conicon">&#xe60c;</i></span>
              <span @click="handnext"><i class="iconfont conicon">&#xe608;</i></span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="slider_control">
              <span>{{ currentTime | formatSecond }}</span>
              <el-slider v-model="slider" :show-tooltip="false" :format-tooltip="formatTooltip" @change='chanslide'></el-slider>
              <span>{{ duration | formatSecond }}</span>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="volume">
            <span  @click='stopvolume'>
              <i class="iconfont conicon">{{muted==true?'&#xe689;':'&#xe60a;'}}</i>
            </span>
            <el-slider v-model="volume" :show-tooltip="false" @change='control_volume'></el-slider>
            <span class="music_lyc" :class="show_lypic==true?'activeblue':''" @click="toogleLyic">
               <i class="iconfont conicon">&#xe603;</i>
            </span>
          </div>
        </el-col>
        <!-- <el-col :span="4">
          <div class="grid-content bg-purple"></div>
        </el-col> -->
      </el-row>
  </div>
</template>

<script>
// 将整数转换成 时：分：秒的格式
function realFormatSecond(second) {
  var secondType = typeof second

  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second)
    var hours = Math.floor(second / 3600)
    second = second - hours * 3600
    var mimute = Math.floor(second / 60)
    second = second - mimute * 60
    return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
  } else {
    return '0:00:00'
  }
}

export default {
  name: "footernav",
  props: {
    musicarryd:{
      type:Array,
      defalut:null
    }
  },
  components: {},
  data() {
    return {
      play:true,
      muted:true,//音量状态
      slider:0,//音乐进度
      volume:0,//音量进度
      url:'D:/Kugou/我要改写人生 - 苏谭谭.mp3',//音乐链接地址
      duration:0, //音乐总时长
      currentTime:0,//当前音乐播放时间
      musicarry:[
        {url:'D:/Kugou/我要改写人生 - 苏谭谭.mp3'}
      ],
      active:0,
      show_lypic:false
    };
  },
  filters: {
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return realFormatSecond(second)
    }
  },
  watch: {
    musicarry (newVal, oldVal) {
      if(this.musicarryd.length>0){
        this.musicarry = this.musicarryd
        this.url = this.musicarry[0].url
      }
    }
  },
  mounted() {
    this.musicarry = this.$store.state.Counter.playlist
    if(this.musicarry){
      this.url = this.musicarry[0].url
    }
  },

  methods: {
    onLoadedmetadata(res) { // 当加载语音流元数据完成后，会触发该事件的回调函数
      this.duration = parseInt(res.target.duration)
    },
    updateTime(e) { // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
       this.currentTime = e.target.currentTime;  //获取audio当前播放时间
       this.slider = parseInt(this.currentTime / this.duration * 100)
    },
    playAudio(){ //开始播放
      let audio = this.audio = document.getElementById('audio')
      this.play = false
      if(this.url){
        audio.play()
        if((this.duration>0)&&(this.duration==this.currentTime)){
          this.play = false
        }
      }
    },
    stopAudio(){//暂停播放
      this.play = true
      let audio = document.getElementById('audio')
      audio.pause()
    },
    chanslide(value){ //改变 
      this.currentTime = parseInt(value / 100 * this.duration)
      this.$refs.audio.currentTime = this.currentTime
      this.playAudio()
    },
    formatTooltip(val) {  //格式化
        val = parseInt(this.duration / 100 * val)
        return '进度条: ' + realFormatSecond(val)
      },
    previous(){ //上一曲
      if(this.musicarry.length>1){
        if(this.active>0){
           this.songprev('reduce',this.active-1)
           this.active = this.active-1
        }else{
          this.songprev('last',this.musicarry.length-1)
          this.active  = this.musicarry.length-1
        }
      }
    },
    handnext(){ //下一曲
      if(this.musicarry.length>1){
        if(this.active<this.musicarry.length){
          this.active = this.active+1
          if(this.musicarry[this.active]!=undefined){
            this.songprev('next',this.active)
          }else{
            this.songprev('first',0)
            this.active = 0
          }
        }else{
          this.songprev('first',0)
          this.active = 0
        }
      }
    },
    songprev(type,index){ //调用上下曲播放
      this.url = this.musicarry[index].url
      this.$emit("getactive",index)
      setTimeout(() => {
          this.playAudio()
      }, 200);
    },
    stopvolume(){
      this.$refs.audio.muted = !this.$refs.audio.muted
      this.muted = !this.muted
    },
    control_volume(value){  //音量改变控制
      this.$refs.audio.volume = value / 100
      this.volume = value
      /* if(value>0){  //当音量变化，静音取消
        this.$refs.audio.muted = false
        this.muted = true
      } */
    },
    toogleLyic(){ //歌词展示
      this.show_lypic = !this.show_lypic
    }
  },
};
</script>
<style>
.el-slider__runway{
  height: 5px;    
}
.el-slider__bar{
  height: 5px;
}
.el-slider__button{
  width: 10px;
  height: 10px;
}
</style>
<style lang="scss" scoped>
.playbody{
  width: 100%;
  height: 60px;
  .el-row{
    width: 100%;
    height: 60px;
    margin: 0 !important;
    background: white;
    .el-col{
      height: 60px;
      .play_contol{
        font-size:20px;
        span{
          width: 30px;
          height: 30px;
          color: white;
          background: red;
          border-radius: 50%;
          float: left;
          margin-right: 10px;
          cursor: pointer;
          margin-top: 15px;
          position: relative;
          .conicon{
            text-align: center;
            line-height: 30px;
            left: 7px;
            position: absolute;
          }
        }
        .played{
          width: 32px;
          height: 32px;
          margin-top: 14px;
          .conicon{
            left: 9px;
            line-height: 32px;
          }
        }
      }
      .slider_control{
        width: 100%;
        height: 60px;
        span{
          float: left;
        }
        .el-slider{
          float: left;
          width: 70%;
          padding: 0 15px;
          margin-top: 12px;
        }
      }
      >>>.el-slider__button:hover{
        transform: scale(1);
      }
      .volume{
        width: 100%;
        height: 60px;
        span{
          float: left;
          width: 18px;
          cursor: pointer;
        }
        .el-slider{
          width: 60%;
          float: left;
          margin-top: 10px;
          margin-left: 10px;
        }
        .music_lyc{
          margin-left: 10px;
          .conicon{
            font-size: 24px;
          }
        }
        .activeblue{
          color: red;
        }
      }
    }
  }
}
</style>
