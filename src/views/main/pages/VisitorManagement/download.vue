<!--  -->
<template>
  <div v-drag>
    <el-dialog ref="dialog" v-model="layer.showDownload" :title="layer.title" width="30%" center>
      <span>是否下载用户导入的空白模板？</span>
      <template #footer v-if="layer.showButton">
        <div>
          <el-button type="primary" @click="confirm">确认</el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import drag from '@/directive/drag/index'
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
          showDownload: true
        }
      },
      required: true
    }
  },
  directives: {
    drag
  },
  setup(props, ctx) {
    const dialog = ref(null)
    const close = () => {
      dialog.value.handleClose()
    }
    const confirm = close => {
      let url = 'http://localhost:8088/api/user/getVisitorImportTemplate'
      let ele = document.createElement('a')
      ele.download = '进出信息表'
      ele.href = url
      ele.style.display = 'none'
      document.body.appendChild(ele)
      ele.click()
      document.body.removeChild(ele)
      close()
    }

    return {
      dialog,
      confirm,
      close
    }
  }
}
</script>
<style lang="scss" scoped></style>
