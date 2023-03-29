<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">{{ $t('message.common.add') }}</el-button>
        <el-button type="primary" icon="el-icon-upload" @click="handelDownload">{{ $t('message.common.batchExport') }}</el-button>
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
        @ShowNumData="ShowNumData"
        @ShowSearchData="ShowSearchData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="name" label="课题组" align="center" />
        <el-table-column prop="unit_name" label="单位名称" align="center" />
        <el-table-column prop="unit_type" label="单位类型" align="center" />
        <el-table-column prop="described" label="课题组描述" align="center" />
        <el-table-column :label="$t('message.common.handle')" align="center" width="160">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)">{{ $t('message.common.update') }}</el-button>
            <el-button type="danger" @click="handelDele([scope.row])">{{ $t('message.common.del') }}</el-button>
            <el-dialog v-model="dialogVisible" title="提示" width="30%" :before-close="handleClose" :modal="true">
              <i class="el-icon-warning-outline" style="font-size: 20px; color: red; margin-right: 10px"></i>
              <span>删除前请确保该课题组下无用户</span>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="dialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="handelSuccess()" :disabled="isDisabled">{{ num }}</el-button>
                </span>
              </template>
            </el-dialog>
          </template>
        </el-table-column>
      </Table>
      <Layer :layer="layer" @getTableData="getTableData" @fromChangeData="fromChangeData" v-if="layer.show" />
      <Download :layer="layer" v-if="layer.showDownload">
        <span>是否下载课题组信息表?</span>
      </Download>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import Table from '@/components/table/index.vue'
import { queryClassGroupByCdt } from '@/api/user'
import { deleteClassGroupById } from '@/api/table'
import Layer from './layer.vue'
import Search from './search.vue'
import Download from './download.vue'
import { ElMessage } from 'element-plus'
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
      unitId: null,
      classGroupName: ''
    }
    if (searchForm) {
      params.unitId = searchForm.unitId
      params.classGroupName = searchForm.classGroupName
    }
    console.log(params)
    queryClassGroupByCdt(params)
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
      unitId: searchData.unitId || null,
      classGroupName: searchData.classGroupName || ''
    }
    if (addState.value || editState.value) {
      searchValue.unitId = null
      searchValue.classGroupName = ''
    }
    getTableData(true, searchValue)
  }
  const chooseData = ref([])
  const handleSelectionChange = val => {
    chooseData.value = val
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
    chooseData,
    getTableData,
    ShowNumData,
    fromChangeData,
    handleSelectionChange
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
    layer.title = '修改信息'
    layer.row = row
    layer.show = true
  }
  return {
    handleAdd,
    handleEdit
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
// 删除功能
const useDeleEffect = getTableData => {
  // 删除功能
  const isDisabled = ref(true)
  const num = ref(6)
  const dialogVisible = ref(false)
  const uid = ref('')
  // 点击删除按钮
  const handelDele = row => {
    uid.value = row
      .map(e => {
        return e.id
      })
      .join(',')
    num.value = 6
    isDisabled.value = true
    dialogVisible.value = true
    sendCode()
  }
  // 定时器
  var timer
  // 倒数函数
  const sendCode = () => {
    if (dialogVisible.value) {
      clearInterval(timer)
      timer = setInterval(() => {
        if (num.value == 0) {
          num.value = '确认'
          isDisabled.value = false
          clearInterval(timer)
        } else {
          num.value--
        }
      }, 1000)
    } else {
      clearInterval(timer)
      isDisabled.value = true
    }
  }
  // 关闭右上角按钮
  const handleClose = done => {
    dialogVisible.value = false
    sendCode()
  }
  // 点击确认按钮
  const handelSuccess = () => {
    deleteClassGroupById(uid.value)
      .then(res => {
        dialogVisible.value = false
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        getTableData(true)
      })
      .catch(err => {
        console.log(err)
      })
  }
  return {
    num,
    isDisabled,
    dialogVisible,
    handleClose,
    handelSuccess,
    handelDele
  }
}
// 模态框
const useDialogDownloadEffect = layer => {
  const handelDownload = () => {
    layer.title = '批量导出'
    layer.showDownload = true
  }
  return {
    handelDownload
  }
}
export default defineComponent({
  name: 'userManagement',
  components: {
    Table,
    Layer,
    Search,
    Download
  },
  setup() {
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
    const { loading, tableData, chooseData, getTableData, ShowNumData, fromChangeData, handleSelectionChange } = useTabelEffect(page, addState, editState, searchData)
    const { handleAdd, handleEdit } = useDialogEffect(layer)
    const { searchContent, ShowSearchData } = useSearchEffect(page, addState, editState, searchData, getTableData)
    const { num, isDisabled, dialogVisible, handleClose, handelSuccess, handelDele } = useDeleEffect(getTableData)
    const { handelDownload } = useDialogDownloadEffect(layer)
    getTableData(true)
    return {
      num,
      addState,
      editState,
      isDisabled,
      dialogVisible,
      tableData,
      loading,
      page,
      layer,
      searchData,
      chooseData,
      handelDele,
      handleClose,
      handelSuccess,
      getTableData,
      searchContent,
      ShowSearchData,
      handleAdd,
      handleEdit,
      ShowNumData,
      handelDownload,
      fromChangeData,
      handleSelectionChange
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep .el-overlay{
  background-color: rgba(0, 0, 0, 0.2);
}
.layout-container-form-handle {

  .el-button {
    margin-right: 10px;
  }
}
.el-dialog {
  span {
    font-size: 20px;
  }
}
</style>
