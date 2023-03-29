<template>
  <div>
    <el-form :model="form" class="search_form">
      <el-form-item label="姓名">
        <el-input v-model="form.realName"></el-input>
      </el-form-item>
      <el-form-item label="单位名称">
        <el-select v-model="form.unitId">
          <el-option v-for="(item, index) in unitName" :label="item" :key="index" :value="index + 1"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" class="search-btn" @click="handleFrom">{{ $t('message.common.query') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import { toRefs, watch } from 'vue'
import { defineComponent, reactive } from 'vue'
import { getAallUnit, getAallUserType, getAallClass } from '@/api/user'
export default defineComponent({
  name: 'search',
  props: ['addState'],
  setup(props, ctx) {
    watch(
      () => props.addState,
      (nowval, oldval) => {
        if (nowval) {
          form.unitId = null
          form.realName = ''
        }
      }
    )
    const unit = reactive({
      unitName: []
    })
    let form = reactive({
      pageNum: 1,
      pageSize: 10,
      realName: '',
      unitType: null,
      unitId: null,
      userTypeId: null,
      classGroupId: null
    })
    // 获取单位和单位类型
    getAallUnit().then(res => {
      const data = res.data
      data.filter(function (item) {
        unit.unitName.push(item.name)
      })
    })
    const handleFrom = () => {
      ctx.emit('searchContent', form)
    }
    const { unitName } = toRefs(unit)
    return {
      form,
      unitName,
      handleFrom
    }
  }
})
</script>

<style lang="scss" scoped>
.search_form {
  display: flex;
  .el-form-item {
    margin-right: 10px;
    margin-left: 10px;
  }
}
</style>
