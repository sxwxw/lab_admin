<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">{{ $t('message.common.add') }}</el-button>
        <el-button type="primary" icon="el-icon-upload" @click="handelUpaod">{{ $t('message.common.batchImport') }}</el-button>
        <el-button type="primary" icon="el-icon-download" @click="handelDownload">{{ $t('message.common.downloadTemplate') }}</el-button>
      </div>
      <div class="layout-container-form-search">
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
        @selection-change="handleSelectionChange"
        @ShowNumData="ShowNumData"
      >
        <el-table-column prop="real_name" label="姓名" align="center" />
        <el-table-column prop="email" label="邮箱" align="center" />
        <el-table-column prop="telphone" label="电话" align="center" />
        <el-table-column prop="unit_name" label="单位名称" align="center" />
        <el-table-column prop="user_type_name" label="用户类型" align="center" />

        <el-table-column prop="unit_type" label="单位类型" align="center" />
        <el-table-column prop="active" label="激活状态" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.active" active-color="#13ce66" inactive-color="#ff4949" :inactive-value="0" :active-value="1" @change="ChangSwith(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="start_time" label="起始时间" align="center" v-if="false" />
        <el-table-column prop="class_group_name" label="课题组" align="center" />
        <el-table-column prop="face_status" label="是否录入人脸" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.face_status === '已录入' ? 'success' : 'danger'">{{ scope.row.face_status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="touch_status" label="是否录入指纹" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.touch_status === '已录入' ? 'success' : 'danger'">{{ scope.row.touch_status }}</el-tag>
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
      <Upaod :layer="layer" v-if="layer.showUpaod" @UpaodChangeData="UpaodChangeData" />
      <Download :layer="layer" v-if="layer.showDownload" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { selectAllUser, del, updateUserIsActive } from '@/api/table'
import { ElMessage } from 'element-plus'
import Layer from './layer.vue'
import Upaod from './upaod.vue'
import Download from './download.vue'
import Search from './search.vue'
import Table from '@/components/table/index.vue'
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
    // 定义接口参数
    let params = {
      pageNum: page.index,
      pageSize: page.size,
      realName: '',
      unitId: null,
      unitType: null,
      userTypeId: null
    }
    // 如果已经查询过信息，将保留信息（分栏，分页）
    if (searchForm) {
      params.realName = searchForm.realName
      params.unitId = searchForm.unitId
      params.unitType = searchForm.unitType
      params.userTypeId = searchForm.userTypeId
    }
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
    // 获取搜素参数
    const searchValue = {
      realName: searchData.realName || '',
      unitId: searchData.unitId || null,
      unitType: searchData.unitType || null,
      userTypeId: searchData.userTypeId || null
    }
    if (addState.value || editState.value) {
      searchValue.realName = ''
      searchValue.unitId = null
      searchValue.unitType = null
      searchValue.userTypeId = null
    }
    getTableData(true, searchValue)
  }
  // 新增后改变新增状态
  const fromChangeData = params => {
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
    layer.userFlag = true
    layer.userType = true
    delete layer.row
  }
  // 编辑弹窗功能
  const handleEdit = row => {
    layer.title = row.user_type_name === '访客' ? '修改访客信息' : '修改用户信息'
    layer.row = row
    layer.show = true
    layer.userFlag = row.user_type_name === '访客' ? false : true
    layer.userType = false
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
  const handelUpaod = () => {
    layer.title = '批量导入'
    layer.showUpaod = true
  }
  // 下载空白导入模板功能
  const handelDownload = () => {
    layer.title = '下载模板'
    layer.showDownload = true
  }
  const UpaodChangeData = () => {
    getTableData(true)
  }
  return {
    handelUpaod,
    handelDownload,
    UpaodChangeData
  }
}
// 查询功能
const useSearchEffect = (page, addState, editState, searchData, getTableData) => {
  // 查询功能
  const searchContent = searchForm => {
    searchForm.pageSize = page.size
    Object.assign(searchData, searchForm)
    addState.value = false
    editState.value = false
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
export default defineComponent({
  name: 'userManagement',
  components: {
    Table,
    Layer,
    Search,
    Upaod,
    Download
  },
  setup() {
    // 新增状态
    const addState = ref(false)
    // 编辑状态
    const editState = ref(false)
    const chooseData = ref([])
    // 存储搜索用的数据
    const searchData = reactive({})
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
    const { searchContent, ShowSearchData } = useSearchEffect(page, addState, editState, searchData, getTableData)
    const { handelUpaod, handelDownload, UpaodChangeData } = useEXcelEffect(layer, getTableData)
    const handleSelectionChange = val => {
      chooseData.value = val
    }
    getTableData(true)
    return {
      addState,
      editState,
      tableData,
      chooseData,
      loading,
      page,
      layer,
      searchData,
      handleAdd,
      handleDel,
      handleEdit,
      ChangSwith,
      handelUpaod,
      ShowNumData,
      getTableData,
      searchContent,
      handelDownload,
      ShowSearchData,
      UpaodChangeData,
      fromChangeData,
      handleSelectionChange
    }
  }
})
</script>

<style lang="scss" scoped></style>
