<template>
  <div id="toolsbar">
    <el-upload v-if="step<1"
               class="button"
               ref="upload"
               action="#"
               accept="image/png,image/gif,image/jpg,image/jpeg"
               :auto-upload="false"
               :show-file-list="false"
               :file-list="fileList"
               :on-change="addImage">
      <el-button class="upload">上传</el-button>

    </el-upload>
    <div v-if="step<=1"
         class="button">
      <el-radio-group v-if="step==0"
                      v-model="mode"
                      @change="changeMode">
        <el-radio-button label="素描"></el-radio-button>
        <el-radio-button label="橡皮"></el-radio-button>
      </el-radio-group>
      <el-radio-group v-if="step==1"
                      v-model="mode"
                      @change="changeMode">
        <el-radio-button label="蒙版"></el-radio-button>
        <el-radio-button label="素描"></el-radio-button>
        <el-radio-button label="画笔"></el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="step<=1"
         class="info blue">画笔粗细</div>
    <el-input-number v-if="step<=1"
                     v-model="size"
                     @change="changeSize"
                     :min="1"
                     :max="100"
                     label="画笔粗细"
                     size="small"></el-input-number>
    <div v-if="step==0"
         class="button">
      <div class="info blue">性别</div>
      <el-radio-group v-if="step==0"
                      v-model="gender"
                      @change="changeGender">
        <el-radio-button label="男性"></el-radio-button>
        <el-radio-button label="女性"></el-radio-button>
      </el-radio-group>

    </div>
    <div v-if="step==1"
         class="button">
      <div class="info blue">颜色选择</div>
      <el-color-picker v-model="color"
                       :predefine="predefineColors"
                       @change="changeColor"></el-color-picker>
    </div>
    <div v-if="step<=1"
         class="button">
      <el-button v-if="stack>1"
                 class="action"
                 @click="onRevoke">撤销</el-button>
      <el-button v-else
                 disabled
                 class="action"
                 @click="onRevoke">撤销</el-button>
    </div>
    <div v-if="step<=1"
         class="button">
      <el-button v-if="stack>1"
                 class="action"
                 @click="onClean">清空</el-button>
      <el-button v-else
                 disabled
                 class="action"
                 @click="onClean">清空</el-button>
    </div>
    <div v-if="step<=1"
         class="button">
      <el-button class="operation"
                 @click="onGenerate">生成</el-button>
    </div>
    <div class="button"
         v-if="step == 0">
      <el-button v-if="stack>1"
                 class="operation"
                 style="width:50%"
                 @click="onSaveSketch">保存草图</el-button>
      <el-button v-else
                 disabled
                 class="operation"
                 style="width:50%"
                 @click="onSaveSketch">保存草图</el-button>
    </div>
    <div v-if="step <= 1"
         class="button">
      <el-button v-if="(step == 0 &&sketchNumber>0) ||(step == 1 &&faceNumber>0)"
                 class="operation"
                 @click="onSave">保存</el-button>
      <el-button v-else
                 disabled
                 class="operation"
                 @click="onSave">保存</el-button>
    </div>
    <div v-else
         class="button"
         style="margin-top: 300px;">
      <el-button class="operation"
                 @click="onSave">保存</el-button>
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
      fileList: [],
      mode: '素描',
      gender: '男性',
      size: 1,
      color: '#5cb6ff',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
      ],
    }
  },
  props: {
    step: Number,
    stack: Number,
    sketchNumber: Number,
    faceNumber: Number,
  },
  methods: {
    // 点击文件列表中已上传的文件时的钩子
    uploadFile() {
      this.$refs.upload.submit()
    },
    addImage(file) {
      this.$emit('upload', file)
    },
    next() {
      console.log('?')
      //   this.step++
      this.$emit('next', this.step)
      this.$emit('color', this.color)
      //   if (this.step == 1) {
      //     this.$emit('color', this.color)
      //     this.mode = '素描'
      //     this.changeMode()
      //   }
    },
    changeSize() {
      this.$emit('size', this.size)
    },
    changeGender() {
      this.$emit('gender', this.gender)
    },
    changeMode() {
      this.$emit('color', this.color)
      this.$emit('mode', this.mode)
    },
    changeColor() {
      this.mode = '画笔'
      this.changeMode()
      this.$emit('color', this.color)
    },
    onGenerate() {
      this.$emit('generate')
    },
    onSave() {
      this.$emit('save')
    },
    onSaveSketch() {
      this.$emit('save-sketch')
    },
    onRevoke() {
      this.$emit('revoke')
    },
    onClean() {
      this.$emit('clean')
    },
  },
}
</script>
<style scoped>
#toolsbar {
  display: inline-block;
  width: 98%;
  height: 620px;
  background-color: #fff;
  border: 2px solid #ededed;
  box-shadow: -2px 2px 1px 1px #ededed;
}
.button {
  display: block;
  width: 100%;
  margin: 25px auto;
}
.upload {
  width: 80px;
  height: 30px;
  color: #fff;
  background-color: #a1c4fd;
  padding: 0;
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