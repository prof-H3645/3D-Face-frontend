<template>
  <el-container>
    <el-header height="60px">
      <MyHeader :step="step"></MyHeader>
    </el-header>
    <el-container style="background-color:#fcfcfc;">
      <el-aside width="15%"
                style="margin:10px;">
        <ToolsBar @next="next"
                  @size="changeSize"
                  @gender="changeGender"
                  @mode="changeMode"
                  @color="changeColor"
                  @generate="onGenerate"
                  @save="onSave"
                  @save-sketch="onSaveSketch"
                  @revoke="onRevoke"
                  @clean="onClean"
                  @upload="onUpload"
                  :step="step"
                  :stack="stackSize"
                  :sketchNumber="sketchNumber"
                  :faceNumber="faceNumber"></ToolsBar>
      </el-aside>
      <el-main style="padding:10px;">
        <div class="canvas"
             v-if="step<=1">
          <canvas id="myCanvas"
                  :width="canvasSide"
                  :height="canvasSide"
                  style="border: 1px solid #000;"
                  @mousedown="touchStart"></canvas>
        </div>

        <div v-if="step<=1"
             class="output">
          <canvas :width="canvasSide"
                  :height="canvasSide"
                  style="border: 1px solid #000;"
                  id="output"></canvas>
        </div>
        <model-obj v-loading="loading"
                   v-if="step==2"
                   backgroundColor="#abc"
                   :width="modelWidth"
                   :height="modelHeight"
                   :backgroundAlpha="0"
                   :src="objUrl"
                   :lights="lights"
                   :mtl="mtlUrl">
        </model-obj>
      </el-main>
    </el-container>
    <canvas id="mask"
            :width="canvasSide"
            :height="canvasSide"
            style="position:absolute;top:100%;left:0;display:none;"></canvas>
    <canvas id="sketch"
            :width="canvasSide"
            :height="canvasSide"
            style="position:absolute;top:100%;left:50%;display:none;"></canvas>
    <canvas id="color"
            :width="canvasSide"
            :height="canvasSide"
            style="position:absolute;top:100%;left:100%;display:none;"></canvas>
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
      gender: '男性',
      penWeight: 0.1,
      penColor: '#000',
      canvasContext: {},
      maskContext: {},
      sketchContext: {},
      colorContext: {},
      canvasOffsetLeft: 0,
      canvasOffsetTop: 0,
      canvasSide: 400,
      start_X: 0,
      start_Y: 0,
      modelWidth: 600,
      modelHeight: 600,
      sketchNumber: 0,
      faceNumber: 0,
      baseUrl: 'http://mist@gpu08.mistgpu.xyz:18004/',
      //   baseUrl1: 'http://mist@gpu08.mistgpu.xyz:18004/',
      tempUrl: '', //素描生成人脸的临时文件
      faceUrl: '', //精修之后的人脸文件
      faceDataUrl: '', //准备发送的精修人脸文件
      originDataUrl: '',
      maskDataUrl: '',
      sketchDataUrl: '',
      colorDataUrl: '',
      objUrl: '',
      mtlUrl: '',
      loading: true,
      lights: [
        {
          type: 'HemisphereLight',
          position: { x: 0, y: 1, z: 0 },
          skyColor: 0xffffff,
          // groundColor: 0xFF0000, 此代码为灯光后颜色
          intensity: 1,
        },
        {
          type: 'DirectionalLight',
          position: { x: 1, y: 1, z: 1 },
          color: 0xffffff,
          intensity: 0.8,
        },
      ],
      canvasStack: [],
      maskStack: [],
      sketchStack: [],
      colorStack: [],
      stackSize: 1,
    }
  },
  created() {
    console.log(window.innerWidth)
    console.log(window.innerHeight)
    this.canvasSide = Math.ceil(window.innerWidth * 0.35 - 26)
  },
  mounted() {
    var canvas = document.getElementById('myCanvas')
    var output = document.getElementById('output')
    var side = this.canvasSide

    this.canvasContext = canvas.getContext('2d')
    this.outputContext = output.getContext('2d')
    this.canvasOffsetLeft = canvas.offsetLeft
    this.canvasOffsetTop = canvas.offsetTop
    this.canvasContext.fillStyle = '#ffffff'
    this.canvasContext.fillRect(0, 0, side, side)
    this.outputContext.fillStyle = '#ffffff'
    this.outputContext.fillRect(0, 0, side, side)
    var mask = document.getElementById('mask')
    this.maskContext = mask.getContext('2d')
    this.maskContext.fillRect(0, 0, side, side)
    this.maskContext.save()
    var sketch = document.getElementById('sketch')
    this.sketchContext = sketch.getContext('2d')
    this.sketchContext.fillRect(0, 0, side, side)
    this.sketchContext.save()
    var color = document.getElementById('color')
    this.colorContext = color.getContext('2d')
    this.colorContext.fillRect(0, 0, side, side)
    this.colorContext.save()
    this.canvasStack[0] = this.canvasContext.getImageData(0, 0, side, side)
    this.maskStack[0] = this.maskContext.getImageData(0, 0, side, side)
    this.sketchStack[0] = this.sketchContext.getImageData(0, 0, side, side)
    this.colorStack[0] = this.colorContext.getImageData(0, 0, side, side)
    var that = this
    canvas.ontouchstart = function (e) {
      console.log('touch start')
      //   var simEvent = that.touchEventToMouseEvent(e, 'mousedown')
      that.touchStart(e)
      e.preventDefault()
    }
    canvas.ontouchmove = function (e) {
      console.log('touch move')
      //   var simEvent = that.touchEventToMouseEvent(e, 'mousemove')
      that.touchMove(e)
      e.preventDefault()
    }
    canvas.ontouchend = function (e) {
      console.log('touch end')
      //   var simEvent = that.touchEventToMouseEvent(e, 'mouseup')
      that.touchEnd(e)
      e.preventDefault()
    }
  },
  methods: {
    next() {
      if (this.step == 0 && this.sketchNumber == 0) {
        this.$alert('你还没生成人脸照片呢', '提醒', {
          confirmButtonText: '确定',
          callback: (action) => {
            this.$message({
              type: 'info',
              message: `action: ${action}`,
            })
          },
        })
      } else if (this.step == 0 && this.sketchNumber >= 1) {
        this.step = 1
        this.mode = '素描'
        var ctx = this.canvasContext
        var side = this.canvasSide
        var output = this.outputContext
        var imgData = output.getImageData(0, 0, side, side)
        ctx.putImageData(imgData, 0, 0)
        var canvas = document.getElementById('myCanvas')
        this.originDataUrl = canvas.toDataURL().slice(22)
        this.stackSize = 1
        this.canvasStack.length = 1
        this.canvasStack[0] = imgData
      } else if (this.step == 1 && this.faceNumber == 0) {
        this.$alert('你还没精修人脸照片呢', '提醒', {
          confirmButtonText: '确定',
          callback: (action) => {
            this.$message({
              type: 'info',
              message: `action: ${action}`,
            })
          },
        })
      } else if (this.step == 1 && this.faceNumber >= 1) {
        console.log('generating model')
        this.step = 2
        this.loading = true
        var self = this
        var image = new Image()
        image.src = this.faceUrl
        image.setAttribute('crossOrigin', 'anonymous')

        image.onload = function () {
          var new_canvas = document.createElement('canvas')
          new_canvas.width = image.width
          new_canvas.height = image.height
          var context = new_canvas.getContext('2d')
          context.drawImage(image, 0, 0, image.width, image.height)
          self.faceDataUrl = new_canvas.toDataURL().slice(22)
          new_canvas = null
          self
            .$axios({
              method: 'post',
              url: self.baseUrl + 'face2model',
              data: {
                data: {
                  name: 'new_model_' + new Date(),
                  original: self.faceDataUrl,
                },
              },
              header: {
                'content-type': 'application/json',
              },
            })
            .then(
              (res) => {
                console.log(res.data)
                if (res.data.success == true) {
                  self.objUrl = res.data.result.obj
                  self.mtlUrl = res.data.result.mtl
                  self.loading = false
                }
              },
              (err) => {
                console.log(err)
              }
            )
            .catch((error) => {
              console.log(error)
            })
        }
        // var dataURL = canvas.toDataURL().slice(22) //返回的是一串Base64编码的URL并指定格式
      }
    },
    changeSize(size) {
      this.penWeight = size
    },
    changeGender(gender) {
      this.gender = gender
    },
    changeMode(mode) {
      this.mode = mode
    },
    changeColor(color) {
      this.penColor = color
    },
    touchStart(e) {
      /*找到鼠标（画笔）的坐标*/
      var canvas = document.getElementById('myCanvas')
      var ctx = this.canvasContext
      //配置画笔
      if (this.mode == '橡皮' || this.mode == '蒙版') ctx.strokeStyle = '#fff'
      else if (this.mode == '素描') ctx.strokeStyle = '#000'
      else ctx.strokeStyle = this.penColor
      ctx.lineWidth = this.penWeight
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      this.start_X = e.pageX - this.canvasOffsetLeft
      this.start_Y = e.pageY - this.canvasOffsetTop
      ctx.beginPath() //开始本次绘画
      canvas.onmousemove = this.touchMove
      canvas.onmouseup = this.touchEnd
      if (this.step == 1) {
        if (this.mode == '蒙版') {
          this.maskContext.strokeStyle = '#fff'
          this.maskContext.lineWidth = this.penWeight
          this.maskContext.lineCap = 'round'
          this.maskContext.lineJoin = 'round'
          this.maskContext.beginPath()
        } else if (this.mode == '素描') {
          this.sketchContext.strokeStyle = '#fff'
          this.sketchContext.lineWidth = this.penWeight
          this.sketchContext.lineCap = 'round'
          this.sketchContext.lineJoin = 'round'
          this.sketchContext.beginPath()
        } else {
          this.colorContext.strokeStyle = this.penColor
          this.colorContext.lineWidth = this.penWeight
          this.colorContext.lineCap = 'round'
          this.colorContext.lineJoin = 'round'
          this.colorContext.beginPath()
        }
      }
    },
    touchMove(e) {
      var ctx = this.canvasContext
      /*找到鼠标（画笔）的坐标*/
      var move_X = e.pageX - this.canvasOffsetLeft
      var move_Y = e.pageY - this.canvasOffsetTop
      ctx.moveTo(this.start_X, this.start_Y)
      ctx.lineTo(move_X, move_Y) //根据鼠标路径绘画
      ctx.stroke() //立即渲染
      if (this.step == 1) {
        if (this.mode == '蒙版') {
          this.maskContext.moveTo(this.start_X, this.start_Y)
          this.maskContext.lineTo(move_X, move_Y) //根据鼠标路径绘画
          this.maskContext.stroke() //立即渲染
        } else if (this.mode == '素描') {
          this.sketchContext.moveTo(this.start_X, this.start_Y)
          this.sketchContext.lineTo(move_X, move_Y) //根据鼠标路径绘画
          this.sketchContext.stroke() //立即渲染
        } else {
          this.colorContext.moveTo(this.start_X, this.start_Y)
          this.colorContext.lineTo(move_X, move_Y) //根据鼠标路径绘画
          this.colorContext.stroke() //立即渲染
        }
      }
      this.start_X = move_X
      this.start_Y = move_Y
    },
    touchEnd(e) {
      var canvas = document.getElementById('myCanvas')
      var side = this.canvasSide
      var ctx = this.canvasContext
      console.log(e)
      ctx.closePath() //结束本次绘画
      this.canvasStack[this.canvasStack.length] = ctx.getImageData(
        0,
        0,
        side,
        side
      )
      if (this.step == 1) {
        if (this.mode == '蒙版') {
          this.maskContext.closePath()
          this.maskStack[this.maskStack.length] = this.maskContext.getImageData(
            0,
            0,
            side,
            side
          )
        } else if (this.mode == '素描') {
          this.sketchContext.closePath()
          this.sketchStack[
            this.sketchStack.length
          ] = this.sketchContext.getImageData(0, 0, side, side)
        } else {
          this.colorContext.closePath()
          this.colorStack[
            this.colorStack.length
          ] = this.colorContext.getImageData(0, 0, side, side)
        }
      }
      canvas.onmousemove = null
      canvas.onmouseup = null
      this.stackSize++
    },
    onClean() {
      this.stackSize = 1
      this.canvasContext.putImageData(this.canvasStack[0], 0, 0)
      this.canvasStack.length = 1
      if (this.step == 1) {
        this.maskContext.putImageData(this.maskStack[0], 0, 0)
        this.maskStack.length = 1

        this.sketchContext.putImageData(this.sketchStack[0], 0, 0)
        this.sketchStack.length = 1

        this.colorContext.putImageData(this.colorStack[0], 0, 0)
        this.colorStack.length = 1
      }
    },
    onSave() {
      console.log('save')
      var img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')
      var dlLink = document.createElement('a')
      if (this.step == 2) {
        dlLink.href = this.objUrl
        document.body.appendChild(dlLink)
        dlLink.click()
        document.body.removeChild(dlLink)
      } else {
        if (this.step == 0) {
          img.src = this.tempUrl
        } else if (this.step == 1) {
          img.src = this.faceUrl
        }
        var new_canvas = document.createElement('canvas')
        new_canvas.width = img.width
        new_canvas.height = img.height
        var context = new_canvas.getContext('2d')
        context.drawImage(img, 0, 0, img.width, img.height)
        var faceDataUrl = new_canvas.toDataURL('image/png')
        if (this.step == 0) {
          dlLink.download = 'sketch_output' + this.sketchNumber + '.png'
        } else if (this.step == 1) {
          dlLink.download = 'face_output' + this.faceNumber + '.png'
        }
        dlLink.href = faceDataUrl
        document.body.appendChild(dlLink)
        dlLink.click()
        document.body.removeChild(dlLink)
        new_canvas = null
      }
    },
    onSaveSketch() {
      var canvas = document.getElementById('myCanvas')
      var imgURL = canvas.toDataURL('image/png')
      var dlLink = document.createElement('a')
      dlLink.download = 'sketch' + (this.stackSize - 1) + '.png'
      dlLink.href = imgURL
      // dlLink.dataset.downloadurl = [dlLink.download, dlLink.href].join(':')
      document.body.appendChild(dlLink)
      dlLink.click()
      document.body.removeChild(dlLink)
    },
    onGenerate() {
      var canvas = document.getElementById('myCanvas')
      var mask = document.getElementById('mask')
      var sketch = document.getElementById('sketch')
      var color = document.getElementById('color')
      if (this.step == 0) {
        var dataUrl = canvas.toDataURL().slice(22)
        this.$axios({
          method: 'post',
          url: this.baseUrl + 'sketch2image',
          data: {
            data: {
              name: 'new_sketch_' + this.sketchNumber + new Date().getTime(),
              gender: this.gender == '男性' ? 0 : 1,
              sketch: dataUrl,
            },
          },
          header: {
            'content-type': 'application/json',
          },
        })
          .then(
            (res) => {
              console.log(res.data)
              if (res.data.success == true) {
                this.tempUrl = res.data.result
                this.sketchNumber++
                console.log(this.sketchNumber)
                var ctx = this.outputContext
                var img = new Image()
                var side = this.canvasSide
                img.setAttribute('crossOrigin', 'anonymous')
                img.src = res.data.result
                img.onload = function () {
                  ctx.drawImage(img, 0, 0, side, side)
                }
              }
            },
            (err) => {
              console.log(err)
            }
          )
          .catch((error) => {
            console.log(error)
          })
      } else if (this.step == 1) {
        console.log('step=1 generate')
        this.maskDataUrl = mask.toDataURL().slice(22)
        this.sketchDataUrl = sketch.toDataURL().slice(22)
        this.colorDataUrl = color.toDataURL().slice(22)
        this.$axios({
          method: 'post',
          url: this.baseUrl + 'face_editing',
          data: {
            data: {
              name: 'new_face_' + this.faceNumber + new Date(),
              original: this.originDataUrl,
              mask: this.maskDataUrl,
              sketch: this.sketchDataUrl,
              stroke: this.colorDataUrl,
            },
          },
          header: {
            'content-type': 'application/json',
          },
        })
          .then(
            (res) => {
              console.log(res.data)
              if (res.data.success == true) {
                this.faceUrl = res.data.result
                this.faceNumber++
                var ctx = this.outputContext
                var side = this.canvasSide
                var img = new Image()
                img.setAttribute('crossOrigin', 'anonymous')
                img.src = res.data.result
                img.onload = function () {
                  ctx.drawImage(img, 0, 0, side, side)
                }
              }
            },
            (err) => {
              console.log(err)
            }
          )
          .catch((error) => {
            console.log(error)
          })
      }
    },
    onRevoke() {
      this.stackSize--
      this.canvasStack.length--
      this.canvasContext.putImageData(
        this.canvasStack[this.canvasStack.length - 1],
        0,
        0
      )
      if (this.step == 1) {
        if (this.mode == '蒙版') {
          this.maskStack.length--
          this.maskContext.putImageData(
            this.maskStack[this.maskStack.length - 1],
            0,
            0
          )
        } else if (this.mode == '素描') {
          this.sketchStack.length--
          this.sketchContext.putImageData(
            this.sketchStack[this.sketchStack.length - 1],
            0,
            0
          )
        } else if (this.mode == '画笔') {
          this.colorStack.length--
          this.colorContext.putImageData(
            this.colorStack[this.colorStack.length - 1],
            0,
            0
          )
        }
      }
    },
    onUpload(file) {
      var that = this
      var reader = new FileReader()
      var ctx = this.canvasContext
      var side = this.canvasSide
      if (file) {
        //通过文件流将文件转换成Base64字符串
        reader.readAsDataURL(file.raw)
        //转换成功后
        reader.onload = function () {
          var img = new Image()
          img.src = reader.result
          img.onload = function () {
            ctx.drawImage(img, 0, 0, side, side)
            that.canvasStack[0] = ctx.getImageData(0, 0, side, side)
            that.canvasStack.length = 1
            that.stackSize = 1
          }
        }
      }
    },
    touchEventToMouseEvent(event, eventType) {
      if (
        !event.originalEvent ||
        !event.originalEvent.targetTouches ||
        event.originalEvent.targetTouches.length != 1
      )
        return false
      var te = event.originalEvent.targetTouches[0]
      var clientX = te.clientX,
        clientY = te.clientY,
        screenX = te.screenX,
        screenY = te.screenY
      var simEvent = new MouseEvent(eventType, {
        clientX: clientX,
        clientY: clientY,
        screenX: screenX,
        screenY: screenY,
        button: 0,
        buttons: 0,
      })
      return simEvent
    },
  },
}
</script>
<style>
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.canvas {
  float: left;
  margin-left: 5%;
  margin-top: 50px;
}
.output {
  float: right;
  margin-right: 5%;
  margin-top: 50px;
}
</style>
