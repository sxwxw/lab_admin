<template>
  <div v-drag>
    <el-dialog ref="dialog" v-model="layer.showDownload" :title="layer.title" width="30%" center>
      <slot></slot>
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
import { ExportClassGroupExcel } from '@/api/table'
// 下载表
const useDownloadEffect = () => {
  let excelParams = {
    pageNum: 0,
    pageSize: 0,
    unitid: '',
    classGroupName: ''
  }
  const confirm = () => {
    ExportClassGroupExcel(excelParams)
      .then(res => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        const linkNode = document.createElement('a')
        linkNode.download = '课题组信息表' //a标签的download属性规定下载文件的名称
        linkNode.style.display = 'none'
        linkNode.href = URL.createObjectURL(blob) //生成一个Blob URL
        document.body.appendChild(linkNode)
        linkNode.click() //模拟在按钮上的一次鼠标单击
        URL.revokeObjectURL(linkNode.href) // 释放URL 对象
        document.body.removeChild(linkNode)
      })
      .catch(err => {
        console.log(err)
      })
  }
  return {
    confirm
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
    // const { nowTime, afterTime } = useInitTimeEffect()
    const { confirm } = useDownloadEffect()
    const close = () => {
      dialog.value.handleClose()
    }
    return {
      dialog,
      confirm,
      close
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog--center .el-dialog__body {
  // display: flex;
  // justify-content: center;
  text-align: center;
}
</style>
