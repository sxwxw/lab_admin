<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">{{ $t('message.common.add') }}</el-button>
        <Search @searchContent="searchContent" :addState="addState" :editState="editState" />
      </div>
    </div>
    <div class="layout-container-table">
      <Table ref="table" v-model:page="page" :editState="editState" :addState="addState" v-loading="loading" :showIndex="true" :showSelection="true" :data="tableData">
        <el-table-column prop="name" label="单位名称" align="center" />
        <el-table-column prop="unitType" label="单位类型" align="center" />
        <el-table-column :label="$t('message.common.handle')" align="center" width="160">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)">{{ $t('message.common.update') }}</el-button>
            <!-- <el-popconfirm :title="$t('message.common.delTip')" @confirm="handleDel([scope.row])">
              <template #reference>
                <el-button type="danger">{{ $t('message.common.del') }}</el-button>
              </template>
            </el-popconfirm> -->
            <el-button type="danger" @click="handelDele([scope.row])">{{ $t('message.common.del') }}</el-button>
            <el-dialog v-model="dialogVisible" title="提示" width="30%" :before-close="handleClose" :modal="true">
              <i class="el-icon-warning-outline" style="font-size: 20px; color: red; margin-right: 10px"></i>
              <span>点击删除前请确认该单位下无课题组与其他用户</span>
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
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, inject } from 'vue'
import { getAllUnitByCdt, deleteUnitById } from '@/api/table'
import { ElMessage } from 'element-plus'
import Table from '@/components/table/index.vue'
import Layer from './layer.vue'
import Search from './search.vue'
// 表格数据
const useTabelEffect = (page, addState, editState, searchData) => {
  const loading = ref(true)
  const tableData = ref([])
  // 获取数据
  const getTableData = (init, searchForm) => {
    loading.value = true
    if (init) {
      page.index = 1
    }
    let params = {
      pageNum: page.index,
      pageSize: page.size,
      unitName: '',
      unitType: null
    }
    if (searchForm) {
      params.unitName = searchForm.unitName
      params.unitType = searchForm.unitType
    }
    getAllUnitByCdt(params)
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
      unitName: searchData.unitName || '',
      unitType: searchData.unitType || null
    }
    if (addState.value || editState.value) {
      searchValue.unitName = ''
      searchValue.unitType = null
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
// 弹窗功能
const useLayerEffect = () => {
  // 弹窗控制器
  const layer = reactive({
    show: false,
    title: '新增',
    showButton: true
  })
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
    layer,
    handleAdd,
    handleEdit
  }
}
// 删除功能
const useDeleEffect = getTableData => {
  // 删除功能
  const isDisabled = ref(true)
  const num = ref(6)
  const dialogVisible = ref(false)
  const params = ref('')
  // 删除单位
  const handelDele = data => {
    params.value = data
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
    deleteUnitById(params.value)
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
export default defineComponent({
  components: {
    Table,
    Layer,
    Search
  },
  setup(props, ctx) {
    // 新增状态
    const addState = ref(false)
    // 编辑状态
    const editState = ref(false)
    // 分页参数, 供table使用
    const page = reactive({
      index: 1,
      size: 10,
      total: 0
    })
    // 存储搜索用的数据
    const searchData = reactive({})
    const { loading, tableData, getTableData, ShowNumData, fromChangeData } = useTabelEffect(page, addState, editState, searchData)
    const { searchContent, ShowSearchData } = useSearchEffect(page, addState, editState, searchData, getTableData)
    const { layer, handleAdd, handleEdit } = useLayerEffect()
    const { num, isDisabled, dialogVisible, handleClose, handelSuccess, handelDele } = useDeleEffect(getTableData)
    getTableData(true)
    return {
      addState,
      editState,
      num,
      isDisabled,
      dialogVisible,
      tableData,
      loading,
      page,
      layer,
      ShowSearchData,
      ShowNumData,
      searchContent,
      handleAdd,
      handleEdit,
      getTableData,
      handelDele,
      handleClose,
      handelSuccess,
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
  .layout-container-form-handle {
    .el-button {
      margin-right: 20px;
    }
  }
  .el-dialog {
    span {
      font-size: 20px;
    }
  }
}
</style>
