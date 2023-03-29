<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-search">
        <Search @searchContent="searchContent" :creamflag="creamflag" />
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
        :creamflag="creamflag"
        @ShowNumData="ShowNumData"
        @ShowSearchData="ShowSearchData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="real_name" label="姓名" align="center" />
        <el-table-column prop="unit_name" label="单位名称" align="center" />
        <el-table-column prop="user_type_name" label="用户类型" align="center" />
        <el-table-column prop="face_status" label="是否录入人脸" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.face_status === '已录入' ? 'success' : 'danger'">{{ scope.row.face_status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="unit_type" label="单位类型" align="center" />
        <el-table-column prop="class_group_name" label="课题组" align="center" />

        <el-table-column :label="$t('message.common.handle')" align="center" width="160">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)">{{ $t('message.common.Input') }}</el-button>
            <el-popconfirm :title="$t('message.common.delTip')" @confirm="handleDel([scope.row])">
              <template #reference>
                <el-button type="danger" v-loading.fullscreen.lock="fullscreenLoading">{{ $t('message.common.del') }}</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </Table>
      <Cream :layer="layer" @getTableData="getTableData" @creamSuccess="creamSuccess" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, watch } from 'vue'
import Table from '@/components/table/index.vue'
import { selectAllUser, del } from '@/api/table'
import { deleteUserFace } from '@/api/user'
import Search from './search.vue'
import Cream from './cream.vue'
import { ElMessage } from 'element-plus'

// 表格数据及分页
const useTabelEffect = (page, searchData, creamflag) => {
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
      userTypeId: -1,
      classGroupId: null
    }
    if (searchForm) {
      params.realName = searchForm.realName
      params.unitId = searchForm.unitId
      params.classGroupId = searchForm.classGroupId
    }
    selectAllUser(params)
      .then(res => {
        console.log(res)
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
      classGroupId: searchData.classGroupId || null
    }
    if (creamflag.value) {
      searchValue.realName = ''
      searchValue.unitId = null
    }
    console.log(searchValue)
    getTableData(true, searchValue)
  }
  return {
    loading,
    tableData,
    getTableData,
    ShowNumData
  }
}
// 编辑模态框
const useDialogEffect = (layer, creamflag) => {
  // 编辑弹窗功能
  const handleEdit = row => {
    layer.title = '人脸信息录入'
    layer.row = row
    layer.show = true
    creamflag.value = false
  }
  return {
    handleEdit
  }
}
// 删除功能
const useDeleEffect = (searchData, getTableData) => {
  // 删除人脸信息
  const fullscreenLoading = ref(false)
  const handleDel = data => {
    const id = data.map(e => {
      return e.id
    })
    let params = {
      id: Number(id.toString())
    }
    fullscreenLoading.value = true
    deleteUserFace(params)
      .then(res => {
        fullscreenLoading.value = false
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        getTableData(false, searchData)
      })
      .catch(err => {
        fullscreenLoading.value = false
        console.log(err)
      })
  }
  return {
    fullscreenLoading,
    handleDel
  }
}
// 查询功能
const useSearchEffect = (page, searchData, getTableData) => {
  // 查询功能
  const searchContent = searchForm => {
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
export default defineComponent({
  name: 'userManagement',
  components: {
    Table,
    Search,
    Cream
  },
  setup() {
    // 录入状态
    const creamflag = ref(false)
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
    const chooseData = ref([])
    const handleSelectionChange = val => {
      chooseData.value = val
    }
    const { loading, tableData, getTableData, ShowNumData } = useTabelEffect(page, searchData, creamflag)
    const { handleEdit } = useDialogEffect(layer, creamflag)
    const { fullscreenLoading, handleDel } = useDeleEffect(searchData, getTableData)
    const { searchContent, ShowSearchData } = useSearchEffect(page, searchData, getTableData)
    const creamSuccess = () => {
      creamflag.value = true
    }
    getTableData(true)
    return {
      creamflag,
      creamSuccess,
      tableData,
      chooseData,
      loading,
      page,
      layer,
      searchData,
      fullscreenLoading,
      handleSelectionChange,
      handleEdit,
      handleDel,
      getTableData,
      searchContent,
      ShowSearchData,
      ShowNumData
    }
  }
})
</script>

<style lang="scss" scoped></style>
