<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">{{ $t('message.common.add') }}</el-button>
        <el-button type="primary" icon="el-icon-upload" @click="handelUpload">访客导入</el-button>
        <el-button type="primary" icon="el-icon-download" @click="handelDownload">下载模板</el-button>
        <Search @searchContent="searchContent" :addState="addState" :editState="editState" />
      </div>
    </div>
    <div class="layout-container-table">
      <Table
        ref="table"
        v-model:page="page"
        v-loading="loading"
        :editState="editState"
        :addState="addState"
        :showIndex="true"
        :showSelection="true"
        :data="tableData"
        :searchData="searchData"
        @ShowSearchData="ShowSearchData"
        @ShowNumData="ShowNumData"
      >
        <el-table-column prop="unit_name" label="单位名称" align="center" />
        <el-table-column prop="real_name" label="姓名" align="center" />
        <el-table-column prop="email" label="邮箱" align="center" />
        <el-table-column prop="telphone" label="电话" align="center" />
        <el-table-column prop="start_time" label="来访时间" align="center" :formatter="changeStartTime" />
        <el-table-column prop="end_time" label="截止时间" align="center" :formatter="changeEndtTime" />
        <el-table-column prop="active" label="激活状态" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.active" active-color="#13ce66" inactive-color="#ff4949" :inactive-value="0" :active-value="1" @change="ChangSwith(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.common.handle')" align="center" width="160">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)">{{ $t('message.common.update') }}</el-button>
            <el-popconfirm :title="$t('message.common.delTip')" @confirm="handleDel([scope.row])">
              <template #reference>
                <el-button type="danger">{{ $t('message.common.del') }}</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </Table>
      <Layer :layer="layer" :searchData="searchData" @fromChangeData="fromChangeData" @getTableData="getTableData" v-if="layer.show" />
      <Upoad :layer="layer" v-if="layer.showUpaod" @UpaodChangeData="UpaodChangeData" />
      <Download :layer="layer" v-if="layer.showDownload" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { selectAllUser, updateUserIsActive, del } from '@/api/table'
