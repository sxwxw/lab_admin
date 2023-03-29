<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">{{ $t('message.common.add') }}</el-button>
        <el-button type="primary" icon="el-icon-download" @click="handleAdd">{{ $t('message.common.batchImport') }}</el-button>
        <el-button type="primary" icon="el-icon-upload" @click="handleAdd">{{ $t('message.common.batchExport') }}</el-button>
        <el-popconfirm :title="$t('message.common.delTip')" @confirm="handleDel(chooseData)">
          <template #reference>
            <el-button type="danger" icon="el-icon-delete" :disabled="chooseData.length === 0">{{ $t('message.common.delBat') }}</el-button>
          </template>
        </el-popconfirm>
      </div>
      <div class="layout-container-form-search">
        <Search />
        <!-- <el-input v-model="query.input" :placeholder="$t('message.common.searchTip')" @change="getTableData(true)"></el-input>
        <el-input v-model="query.input" :placeholder="$t('message.common.searchTip')" @change="getTableData(true)"></el-input>
        <el-input v-model="query.input" :placeholder="$t('message.common.searchTip')" @change="getTableData(true)"></el-input>
        <el-button type="primary" icon="el-icon-search" class="search-btn" @click="getTableData(true)">{{ $t('message.common.query') }}</el-button> -->
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
        @getTableData="getTableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="real_name" label="名称" align="center" />
        <el-table-column prop="email" label="邮箱" align="center" />
        <el-table-column prop="telphone" label="电话" align="center" />
        <el-table-column prop="unit_name" label="单位" align="center" />
        <el-table-column prop="user_type_name" label="用户类型" align="center" />
        <el-table-column prop="sign_status" label="签到状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.sign_status === 1 ? 'success' : 'danger'">
              {{ scope.row.sign_status === 0 ? '未签到' : '签到' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="unit_type" label="单位类型" align="center" />
        <el-table-column prop="active" label="激活状态" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.active"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :inactive-value="0"
              :active-value="1"
              @change="ChangSwith(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="class_group_name" label="课题组" align="center" />

        <el-table-column prop="face_status" label="是否录入人脸" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.face_status === '录入' ? 'success' : 'danger'">{{ scope.row.face_status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="touch_status" label="是否录入指纹" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.touch_status === '录入' ? 'success' : 'danger'">{{ scope.row.touch_status }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column :label="$t('message.common.handle')" align="center" width="160">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)">{{ $t('message.common.update') }} </el-button>
            <el-popconfirm :title="$t('message.common.delTip')" @confirm="handleDel([scope.row])">
              <template #reference>
                <el-button type="danger">{{ $t('message.common.del') }}</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </Table>
      <Layer :layer="layer" @getTableData="getTableData" v-if="layer.show" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import Table from '@/components/table/index.vue'
import { getData, del, changeActiveApi } from '@/api/table'
import Layer from './layer.vue'
import Search from './search.vue'
import { ElMessage } from 'element-plus'
import { selectData, radioData } from './enum'
export default defineComponent({
  name: 'crudTable',
  components: {
    Table,
    Layer,
    Search
  },
  setup() {
    // 存储搜索用的数据
    const query = reactive({
      input: ''
    })
    // 弹窗控制器
    const layer = reactive({
      show: false,
      title: '新增',
      showButton: true,
      userFlag: true
    })
    // 分页参数, 供table使用
    const page = reactive({
      index: 1,
      size: 3,
      total: 0
    })
    const loading = ref(true)
    const tableData = ref([])
    const chooseData = ref([])
    const handleSelectionChange = val => {
      chooseData.value = val
    }
    // 获取表格数据
    // params <init> Boolean ，默认为false，用于判断是否需要初始化分页
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
        userTypeId: null,
        ...query
      }
      getData(params)
        .then(res => {
          console.log(res)
          let data = res.data.records
          if (Array.isArray(data)) {
            data.forEach(d => {
              const select = selectData.find(select => select.value === d.choose)
              select ? (d.chooseName = select.label) : (d.chooseName = d.choose)
              const radio = radioData.find(select => select.value === d.radio)
              radio ? (d.radioName = radio.label) : d.radio
            })
          }
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
    // 删除功能
    const handleDel = data => {
      console.log(data)
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
        getTableData(tableData.value.length === 1 ? true : false)
      })
    }
    // 新增弹窗功能
    const handleAdd = () => {
      layer.title = '新增数据'
      layer.show = true
      delete layer.row
    }
    // 编辑弹窗功能
    const handleEdit = row => {
      layer.title = row.user_type_name === '访客' ? '修改访客信息' : '修改用户信息'
      layer.row = row
      layer.show = true
      layer.userFlag = row.user_type_name === '访客' ? false : true
    }
    // 用户激活状态
    const ChangSwith = scopeRow => {
      const changAvtive = {
        id: null,
        active: null
      }
      changAvtive.id = scopeRow.id
      changAvtive.active = scopeRow.active
      changeActiveApi(changAvtive)
    }
    getTableData(true)
    return {
      query,
      tableData,
      chooseData,
      loading,
      page,
      layer,
      handleSelectionChange,
      handleAdd,
      handleEdit,
      handleDel,
      getTableData,
      ChangSwith
    }
  }
})
</script>

<style lang="scss" scoped></style>
