<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">{{ $t('message.common.add') }}</el-button>
        <el-form class="search_form">
          <el-form-item label="用户类型">
            <el-input v-model="quary.name"></el-input>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" class="search-btn" @click="searchPage(quary)">{{ $t('message.common.query') }}</el-button>
        </el-form>
      </div>
    </div>
    <div class="layout-container-table">
      <Table ref="table" v-model:page="page" v-loading="loading" :showIndex="true" :showSelection="true" :data="tableData">
        <el-table-column prop="name" label="用户类型" align="center" />
        <el-table-column :label="$t('message.common.handle')" align="center" width="160">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)">{{ $t('message.common.update') }}</el-button>
            <el-button type="danger" @click="handelDele([scope.row])">{{ $t('message.common.del') }}</el-button>
            <el-dialog v-model="dialogVisible" title="提示" width="30%" :before-close="handleClose" :modal="true">
              <i class="el-icon-warning-outline" style="font-size: 25px; color: red; margin-right: 10px"></i>
              <span>删除前请确保该用户类型下无用户</span>
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
import { defineComponent, ref, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAallUserType, getUserTypeByName, deleteUserTypeById } from '@/api/user'
import Table from '@/components/table/index.vue'
import Layer from './layer.vue'

// 表格
const useTabelEffect = cleanSearchForm => {
  const loading = ref(true)
  const tableData = ref([])
  // 分页参数, 供table使用
  const page = reactive({
    index: 1,
    size: 10,
    total: 0
  })
  const getTableData = init => {
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
      userTypeId: null
    }
    getAallUserType(params)
      .then(res => {
        let data = res.data
        tableData.value = res.data
        page.total = Number(res.data.length)
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
  // 新增或编辑后改变清空值
  const fromChangeData = params => {
    cleanSearchForm.value = true
    getTableData(true)
  }
  return {
    page,
    loading,
    tableData,
    getTableData,
    fromChangeData
  }
}
// 编辑/新增模态框
const useDialogEffect = () => {
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
  return { layer, handleAdd, handleEdit }
}
// 删除模态框
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
      .join()
    isDisabled.value = true
    dialogVisible.value = true
    num.value = 6
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
          num.value = '确定'
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
    deleteUserTypeById(uid.value)
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
// 查询功能
const useSearchEffect = (page, cleanSearchForm, tableData) => {
  // 搜索参数
  const quary = reactive({
    name: ''
  })
  // 查询函数
  const searchPage = () => {
    let params = { name: quary.name }
    getUserTypeByName(params)
      .then(res => {
        tableData.value = res.data
        page.total = Number(res.data.length)
      })
      .catch(err => {
        tableData.value = []
      })
  }
  // 监听清空值
  watch(cleanSearchForm, (newval, oldval) => {
    if (newval) {
      quary.name = ''
    }
  })
  return {
    quary,
    searchPage
  }
}

export default defineComponent({
  components: {
    Table,
    Layer
  },
  setup(props, ctx) {
    // 判断是否清空搜索栏
    const cleanSearchForm = ref(false)
    const { page, loading, tableData, getTableData, fromChangeData } = useTabelEffect(cleanSearchForm)
    const { layer, handleAdd, handleEdit } = useDialogEffect()
    const { num, isDisabled, dialogVisible, handleClose, handelSuccess, handelDele } = useDeleEffect(getTableData)
    const { quary, searchPage } = useSearchEffect(page, cleanSearchForm, tableData)
    getTableData(true)
    return {
      num,
      isDisabled,
      dialogVisible,
      tableData,
      loading,
      page,
      layer,
      quary,
      searchPage,
      handleAdd,
      handleEdit,
      getTableData,
      handelDele,
      handelSuccess,
      handleClose,
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

  .search_form {
    display: flex;
    margin-left: 20px;
    .el-button {
      margin-left: 10px;
    }
  }
  .el-dialog {
    span {
      font-size: 20px;
    }
  }
}
</style>
