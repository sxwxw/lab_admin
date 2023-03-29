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
import { exportSignLog } from '@/api/table'
// 获取默认时间范围
const useInitTimeEffect = () => {
  const buling = n => {
    return n > 9 ? n : '0' + n
  }
  const date = new Date()
  let y = date.getFullYear()
  let m = buling(date.getMonth() + 1)
  let d = buling(date.getDate())
  const nowTime = y + '-' + m + '-' + d
  date.setTime(date.getTime() + 86400000)
  y = date.getFullYear()
  m = buling(date.getMonth() + 1)
  d = buling(date.getDate())
  const afterTime = y + '-' + m + '-' + d
  return {
    nowTime,
    afterTime
  }
}
// 下载表
const useDownloadEffect = (nowTime, afterTime, searchData) => {
  let excelParams = {
    pageNum: 0,
    pageSize: 0,
    userName: '',
    unitType: '',
    unit: '',
    classGroupName: '',
    stayTime: 0,
    userType: '',
    startTime: nowTime,
    endTime: afterTime
  }
  if (searchData.setTime != '') {
    Object.keys(searchData).map(i => {
      excelParams[i] = searchData[i]
    })
  }
  const confirm = () => {
    exportSignLog(excelParams)
      .then(res => {
        const link = document.createElement('a')
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        const fileName = nowTime + '至' + afterTime + '进出信息表.xls'
        const linkNode = document.createElement('a')
        linkNode.download = fileName //a标签的download属性规定下载文件的名称
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
    },
    searchData: {
      type: Object,
      default: () => {
        return {
          startTime: '',
          endTime: ''
        }
      }
    }
  },
  directives: {
    drag
  },
  setup(props, ctx) {
    const dialog = ref(null)
    const { nowTime, afterTime } = useInitTimeEffect()
    const { confirm } = useDownloadEffect(nowTime, afterTime, props.searchData)
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
<style lang="scss" scoped></style>
