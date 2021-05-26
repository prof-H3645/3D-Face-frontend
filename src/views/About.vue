<template>
  <el-button>test</el-button>
</template>
<script>
// import objUrl from 'obj-mtl-loader!@/assets/result.obj'
// import mtlUrl from 'obj-mtl-loader!@/assets/result.mtl'
export default {
  components: {},
  data() {
    return {
      width: 300,
      height: 300,
      loading: true,
    }
  },
  methods: {
    onLoad() {
      this.loading = false
    },
  },
}
</script>