import Layer from './layer.vue'
import Search from './search.vue'
import Table from '@/components/table/index.vue'
import Upoad from './upoad.vue'
import Download from './download.vue'
// 表格数据及分页
const useTabelEffect = (page, addState, editState, searchData) => {
  const loading = ref(true)
  const tableData = ref([])
  //获取表格数据
  const getTableData = (init, searchForm) => {
    loading.value = true
    if (init) {
      page.index = 1
    }
    let params = {
      pageNum: page.index,
      pageSize: page.size,
      realName: '',
      unitId: null,
      unitType: null,
      classGroupId: null,
      userTypeId: null
    }
    if (searchForm) {
      params.realName = searchForm.realName
      params.unitId = searchForm.unitId
      params.unitType = searchForm.unitType
    }
    console.log(params)
    selectAllUser(params)
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
    if (addState.value) {
      getTableData(true)
      return false
    }
    // 获取搜素参数
    const searchValue = {
      realName: searchData.realName || '',
      unitId: searchData.unitId || null,
      clssGroupId: searchData.clssGroupId || null,
      userTypeId: searchData.userTypeId || null
    }
    if (addState.value || editState.value) {
      ;(searchValue.realName = ''), (searchValue.unitId = null), (searchValue.clssGroupId = null), (searchValue.userTypeId = null)
    }
    getTableData(true, searchValue)
  }
  const fromChangeData = flag => {
    addState.value = true
    editState.value = true
    getTableData(true)
  }
  return {
    loading,
    tableData,
    getTableData,
    ShowNumData,
    fromChangeData
  }
}
// 编辑/新增模态框
const useDialogEffect = layer => {
  // 新增弹窗功能
  const handleAdd = () => {
    layer.title = '新增数据'
    layer.show = true
    delete layer.row
  }
  // 编辑弹窗功能
  const handleEdit = row => {
    layer.title = '编辑数据'
    layer.row = row
    layer.show = true
  }
  return {
    handleAdd,
    handleEdit
  }
}
// 删除功能
const useDeleEffect = (searchData, getTableData) => {
  // 删除用户或者访客
  const handleDel = data => {
    let params = {
      id: data
        .map(e => {
          return e.id
        })
        .join(','),
      userType: data
        .map(e => {
          return e.user_type_name
        })
        .join(',')
    }
    del(params).then(res => {
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      getTableData(false, searchData)
    })
  }
  return {
    handleDel
  }
}
// Swith激活状态
const useSwithEffect = () => {
  // 用户激活状态
  const ChangSwith = scopeRow => {
    const changAvtive = {
      id: null,
      active: null
    }
    changAvtive.id = scopeRow.id
    changAvtive.active = scopeRow.active
    updateUserIsActive(changAvtive)
  }
  return {
    ChangSwith
  }
}
// 导出和导入
const useEXcelEffect = (layer, getTableData) => {
  // 批量导入功能
  const handelUpload = () => {
    layer.title = '批量导入'
    layer.showUpaod = true
  }
  // 下载空白导入模板功能
  const handelDownload = () => {
    layer.title = '下载模板'
    layer.showDownload = true
  }
  // 导入刷新
  const UpaodChangeData = () => {
    getTableData(true)
  }
  return {
    handelUpload,
    handelDownload,
    UpaodChangeData
  }
}
// 查询功能
const useSearchEffect = (addState, editState, searchData, getTableData) => {
  // 查询功能
  const searchContent = searchForm => {
    Object.assign(searchData, searchForm)
    addState.value = false
    editState.value = false
    getTableData(true, searchForm)
  }
  const ShowSearchData = params => {
    getTableData(false, params)
  }
  return {
    searchContent,
    ShowSearchData
  }
}
// 对时间的操作
const useTimeEffect = () => {
  // 对时间处理
  const changeStartTime = (row, column) => {
    return row.start_time ? row.start_time.replace('T', ' ').replace('000+00:00', '') : ''
  }
  const changeEndtTime = row => {
    return row.end_time ? row.end_time.replace('T', ' ').replace('000+00:00', '') : ''
  }
  return {
    changeStartTime,
    changeEndtTime
  }
}
export default defineComponent({
  components: {
    Table,
    Layer,
    Search,
    Upoad,
    Download
  },
  setup(props, ctx) {
    // 新增状态
    const addState = ref(false)
    // 编辑状态
    const editState = ref(false)
    // 存储搜索用的数据
    let searchData = reactive({})
    // 弹窗控制器
    const layer = reactive({
      show: false,
      title: '新增',
      showButton: true,
      userFlag: true,
      showUpaod: false,
      showDownload: false
    })
    // 分页参数, 供table使用
    const page = reactive({
      index: 1,
      size: 10,
      total: 0
    })
    const { loading, tableData, getTableData, ShowNumData, fromChangeData } = useTabelEffect(page, addState, editState, searchData)
    const { handleAdd, handleEdit } = useDialogEffect(layer)
    const { handleDel } = useDeleEffect(searchData, getTableData)
    const { ChangSwith } = useSwithEffect()
    const { searchContent, ShowSearchData } = useSearchEffect(addState, editState, searchData, getTableData)
    const { handelUpload, handelDownload, UpaodChangeData } = useEXcelEffect(layer, getTableData)
    const { changeStartTime, changeEndtTime } = useTimeEffect()
    getTableData(true)
    return {
      editState,
      addState,
      tableData,
      loading,
      page,
      layer,
      searchData,
      changeStartTime,
      changeEndtTime,
      handleDel,
      ChangSwith,
      handleAdd,
      handleEdit,
      getTableData,
      ShowSearchData,
      searchContent,
      handelUpload,
      handelDownload,
      UpaodChangeData,
      ShowNumData,
      fromChangeData
    }
  }
})
</script>

<style lang="scss" scoped>
.layout-container {
  width: calc(100% - 10px);
  height: 100%;
  margin: 0 0 0 10px;
}
</style>
