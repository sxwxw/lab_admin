<template>
  <el-form :model="form" class="search_form">
    <div class="topSearch">
      <el-form-item label="日期">
        <el-date-picker v-model="dateValue" type="daterange" range-separator="To" start-placeholder="Start date" end-placeholder="End date" value-format="YYYY-MM-DD"></el-date-picker>
      </el-form-item>
      <el-form-item label="时长">
        <el-select v-model="form.stayTime" placeholder="选择时长">
          <el-option v-for="(item, index) in timeOptions" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-select v-model="form.userType">
          <el-option v-for="(item, index) in userTypeAry" :label="item.name" :key="index" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
    </div>

    <div class="bottomSearch">
      <el-form-item label="事由">
        <el-select v-model="form.todoSelect" multiple placeholder="请选择">
          <el-option v-for="item in todoListAry" :label="item.name" :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位名称">
        <el-select v-model="form.unit" @change="changeClassGroup">
          <el-option v-for="item in unitNameAry" :label="item.name" :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位类型">
        <el-select v-model="form.unitType">
          <el-option v-for="(item, index) in unitTypeAry" :label="item" :key="index" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课题组">
        <el-select v-model="form.classGroupName" placeholder="请先选择单位">
          <el-option v-for="item in classGroupAry" :label="item.name" :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" class="search-btn" @click="handelForm(form, dateValue)">{{ $t('message.common.query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-download" class="search-btn" @click="hanlerdownload">导出</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
import { toRefs, onBeforeMount } from 'vue'
import { defineComponent, reactive, ref } from 'vue'
import { getAallUnit, getAallUserType, getAallClass } from '@/api/user'
import { getAllTodo } from '@/api/table'
// 获取选择框数据
const useSelectDataEffect = form => {
  const allSelect = reactive({
    unitNameAry: [],
    unitTypeAry: [],
    classGroupAry: [],
    userTypeAry: [],
    todoListAry: []
  })
  // 获取单位和单位类型
  getAallUnit().then(res => {
    const data = res.data
    data.filter(function (item) {
      allSelect.unitNameAry.push(item)
      allSelect.unitTypeAry.push(item.unitType)
    })
    allSelect.unitTypeAry = [...new Set(allSelect.unitTypeAry)]
  })
  // 获取用户类型
  getAallUserType().then(res => {
    const dataType = res.data
    dataType.filter(function (item) {
      allSelect.userTypeAry.push(item)
    })
  })
  const changeClassGroup = e => {
    const unitId = ref(null)
    allSelect.classGroupAry = []
    allSelect.unitNameAry.forEach(item => {
      if (item.name === e) {
        return (unitId.value = item.id)
      }
    })
    getAallClass(unitId.value).then(res => {
      res.data.filter(function (item) {
        allSelect.classGroupAry.push(item)
      })
    })
    form.classGroupId = ''
  }
  // 获取事由
  let params = {
    pageNo: 1,
    pageSize: 10000,
    search: ''
  }
  getAllTodo(params).then(res => {
    allSelect.todoListAry = res.data.records
    // console.log(allSelect.todoListAry)
  })
  const { unitTypeAry, unitNameAry, classGroupAry, todoListAry, userTypeAry } = toRefs(allSelect)
  return { unitTypeAry, unitNameAry, classGroupAry, todoListAry, userTypeAry, changeClassGroup }
}
export default defineComponent({
  name: 'search',
  setup(props, ctx) {
    console.log('h')
    const timeOptions = ref([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4])
    const dateValue = ref(['2021-11-01', '2021-12-03'])
    const form = reactive({
      pageNum: 1,
      pageSize: 10,
      userName: '',
      unitType: '',
      unit: '',
      userTypeId: '',
      classGroupName: '',
      stayTime: 0,
      userType: '',
      todoSelect: [],
      startTime: '',
      endTime: ''
    })
    onBeforeMount(() => {
      const buling = n => {
        return n > 9 ? n : '0' + n
      }
      const date = new Date()
      const times = []
      let y = date.getFullYear()
      let m = buling(date.getMonth() + 1)
      let d = buling(date.getDate())
      times[0] = y + '-' + m + '-' + d
      date.setTime(date.getTime() + 86400000)
      y = date.getFullYear()
      m = buling(date.getMonth() + 1)
      d = buling(date.getDate())
      times[1] = y + '-' + m + '-' + d
      dateValue.value = times
      form.startTime = times[0]
      form.endTime = times[1]
      ctx.emit('searchContent', form)
    })
    const { unitTypeAry, unitNameAry, classGroupAry, todoListAry, userTypeAry, changeClassGroup } = useSelectDataEffect(form)
    const handelForm = (form, dateValue) => {
      form.startTime = dateValue[0]
      form.endTime = dateValue[1]
      ctx.emit('searchContent', form)
    }
    const hanlerdownload = () => {
      ctx.emit('DownloadExecl', form)
    }
    return {
      unitTypeAry,
      unitNameAry,
      classGroupAry,
      todoListAry,
      userTypeAry,
      changeClassGroup,
      hanlerdownload,
      form,
      timeOptions,
      dateValue,
      handelForm
    }
  }
})
</script>

<style lang="scss" scoped>
.el-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  .el-form-item {
    margin-right: 20px;
  }
  .topSearch {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .bottomSearch {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
