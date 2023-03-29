<template>
  <div class="layout-container"></div>
</template>

<script>
import { onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'backups',
  setup(props, ctx) {
    const store = useStore()
    store.commit('app/changedrow', true)
    onBeforeRouteLeave((to, from) => {
      store.commit('app/changedrow', false)
    })
  }
}
</script>
<style lang="scss" scoped></style>
