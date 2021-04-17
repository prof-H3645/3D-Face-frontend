<template>
  <el-container>
    <el-header style="height: 100px;">
      <MyHeader :step="step"></MyHeader>
    </el-header>
    <div>
      <el-button type="primary"
                 @click="next">try</el-button>
    </div>

  </el-container>
</template>

<script>
// @ is an alias to /src
import MyHeader from '@/components/MyHeader.vue'

export default {
  name: 'Home',
  components: {
    MyHeader,
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
