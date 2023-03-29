<template>
  <div v-drag>
    <el-dialog ref="dialog" v-model="layer.showUpaod" :title="layer.title" width="30%" center>
      <el-upload ref="fileUrl" class="upload-demo" action="" :auto-upload="false" :on-change="handleExceed" :on-exceed="ExceedLimit" :limit="1" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip">最多上传一个文件，excel文件最大不超过<strong>10M</strong></div>
      </el-upload>

      <template #footer v-if="layer.showButton">
        <div>
          <el-button type="primary" @click="confirm" :disabled="isUpload">确认</el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { importUserExcel } from '@/api/user'
import { ElMessage } from 'element-plus'
import drag from '@/directive/drag/index'
// 上传功能
const useUplaodEffect = (ctx, close) => {
  // 按钮禁用
  const isUpload = ref(true)
  const fileUrl = ref()
  // 获取数据
  let fileObj = reactive({})
  // 判断是否含有文件
  const UrlFlag = ref(false)
  // 上传文件的执行的钩子
  const handleExceed = files => {
    const form = new FormData()
    form.append('file', files.raw)
    fileObj = form
    isUpload.value = false
    UrlFlag.value = true
  }
  // 后上传的覆盖前边的文件
  const ExceedLimit = files => {
    fileUrl.value.clearFiles()
    fileUrl.value.handleStart(files[0])
  }
  // 点击确认
  const confirm = () => {
    if (!UrlFlag) {
      return console.log('请上传文件')
    }
    importUserExcel(fileObj)
      .then(res => {
        ElMessage({
          message: '上传成功',
          type: 'success'
        })
        ctx.emit('UpaodChangeData')
        close()
      })
      .catch(err => {
        console.log(err)
      })
  }
  return {
    isUpload,
    fileUrl,
    confirm,
    handleExceed,
    ExceedLimit
  }
}
// 模态框
const useDialogEffect = () => {
  const dialog = ref(null)
  // 关闭模态框
  const close = () => {
    dialog.value.handleClose()
  }
  return {
    dialog,
    close
  }
}
export default {
  name: 'upaod',
  components: {},
  props: {
    layer: {
      type: Object,
      default: () => {
        return {
          title: '',
          showButton: false,
          showUpaod: true
        }
      },
      required: true
    }
  },
  directives: {
    drag
  },
  setup(props, ctx) {
    const { dialog, close } = useDialogEffect()
    const { isUpload, fileUrl, confirm, handleExceed, ExceedLimit } = useUplaodEffect(ctx, close)
    return {
      fileUrl,
      dialog,
      confirm,
      close,
      isUpload,
      handleExceed,
      ExceedLimit
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
::v-deep .el-upload-dragger {
  flex: 1;
}
</style>
