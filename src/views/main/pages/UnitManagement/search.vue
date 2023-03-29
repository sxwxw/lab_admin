<template>
  <div>
    <el-form :model="form" class="search_form">
      <el-form-item label="单位类型">
        <el-select v-model="form.unitType">
          <el-option v-for="(item, index) in unitTypeAry" :label="item" :key="index" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位名称">
        <el-input v-model="form.unitName"></el-input>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" class="search-btn" @click="handleForm(form)">{{ $t('message.common.query') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import { toRefs } from '@vueuse/core'
import { defineComponent, reactive, ref, watch } from 'vue'
import { getAallUnit, getAallClass } from '@/api/user'
const allSelectDataEffect = () => {
  const unit = reactive({
    unitTypeAry: []
  })
  getAallUnit().then(res => {
    const data = res.data
    data.filter(function (item) {
      unit.unitTypeAry.push(item.unitType)
    })
    unit.unitTypeAry = [...new Set(unit.unitTypeAry)]
  })
  const { unitTypeAry } = toRefs(unit)
  return {
    unitTypeAry
  }
}
export default defineComponent({
  name: 'search',
  props: ['addState', 'editState'],
  setup(props, ctx) {
    const form = reactive({
      pageNum: 1,
      pageSize: 10,
      unitName: '',
      unitType: null
    })
    const { unitTypeAry } = allSelectDataEffect()
    const handleForm = form => {
      ctx.emit('searchContent', form)
    }
    watch(
      () => props.addState,
      (nowval, oldval) => {
        console.log(nowval)
        if (nowval) {
          form.unitName = ''
          form.unitType = null
        }
      }
    )
    return {
      form,
      unitTypeAry,
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
