<template>
  <div v-drag>
    <el-dialog ref="dialog" v-model="layer.show" :title="layer.title" :width="layer.width" center :before-close="closeExpertFormDialog" @opened="open()">
      <div class="cream" ref="layerDemo">
        <video id="videoCamera" :width="videoWidth" :height="videoHeight" autoplay></video>
        <canvas style="display: none" id="canvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
        <div v-show="imgSrc" class="img_bg_camera">
          <img :src="imgSrc" alt class="tx_img" />
        </div>
      </div>
      <template #footer>
        <div>
          <el-button @click="setImage()">拍照</el-button>
          <el-button @click="postImg(layer.row)" :loading="loding" :disabled="disabled">上传</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { registerUserFaceBase64 } from '@/api/user'
import drag from '@/directive/drag/index'
import { ElMessage } from 'element-plus'
import {} from 'vue'
export default defineComponent({
  props: {
    layer: {
      type: Object,
      required: true
    },
    upaod: {
      type: Object
    }
  },
  directives: {
    drag
  },
  data() {
    return {
      videoWidth: 250,
      videoHeight: 350,
      imgSrc: '',
      file: '',
      base: '',
      thisCancas: null,
      thisContext: null,
      thisVideo: null,
      openVideo: false,
      loding: false,
      disabled: true,
      layerDom: null,
      dialog: null
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    },
    // 调用权限（打开摄像头功能）
    getCompetence() {
      var _this = this
      _this.thisCancas = document.getElementById('canvasCamera')
      _this.thisContext = this.thisCancas.getContext('2d')
      _this.thisVideo = document.getElementById('videoCamera')
      _this.thisVideo.style.display = 'block'
      _this.openVideo = true
      // 获取媒体属性，旧版本浏览器可能不支持mediaDevices，我们首先设置一个空对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
      // 使用getUserMedia，因为它会覆盖现有的属性。
      // 这里，如果缺少getUserMedia属性，就添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先获取现存的getUserMedia(如果存在)
          var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia
          // 有些浏览器不支持，会返回错误信息
          // 保持接口一致
          if (!getUserMedia) {
            //不存在则报错
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
          }
          // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      var constraints = {
        audio: false,
        video: {
          width: this.videoWidth,
          height: this.videoHeight,
          transform: 'scaleX(-1)'
        }
      }
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          // 旧的浏览器可能没有srcObject
          if ('srcObject' in _this.thisVideo) {
            _this.thisVideo.srcObject = stream
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            _this.thisVideo.src = window.URL.createObjectURL(stream)
          }
          _this.thisVideo.onloadedmetadata = function (e) {
            _this.thisVideo.play()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //  绘制图片（拍照功能）
    setImage(layer) {
      var _this = this
      _this.imgSrc = ''
      _this.disabled = false
      // canvas画图
      _this.thisContext.drawImage(_this.thisVideo, 0, 0, _this.videoWidth, _this.videoHeight)
      // 获取图片base64链接
      _this.base = this.thisCancas.toDataURL('image/jpeg')
      // _this.file = this.dataURLtoFile(image, 'png')
      _this.imgSrc = _this.base //赋值并预览图片
    },
    // 关闭摄像头
    closeExpertFormDialog(done) {
      if (this.openVideo === false) {
        return done()
      }
      this.disabled = true
      this.imgSrc = ''
      this.openVideo = false
      this.thisVideo.srcObject.getTracks()[0].stop()
      done()
    },
    // base64转文件，此处没用到
    dataURLtoFile(urlData, fileName) {
      let arr = urlData.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bytes = atob(arr[1]) // 解码base64
      let n = bytes.length
      let ia = new Uint8Array(n)
      while (n--) {
        ia[n] = bytes.charCodeAt(n)
      }
      return new File([ia], fileName, { type: mime })
    },
    // 上传接口
    postImg(layer) {
      setTimeout(() => {
        this.layerDom && this.layerDom.close()
      }, 1000)
      this.loding = true
      let params = reactive({
        user_id: layer.id,
        base64: this.base
      })
      registerUserFaceBase64(params)
        .then(res => {
          console.log(res)
          this.disabled = true
          this.loding = false
          ElMessage({
            type: 'success',
            message: '注册成功'
          })
          this.$emit('creamSuccess', true)
          this.$emit('getTableData', false)
        })
        .catch(err => {
          this.loding = false
          console.log(err)
        })
    },
    // 默认打开摄像头
    open() {
      this.getCompetence()
    }
  }
})
</script>

<style lang="scss" scoped>
.cream {
  display: flex;
  justify-content: space-around;
  #videoCamera {
    background-color: rgb(218, 218, 218);
  }
}
</style>
