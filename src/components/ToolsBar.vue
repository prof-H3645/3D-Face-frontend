<template>
  <div id="toolsbar">
    <div v-if="step==0"
         class="button">
      <el-button class="operation">上传</el-button>
    </div>
    <div v-if="step<=1"
         class="button">
      <el-radio-group v-model="mode">
        <el-radio-button label="画笔"></el-radio-button>
        <el-radio-button label="橡皮"></el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="step<=1"
         class="info blue">画笔粗细</div>
    <el-input-number v-if="step<=1"
                     v-model="size"
                     @change="changeSize"
                     :min="1"
                     :max="10"
                     label="画笔粗细"
                     size="small"></el-input-number>
    <div v-if="step==0"
         class="button">
      <div class="info blue">性别</div>
      <el-radio-group v-if="step==0"
                      v-model="gender">
        <el-radio-button label="男性"></el-radio-button>
        <el-radio-button label="女性"></el-radio-button>
      </el-radio-group>

    </div>
    <div v-if="step==1"
         class="button">
      <div class="info blue">颜色选择</div>
      <el-color-picker v-model="color"></el-color-picker>
    </div>
    <div v-if="step<=1"
         class="button">
      <el-button class="action">撤销</el-button>
    </div>
    <div v-if="step<=1"
         class="button">
      <el-button class="action">清空</el-button>
    </div>
    <div v-if="step<=1"
         class="button">
      <el-button class="operation">生成</el-button>
    </div>
    <div class="button">
      <el-button class="operation">保存</el-button>
    </div>
    <div v-if="step<=1"
         class="button"
         @click="next">
      <el-button class="operation">下一步</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Toolsbar',
  data() {
    return {
      mode: '画笔',
      gender: '男性',
      size: 1,
      color: '#5cb6ff',
    }
  },
  props: {
    step: Number,
  },
  methods: {
    next() {
      this.$emit('next', this.step)
    },
  },
}
</script>
<style scoped>
#toolsbar {
  display: inline-block;
  width: 98%;
  height: 600px;
  background-color: #fff;
  border: 2px solid #ededed;
  box-shadow: -2px 2px 1px 1px #ededed;
}
.button {
  margin: 25px auto;
}
.operation {
  width: 40%;
  height: 30px;
  color: #fff;
  background-color: #a1c4fd;
}
.action {
  width: 40%;
  height: 30px;
  background-color: #fff;
  color: #5cb6ff;
}
.info {
  font-size: 14px;
  margin-bottom: 5px;
}
.blue {
  color: #5cb6ff;
}
</style>