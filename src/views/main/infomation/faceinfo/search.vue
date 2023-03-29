<template>
  <div>
    <el-form :model="form" class="search_form">
      <el-form-item label="姓名">
        <el-input v-model="form.realName"></el-input>
      </el-form-item>
      <el-form-item label="单位名称">
        <el-select v-model="form.unitId" @change="changeClassGroup">
          <el-option v-for="item in unitName" :label="item.name" :key="item.id" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课题组">
        <el-select v-model="form.classGroupId">
          <el-option v-for="item in classGroup" :label="item.name" :key="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" class="search-btn" @click="handelFrom(form)">{{ $t('message.common.query') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import { toRefs } from '@vueuse/core'
import { defineComponent, reactive, ref, toRef, watch } from 'vue'
import { getAallUnit, getAallClass } from '@/api/user'
// 获取选择框数据
const useSelectDataEffect = form => {
  const unit = reactive({
    unitName: [],
    classGroup: []
  })
  // 获取单位
  getAallUnit().then(res => {
    const data = res.data
    data.filter(function (item) {
      unit.unitName.push(item)
    })
  })
  // 获取课题组
  const changeClassGroup = e => {
    unit.classGroup = []
    getAallClass(e).then(res => {
      res.data.filter(function (item) {
        unit.classGroup.push(item)
      })
    })
    form.classGroupId = ''
  }
  const { unitName, classGroup } = toRefs(unit)
  return {
    unitName,
    classGroup,
    changeClassGroup
  }
}
export default defineComponent({
  name: 'search',
  props: {
    creamflag: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const form = reactive({
      classGroupId: '',
      pageNum: 1,
      pageSize: 10,
      unitId: null,
      described: '',
      realName: ''
    })
    const { unitName, classGroup, changeClassGroup } = useSelectDataEffect(form)
    const handelFrom = form => {
      ctx.emit('searchContent', form)
    }
    watch(
      () => props.creamflag,
      (nowval, oldval) => {
        if (nowval) {
          form.unitId = null
          form.described = ''
          form.realName = ''
        }
      }
    )
    return {
      form,
      unitName,
      classGroup,
      handelFrom,
      changeClassGroup
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
