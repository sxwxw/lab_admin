<template>
  <div>
    <el-form :model="form" class="search_form">
      <el-form-item label="姓名">
        <el-input v-model="form.realName"></el-input>
      </el-form-item>
      <el-form-item label="单位名称">
        <el-select v-model="form.unitId" @change="changeClassGroup">
          <el-option v-for="(item, index) in unitNameAry" :label="item" :key="index" :value="index + 1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位类型">
        <el-select v-model="form.unitType">
          <el-option v-for="(item, index) in unitTypeAry" :label="item" :key="index" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课题组">
        <el-select v-model="form.classGroupId">
          <el-option v-for="(item, index) in classGroupAry" :label="item" :key="index" :value="index + 1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-select v-model="form.userTypeId">
          <el-option v-for="(item, index) in userTypeAry" :label="item" :key="index" :value="index + 1"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" class="search-btn" @click="handleForm(form)">{{ $t('message.common.query') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import { toRefs } from '@vueuse/core'
import { defineComponent, reactive, ref, watch } from 'vue'
import { getAallUnit, getAallUserType, getAallClass } from '@/api/user'
// 获取数据
const useallSelectDataEffect = () => {
  const form = reactive({
    pageNum: 1,
    pageSize: 10,
    realName: '',
    unitType: null,
    unitId: null,
    userTypeId: null,
    classGroupId: null
  })
  const allDataAry = reactive({
    unitNameAry: [],
    unitTypeAry: [],
    classGroupAry: [],
    userTypeAry: []
  })
  // 获取单位和单位类型
  getAallUnit().then(res => {
    const data = res.data
    data.filter(function (item) {
      allDataAry.unitNameAry.push(item.name)
      allDataAry.unitTypeAry.push(item.unitType)
    })
    allDataAry.unitTypeAry = [...new Set(allDataAry.unitTypeAry)]
  })
  // 获取用户类型
  getAallUserType().then(res => {
    const dataType = res.data
    dataType.filter(function (item) {
      allDataAry.userTypeAry.push(item.name)
    })
  })
  const changeClassGroup = e => {
    allDataAry.classGroupAry = []
    getAallClass(e).then(res => {
      res.data.filter(function (item) {
        allDataAry.classGroupAry.push(item.name)
      })
    })
    form.classGroupId = ''
  }
  const { unitNameAry, unitTypeAry, classGroupAry, userTypeAry } = toRefs(allDataAry)
  return { form, unitNameAry, unitTypeAry, classGroupAry, userTypeAry, changeClassGroup }
}
export default defineComponent({
  name: 'search',
  props: ['addState', 'editState'],
  setup(props, ctx) {
    const { form, unitNameAry, unitTypeAry, classGroupAry, userTypeAry, changeClassGroup } = useallSelectDataEffect()
    const handleForm = form => {
      ctx.emit('searchContent', form)
    }
    watch(
      () => props.addState,
      (nowval, oldval) => {
        if (nowval) {
          form.realName = ''
          form.unitType = null
          form.unitId = null
          form.userTypeId = null
          form.classGroupId = null
        }
      }
    )
    return {
      form,
      unitNameAry,
      unitTypeAry,
      classGroupAry,
      userTypeAry,
      changeClassGroup,
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
