<template>
  <div v-drag class="toplayer">
    <el-dialog ref="dialog" v-model="layer.show" :title="layer.title" :width="layer.width" center>
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
import { defineComponent, ref, watch } from 'vue'
import drag from '@/directive/drag/index'
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
  setup(props, ctx) {
    const dialog = ref(null)
    function confirm() {
      ctx.emit('confirm')
    }
    function close() {
      dialog.value.handleClose()
    }
    return {
      dialog,
      confirm,
      close
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  margin-top: 5vh !important;
}
</style>
