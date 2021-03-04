<template>
  <div class='head_main'>
      <el-row>
        <el-col :span="12">
          <div class="head_log">
            <img src="../../assets/image/logo.png" alt=""> <span class='title'>随心音乐</span>
          </div>
          <el-input placeholder="请输入内容" v-model="song_name" class="input-with-select" size="small" clearable>
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="网易" value="netease"></el-option>
              <el-option label="酷狗" value="kugou"></el-option>
              <el-option label="酷我" value="kuwo"></el-option>
              <el-option label="QQ音乐" value="qq"></el-option>
              <el-option label="喜马拉雅" value="ximalaya"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click=search></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <screen></screen>
        </el-col>
      </el-row>
  </div>
</template>

<script>
import screen from './compons/screen'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: "headnav",
  components: {
      screen
  },
  props: {

  },
  data() {
    return {
      song_name:'',
      select:'netease'
    };
  },

  mounted() {},

  methods: {
    search(){
      let list = {
          input: this.song_name,
          filter: 'name',
          type: this.select,
          page: 1,
          size:15
      }
      if(this.select!=this.$store.state.Counter.pragram.type){
        this.$store.state.Counter.playlist = []
      }
      this.$store.commit('update',list)
      this.$http.post('http://vip.nicoun.com/music/api',list).then(res => {
          if(res.data.code=='200'){
            this.$store.commit('updatelist',res.data.data)
            this.$emit('selected',res.data.data)
          }else{
            this.$message('没有请求到数据了呢！');
          }
      }).catch((res)=>{
        this.$message({
          message:'请求不到数据，请稍后再试呢！',
          type:'warning'
        })
        this.$emit('selected','')
      })
    }
  }
};
</script>
<style >
  .el-input-group__prepend{
      width: 60px !important;
  }

</style>
<style lang="scss" scoped>
.head_main{
    height:50px;
    .el-row{
      height:50px;
      .el-col-12{
        height: 50px;
        .head_log{
          height: 50px;
          padding-left: 20px;
          text-align: left;
          line-height: 50px;
          color: white;
          float: left;
          .title{
            margin-left: 5px;
          }
          img{
            float: left;
            width: 30px;
            margin-top: 8px;
          }
        }
        .el-input-group{
          float: left;
          width: 60%;
          height: 30px;
          padding: 0;
          margin: 10px 0 0 20px;
          -webkit-app-region: no-drag;
        }
      }
      
    }
    
}
</style>
