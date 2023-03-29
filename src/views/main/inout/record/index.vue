<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <!-- <el-button type="primary" icon="el-icon-upload" @click="handelDownload">{{ $t('message.common.batchExport') }}</el-button> -->
      </div>
      <div class="layout-container-form-search">
        <Search @searchContent="searchContent" @DownloadExecl="DownloadExecl" />
      </div>
    </div>
    <div class="layout-container-table">
      <Table
        ref="table"
        v-model:page="page"
        v-loading="loading"
        :showIndex="true"
        :showSelection="true"
        :data="tableData"
        :searchData="searchData"
        @ShowSearchData="ShowSearchData"
        @getTableData="getTableData"
        @ShowNumData="ShowNumData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="name" label="姓名" align="center" width="100" />
        <el-table-column prop="class_group" label="课题组" align="center" width="110" />
        <el-table-column prop="date_time" label="日期" align="center" width="100" />
        <el-table-column prop="in_time" label="进入时间" align="center" :formatter="changeStartTime" />
        <el-table-column prop="out_time" label="离开时间" align="center" :formatter="changeEndtTime" />
        <el-table-column prop="stay_time" label="时长" align="center" width="50" />
        <el-table-column prop="unit" label="单位" align="center" />
        <el-table-column prop="user_type" label="用户类型" align="center" />
        <el-table-column prop="unit_type" label="单位类型" align="center" />
        <el-table-column prop="todo" label="事由" align="center" />
        <el-table-column prop="comment" label="备注" align="center" />
      </Table>
      <Download :layer="layer" v-if="layer.showDownload" :searchData="searchData" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import Table from '@/components/table/index.vue'
import Search from './search.vue'
import Download from './download.vue'
import { querySignLogByCdt, exportSignLog } from '@/api/table'
import drag from '@/directive/drag/index'
import { formatDates } from '@/utils/system/formatDate'
// 表格数据及分页
const useTabelEffect = (page, searchData) => {
  const loading = ref(true)
  const tableData = ref([])
  //获取表格数据
  const getTableData = (init, searchForm) => {
    loading.value = true
    if (init) {
      page.index = 1
    }
    // const dates = new Date()
    let params = {
      pageNum: page.index,
      pageSize: page.size,
      userName: '',
      unitType: null,
      unit: null,
      userTypeId: null,
      classGroupName: null,
      stayTime: 0,
      dateValue: null,
      endTime: null,
      startTime: null
    }
    if (searchForm) {
      params.userName = searchForm.userName
      params.unitType = searchForm.unitType
      params.unit = searchForm.unit
      params.userTypeId = searchForm.userTypeId
      params.classGroupName = searchForm.classGroupName
      params.stayTime = searchForm.stayTime
      params.endTime = searchForm.endTime
      params.startTime = searchForm.startTime
    }
    delete params.dateValue
    console.log(params)
    querySignLogByCdt(params)
      .then(res => {
        tableData.value = res.data.records
        page.total = Number(res.data.total)
      })
      .catch(error => {
        tableData.value = []
        page.index = 1
        page.total = 0
      })
      .finally(() => {
        loading.value = false
      })
  }

  // 点击tabel分条栏
  const ShowNumData = val => {
    // 强制定义page参数
    page.index = 1
    page.size = val
    // 获取搜素参数
    const searchValue = {
      userName: searchData.userName || '',
      unitType: searchData.unitType || null,
      unit: searchData.unit || null,
      userTypeId: searchData.userTypeId || null,
      classGroupName: searchData.classGroupName || null,
      stayTime: searchData.stayTime || 0,
      dateValue: searchData.dateValue || null,
      endTime: searchData.endTime || null,
      startTime: searchData.startTime || null
    }
    getTableData(true, searchValue)
  }
  const chooseData = ref([])
  const handleSelectionChange = val => {
    chooseData.value = val
  }
  return {
    chooseData,
    loading,
    tableData,
    getTableData,
    ShowNumData,
    handleSelectionChange
  }
}
// 查询功能
const useSearchEffect = (searchData, getTableData) => {
  // 查询功能
  const searchContent = searchForm => {
    console.log(searchForm)
    Object.assign(searchData, searchForm)
    getTableData(true, searchForm)
  }
  // 用于查询后数据分页展示
  const ShowSearchData = pageSearch => {
    getTableData(false, pageSearch)
  }
  return {
    searchContent,
    ShowSearchData
  }
}
// 对时间的操作
const useTimeEffect = () => {
  const changeStartTime = (row, column) => {
    return formatDates(row.in_time, 'hh:mm:ss')
  }
  const changeEndtTime = row => {
    return formatDates(row.out_time, 'hh:mm:ss')
  }
  return {
    changeStartTime,
    changeEndtTime
  }
}
// 模态框
const useDialogEffect = layer => {
  const DownloadExecl = () => {
    layer.title = '下载模板'
    layer.showDownload = true
  }
  const changeDownload = () => {
    layer.showDownload = false
  }
  return {
    DownloadExecl,
    changeDownload
  }
}
export default defineComponent({
  name: 'userManagement',
  components: {
    Table,
    Search,
    Download
  },
  directives: {
    drag
  },
  setup() {
    // 分页参数, 供table使用
    const page = reactive({
      index: 1,
      size: 10,
      total: 0
    })
    // 获取查询参数
    const searchData = reactive({
      stayTime: '',
      endTime: ''
    })
    // 弹窗控制器
    const layer = reactive({
      show: false,
      title: '新增',
      showButton: true,
      showDownload: false
    })
    const { chooseData, loading, tableData, getTableData, ShowNumData, handleSelectionChange } = useTabelEffect(page, searchData)
    const { searchContent, ShowSearchData } = useSearchEffect(searchData, getTableData)
    const { DownloadExecl, changeDownload } = useDialogEffect(layer)
    const { changeStartTime, changeEndtTime } = useTimeEffect()
    getTableData(true)
    return {
      tableData,
      chooseData,
      loading,
      page,
      layer,
      searchData,
      getTableData,
      changeStartTime,
      changeEndtTime,
      ShowSearchData,
      searchContent,
      DownloadExecl,
      changeDownload,
      ShowNumData,
      handleSelectionChange
    }
  }
})
</script>

<style lang="scss" scoped>
.layout-container-form {
  position: relative;
}
.layout-container-form-search {
  width: 100%;
  margin: 0;
}
.layout-container-form-handle {
  margin-left: 2.5rem;
  margin-bottom: 1rem;
}
</style>
