<template>
  <el-container>
    <el-header height="80px">
      <MyHeader :step="step"></MyHeader>
    </el-header>
    <el-container style="background-color:#fcfcfc;">
      <el-aside width="15%"
                style="margin:10px;">
        <ToolsBar @next="next"
                  :step="step"></ToolsBar>
      </el-aside>
      <el-main style="padding:10px;">
        <div style="width: 100%;height: 200px;background-color: #121212;"></div>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
// @ is an alias to /src
import MyHeader from '@/components/MyHeader.vue'
import ToolsBar from '@/components/ToolsBar.vue'

export default {
  name: 'Home',
  components: {
    MyHeader,
    ToolsBar,
  },
  data() {
    return {
      step: 0,
    }
  },
  methods: {
    next() {
      this.step++
    },
  },
}
</script>
<style>
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
