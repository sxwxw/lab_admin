<template>
  <div>
    <el-form :model="form" class="search_form">
      <el-form-item label="单位类型">
        <el-select v-model="form.unitType" @change="changUnitType">
          <el-option v-for="(item, index) in unitType" :label="item" :key="index" :value="index + 1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位名称">
        <el-select v-model="form.unitId">
          <el-option v-for="item in unitName" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课题组">
        <el-input v-model="form.classGroupName"></el-input>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" class="search-btn" @click="handleForm(form)">{{ $t('message.common.query') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import { toRefs } from '@vueuse/core'
import { defineComponent, reactive, ref, watch } from 'vue'
import { getAallUnit, getAallClass, getAllUnitByType } from '@/api/user'
// 获取选择框数据
const allSelectDataEffect = () => {
  const unit = reactive({
    unitName: {},
    classGroup: {},
    unitType: []
  })
  // 获取单位类型
  getAallUnit().then(res => {
    const data = res.data
    unit.unitName = res.data
    data.filter(function (item) {
      unit.unitType.push(item.unitType)
    })
    unit.unitType = [...new Set(unit.unitType)]
  })
  // 不同单位类型下的单位
  const changUnitType = e => {
    let params = {
      unitTypeName: e === 1 ? '院内' : '院外'
    }
    getAllUnitByType(params)
      .then(res => {
        unit.unitName = res.data
      })
      .catch(err => {
        console.log(err)
      })
  }
  const { unitName, classGroup, unitType } = toRefs(unit)
  return { unitName, classGroup, unitType, changUnitType }
}
export default defineComponent({
  name: 'search',
  props: ['addState', 'editState'],
  setup(props, ctx) {
    let form = reactive({
      pageNum: 1,
      pageSize: 10,
      unitId: null,
      unitType: null,
      described: '',
      classGroupName: ''
    })
    const { unitName, classGroup, unitType, changUnitType } = allSelectDataEffect()
    const handleForm = form => {
      ctx.emit('searchContent', form)
    }
    watch(
      () => props.addState,
      (nowval, oldval) => {
        console.log(nowval)
        if (nowval) {
          form.unitId = null
          form.unitType = null
          form.described = ''
          form.classGroupName = ''
        }
      }
    )
    return {
      form,
      unitName,
      classGroup,
      unitType,
      changUnitType,
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
