<template>
  <Layer :layer="layer" @confirm="submit" ref="layerDom">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" style="margin-right: 30px">
      <el-form-item label="单位名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入单位名"></el-input>
      </el-form-item>
      <el-form-item label="单位类型" prop="unitType">
        <el-select v-model="form.unitType" class="m-2" placeholder="请选择单位类型" size="large">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </Layer>
</template>

<script>
import { defineComponent, reactive, ref, unref } from 'vue'
import { updateUnit, addUnit } from '@/api/user'
import Layer from '@/components/layer/index.vue'
import { ElMessage } from 'element-plus'
// 表单操作
const useFromEffcet = (form, ctx) => {
  const ruleForm = ref()
  const layerDom = ref()
  const options = [
    { value: '院内', label: '院内' },
    { value: '院外', label: '院外' }
  ]
  // 事由操作
  const submit = () => {
    const FromVal = unref(ruleForm)
    if (!FromVal) {
      return false
    }
    try {
      FromVal.validate(valid => {
        if (valid) {
          console.log(form)
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
    addUnit(params).then(res => {
      successEffect('新增')
    })
  }
  // 编辑事由
  const updateForm = params => {
    updateUnit(params).then(res => {
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
  return {
    options,
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
      form.unitType = props.layer.row.unitType
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
      unitType: ''
    })
    const rules = {
      name: [{ required: true, message: '请输入单位名', trigger: 'blur' }],
      unitType: [{ required: true, message: '请选择单位类型', trigger: 'blur' }]
    }
    const { options, ruleForm, layerDom, submit } = useFromEffcet(form, ctx)
    const { init } = useInitEffect(props, form)
    init()
    return {
      form,
      rules,
      layerDom,
      ruleForm,
      options,
      submit
    }
  }
})
</script>

<style lang="scss" scoped></style>
