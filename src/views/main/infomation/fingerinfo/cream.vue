<template>
  <div v-drag>
    <el-dialog ref="dialog" v-model="layer.show" :title="layer.title" :width="layer.width" @close="closeDialog()">
      <div class="cream" ref="layerDemo">
        <div class="scan">
          <div class="fingerPrint"></div>
        </div>
		<br />
		<p>{{tip}}</p>
      </div>
      <template #footer>
        <div>
          <el-button @click="cancelDialog(layer)">取消</el-button>
          <el-button @click="handleAnimation(layer)">录入指纹</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, nextTick, watch } from 'vue'
import drag from '@/directive/drag/index'
import { ElMessage } from 'element-plus'
import { registerFinger } from '@/api/user'
// webSocket
import useSocket from "@/utils/system/use-socket.js"


const tip = ref('')

function handleMessage(e) {
  const classNames = ['fingerPrints', 'fingerPrintss', 'fingerPrintsss'] 
  const scan = document.querySelector('.scan').childNodes[0]
  if (e.data == '第一次登记，请按手指') {
    setClassName('fingerPrints')
  } else if (e.data == '第二次登记，请按手指') {
    setClassName('fingerPrintss')
  } else if (e.data == '第三次登记，请按手指') {
    setClassName('fingerPrintsss')
  }
	tip.value = e.data
  
}
const setClassName = (name) => {
  const scan = document.querySelector('.scan').childNodes[0]
  scan.className = name
}


export default defineComponent({
  props: {
    layer: {
      type: Object,
      required: true
    },
    wsocket: {
      type: Object,
      required: true
    }
  },
  directives: {
    drag
  },
  setup(props, context) {
    const init = () => {
      nextTick(()=>{
        setClassName('fingerPrint')
      })
      tip.value = '点击开始录入指纹'
      const { ws } = useSocket(handleMessage)
      return {
        ws
      }
    }
    const closeDialog = () => {
      // 断开websocket连接
      props.wsocket.close()
    }
    const handleAnimation = (layer) => {
      let params = reactive({
        user_id: layer.row.id
      })
      registerFinger(params)
        .then(res => {
            tip.value = res.msg
            layer.show = false
            ElMessage({
              type: 'success', 
              message: res.msg
            })
            context.emit('creamSuccess', true)
            context.emit('getTableData', false)   
        })
        .catch(err => {
          // 指纹登记失败回调
          tip.value = err.msg
        })
	}
  const cancelDialog = (layer) => {
    layer.show = false
  }
	return {
	  handleAnimation,
    cancelDialog,
	  tip,
    init,
    closeDialog
	}
  }
})
</script>

<style lang="scss" scoped>
.scan {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fingerPrint {
  position: relative;
  width: 200px;
  height: 200px;
  background: url(./fingerPrint_01.png);
  background-size: 200px;
}
.fingerPrint::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(./fingerPrint_02.png);
  background-size: 200px;
  // animation: animate 4s ease-in-out infinite;
}
.fingerPrints {
  position: relative;
  width: 200px;
  height: 200px;
  background: url(./fingerPrint_01.png);
  background-size: 200px;
}
.fingerPrints::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(./fingerPrint_02.png);
  background-size: 200px;
  animation: animate1 4s ease-in-out;
  animation-fill-mode: forwards;
}
.fingerPrintss {
  position: relative;
  width: 200px;
  height: 200px;
  background: url(./fingerPrint_01.png);
  background-size: 200px;
}
.fingerPrintss::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(./fingerPrint_02.png);
  background-size: 200px;
  animation: animate2 4s ease-in-out;
  animation-fill-mode: forwards;
}
.fingerPrintsss {
  position: relative;
  width: 200px;
  height: 200px;
  background: url(./fingerPrint_01.png);
  background-size: 200px;
}
.fingerPrintsss::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(./fingerPrint_02.png);
  background-size: 200px;
  animation: animate3 4s ease-in-out;
  animation-fill-mode: forwards;
}
@keyframes animate1 {
  0% {
    height: 0%;
  }
  100% {
    height: 33%;
  }
}
@keyframes animate2 {
  0% {
    height: 33%;
  }
  100% {
    height: 66%;
  }
}
@keyframes animate3 {
  0% {
    height: 66%;
  }
  100% {
    height: 100%;
  }
}
.el-dialog__footer {
  div {
    display: flex;
    justify-content: center;
  }
}
</style>
