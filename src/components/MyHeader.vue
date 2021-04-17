<template>
  <div id="my-header">
    <span class="info blue">①手绘人脸</span>
    <i :class="step>=1?'info blue':'info'"
       class="el-icon-arrow-right"></i>
    <span :class="step>=1?'info blue':'info'">②精细处理</span>
    <i :class="step>=2?'info blue':'info'"
       class="info el-icon-arrow-right"></i>
    <span :class="step>=2?'info blue':'info'">③三维模型</span>
  </div>
</template>
<script>
export default {
  name: 'MyHeader',
  data() {
    return {}
  },
  props: {
    step: Number,
  },
  methods: {},
}
</script>
<style scoped>
#my-header {
  width: 100%;
  height: 100px;
  line-height: 100px;
}
.info {
  font-size: 20px;
  margin-right: 100px;
}
.blue {
  color: #5cb6ff;
}
</style>