<template>
  <div>
    <el-form :model="form" class="search_form">
      <el-form-item label="姓名">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="单位">
        <el-select v-model="form.realName"></el-select>
      </el-form-item>
      <el-form-item label="单位类型">
        <el-select v-model="form.unit"></el-select>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-select v-model="form.userType"></el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" class="search-btn" @click="getTableData(true)">{{ $t('message.common.query') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'search',
  setup() {
    let form = ref({
      realName: '',
      unit: '',
      userType: ''
    })
    return {
      form
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
