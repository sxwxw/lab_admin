<template>
  <div class="box">
    <Chart :option="option" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Chart from '@/components/charts/index.vue'
import option from './modules/circle'
export default defineComponent({
  components: {
    Chart
  },
  setup() {
    return {
      option
    }
  }
})
</script>

<style lang="scss" scoped>
.box {
  margin: 20px auto 0;
  width: calc(100% - 40px);
  height: 500px;
  background: var(--system-page-background);
  padding: 20px 20px 10px;
  overflow: hidden;
}
</style>
