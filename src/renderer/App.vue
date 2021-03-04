<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'myelecron',
  mounted () {
    window.onoffline = () => {
      this.handleNetworkChange(
        {
          name: '随心音乐',
          title: '随心音乐',
          message: '请检查您的网络连接'
        },
        false
      )
    }
    window.ononline = () => {
      this.handleNetworkChange({
        name: '随心音乐',
        title: '随心音乐',
        message: '网络连接成功'
      })
    }
  }
}
</script>

<style scope lang="scss">
/* ::-webkit-scrollbar {
    width: 6px;
    background-color: #F5F5F5;
}
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #666666;
}
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
} */

body{
  margin: 0;
  overflow-y: hidden;
  #app{
    .header{
      height: 50px;
      line-height: 50px;
      text-align: center;
      margin-top: 50px;
      a{
        color: rgb(241, 139, 139);
        list-style: none;
        text-decoration: none;
      }
    }
  }
}

</style>
