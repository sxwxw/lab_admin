<template>
  <div class="system-table-box">
    <el-table :row-class-name="tableRowClassName" v-bind="$attrs" class="system-table" border height="100%" :data="data" @selection-change="handleSelectionChange">
      <el-table-column label="序号" width="60" align="center" v-if="showIndex">
        <template #default="scope">
          {{ (page.index - 1) * page.size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
    <el-pagination
      v-if="showPage"
      v-model:current-page="page.index"
      class="system-page"
      background
      :layout="pageLayout"
      :total="page.total"
      :page-size="page.size"
      :page-sizes="pageSizes"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from 'vue'
export default defineComponent({
  props: {
    data: { type: Array, default: () => [] }, // 数据源
    select: { type: Array, default: () => [] }, // 已选择的数据，与selection结合使用
    showIndex: { type: Boolean, default: false }, // 是否展示index选择，默认否
    // showSelection: { type: Boolean, default: false }, // 是否展示选择框，默认否
    showPage: { type: Boolean, default: true }, // 是否展示页级组件，默认是
    page: {
      // 分页参数
      type: Object,
      default: () => {
        return { index: 1, size: 20, total: 0 }
      }
    },
    pageLayout: { type: String, default: 'total, sizes, prev, pager, next, jumper' }, // 分页需要显示的东西，默认全部
    pageSizes: { type: Array, default: [10, 20, 50, 100] },
    searchData: {
      type: Object
    },
    addState: {
      type: Boolean
    },
    editState: {
      type: Boolean
    },
    creamflag: {
      type: Boolean
    }
  },
  setup(props, context) {
    let timer = null
    // 保存搜索信息
    let params = {
      pageNum: 1,
      pageSize: 10,
      realName: '',
      unitId: null,
      unitType: null,
      userTypeId: null,
      unit: null,
      classGroupName: '',
      stayTime: 0,
      dateValue: null,
      endTime: null,
      startTime: null,
      search: '',
      userName: ''
    }
    // 分页相关：监听页码切换事件
    const handleCurrentChange = val => {
      // 如果是新增和编辑后点击分页栏则清空数据
      if (props.addState || props.editState || props.creamflag) {
        params.realName = ''
        params.unitId = null
        params.unitType = null
        params.userTypeId = null
        params.unit = null
        params.classGroupName = ''
        params.stayTime = 0
        params.dateValue = null
        params.endTime = null
        params.startTime = null
        params.search = ''
      } else {
        params.realName = props.searchData.realName || ''
        params.unitId = props.searchData.unitId || ''
        params.unitType = props.searchData.unitType || null
        params.userTypeId = props.searchData.userTypeId || null
        params.unit = props.searchData.unit || null
        params.classGroupName = props.searchData.classGroupName || ''
        params.stayTime = props.searchData.stayTime || 0
        params.dateValue = props.searchData.dateValue || null
        params.endTime = props.searchData.endTime || null
        params.startTime = props.searchData.startTime || null
        params.search = props.searchData.search || ''
        params.userName = props.searchData.userName || ''
      }
      params.pageNum = val
      params.pageSize = props.page.size
      if (timer) {
        props.page.index = 1
      } else {
        props.page.index = val
        console.log(params)
        context.emit('ShowSearchData', params)
      }
    }
    // 分页相关：监听单页显示数量切换事件
    const handleSizeChange = val => {
      timer = 'work'
      setTimeout(() => {
        timer = null
      }, 100)
      props.page.size = val
      console.log(val)
      context.emit('ShowNumData', val)
    }
    // 选择监听器
    const handleSelectionChange = val => {
      context.emit('selection-change', val)
    }

    const tableRowClassName = ({ row, rowIndex }) => {
      if ((rowIndex + 1) % 2 === 0) {
        return 'warning-row'
      }
      if (rowIndex == 0) {
        return 'header-row'
      }
      return ''
    }
    return {
      handleCurrentChange,
      handleSizeChange,
      handleSelectionChange,
      tableRowClassName
    }
  }
})
</script>

<style lang="scss">
.system-table-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  .system-table {
    flex: 1;
    height: 100%;
  }
  .system-page {
    margin-top: 20px;
  }
  .el-table .warning-row {
    background-color: #fafafa;
  }
  // .el-table .header-row {
  //   background-color: #ebeaef;
  // }
}
</style>
