<template>
  <Layer :layer="layer" @confirm="submit" ref="layerDom">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" style="margin-right: 30px">
      <el-form-item label="单位名称" prop="unitId">
        <el-select v-model="form.unitId" placeholder="请选择单位">
          <el-option v-for="(item, index) in unitName" :label="item" :key="index" :value="index + 1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课题组" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="课题组描述" prop="described">
        <el-input v-model="form.described" :rows="6" maxlength="100" placeholder="Please input" show-word-limit type="textarea" />
      </el-form-item>
    </el-form>
  </Layer>
</template>

<script>
import { defineComponent, reactive, ref, unref } from 'vue'
import { getAallUnit } from '@/api/user'
import { updateClassGroup, addClassGroup } from '@/api/user'
import Layer from '@/components/layer/index.vue'
import { toRefs } from '@vueuse/core'
import { ElMessage } from 'element-plus'
// 表单操作
const useFromEffcet = (form, ctx) => {
  const ruleForm = ref()
  const layerDom = ref()
  const unit = reactive({
    unitName: []
  })
  // 获取单位数据
  getAallUnit().then(res => {
    const data = res.data
    data.filter(function (item) {
      unit.unitName.push(item.name)
    })
  })
  // 事由操作
  const submit = () => {
    const FromVal = unref(ruleForm)
    if (!FromVal) {
      return false
    }
    try {
      FromVal.validate(valid => {
        if (valid) {
          if (form.id === '') {
            return addForm(form)
          }
          updateForm(form)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  // 新增事由
  const addForm = params => {
    addClassGroup(params).then(res => {
      successEffect('新增')
    })
  }
  // 编辑事由
  const updateForm = params => {
    updateClassGroup(params).then(res => {
      successEffect('编辑')
    })
  }
  // 成功状态
  const successEffect = str => {
    const layerDomVal = unref(layerDom)
    ElMessage({
      type: 'success',
      message: `${str}成功`
    })
    ctx.emit('fromChangeData', true)
    layerDomVal && layerDomVal.close()
  }
  const { unitName } = toRefs(unit)
  return {
    unitName,
    ruleForm,
    layerDom,
    submit
  }
}
// 初始化函数
const useInitEffect = (props, form) => {
  const init = () => {
    if (props.layer.row) {
      form.id = props.layer.row.id
      form.name = props.layer.row.name
      form.unitId = props.layer.row.unit_id
    } else {
    }
  }
  return {
    init
  }
}
export default defineComponent({
  components: {
    Layer
  },
  props: {
    layer: {
      type: Object,
      default: () => {
        return {
          show: false,
          title: '',
          showButton: true
        }
      }
    }
  },
  setup(props, ctx) {
    const form = reactive({
      id: '',
      name: '',
      pageNum: 1,
      pageSize: 10,
      unitId: null,
      described: ''
    })
    const rules = {
      unitId: [{ required: true, message: '请选择单位', trigger: 'blur' }],
      name: [{ required: true, message: '请选择课题组', trigger: 'blur' }],
      described: [{ required: false, message: '请选择课题组', trigger: 'blur' }]
    }
    const { unitName, ruleForm, layerDom, submit } = useFromEffcet(form, ctx)
    const { init } = useInitEffect(props, form)
    init()
    return {
      form,
      rules,
      unitName,
      ruleForm,
      layerDom,
      submit
    }
  }
})
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    width: 100%;
  }
  .el-input {
    resize: none;
  }
}
</style>
