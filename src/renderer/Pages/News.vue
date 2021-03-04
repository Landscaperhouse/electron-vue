<template>
  <div>
      {{title}}
      <br/>
      <el-button type="primary" @click="open">点击打开 Message Box</el-button>
  </div>
</template>

<script>
export default {
  name: '',
  props: [''],
  data () {
    return {
      title: '我是新闻组件'
    }
  },

  components: {},

  computed: {},

  beforeMount () {},

  mounted () {

  },

  methods: {
    open () {
      this.$alert('这是一段内容', '标题名称', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          })
        }
      })
    }
  },

  watch: {}
}
</script>
<style lang="scss" scoped></style>
