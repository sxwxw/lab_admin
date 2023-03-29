/*
* 使用说明：用户只需传入options即可，options请参照官网示例中的options
* 本组件采用整包引入echarts的方法，用于适配所有的echarts控件
* 如需按需加载引入echarts，可参照写法：echarts官网/在打包环境中使用ECharts
*/
<template>
  <div
    ref="chart"
    class="chart"
  />
</template>

<script>
import { defineComponent, ref, onMounted, watch, reactive,toRefs } from 'vue'
import { useEventListener } from '@vueuse/core' // 引入监听函数，监听在vue实例中可自动销毁，无须手动销毁
import * as echarts from 'echarts'
var myChart
export default defineComponent({
  props: {
    option: Object
  },
  setup(props) {
    let option = props.option
    const state = reactive({
      chart:ref()
    })
    onMounted(() => {
      myChart = echarts.init(state.chart)
      myChart.setOption(option)
      useEventListener('resize', () => myChart.resize())
      watch(
          () => props.option,
          newVal => {
            myChart.setOption(newVal)
          }
      )
    })
    return {
      option,
     ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
</style>