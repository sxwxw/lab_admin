<template>
  <div>
    <el-form :model="form" class="search_form">
      <el-form-item label="事由名称">
        <el-input v-model="form.search"></el-input>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" class="search-btn" @click="handleForm(form)">{{ $t('message.common.query') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch } from 'vue'

export default defineComponent({
  name: 'search',
  props: ['addState', 'editState'],
  setup(props, ctx) {
    const form = reactive({
      pageNo: 1,
      pageSize: 10,
      search: ''
    })
    const handleForm = form => {
      ctx.emit('searchContent', form)
    }
    watch(
      () => props.addState,
      (nowval, oldval) => {
        console.log(nowval)
        if (nowval) {
          form.search = ''
        }
      }
    )
    return {
      form,
      handleForm
    }
  }
})
</script>

<style lang="scss" scoped>
.search_form {
  display: flex;
  .el-form-item {
    margin-right: 10px;
  }
}
</style>
