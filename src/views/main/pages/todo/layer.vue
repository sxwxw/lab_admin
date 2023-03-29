<template>
  <Layer :layer="layer" @confirm="submit" ref="layerDom">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" style="margin-right: 30px">
      <el-form-item label="事由名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入单位名"></el-input>
      </el-form-item>
    </el-form>
  </Layer>
</template>

<script>
import { defineComponent, reactive, ref, unref } from 'vue'
import { addTodo, updateTodo } from '@/api/table'
import Layer from '@/components/layer/index.vue'
import { ElMessage } from 'element-plus'
// 表单操作
const useFromEffcet = (form, ctx) => {
  const ruleForm = ref()
  const layerDom = ref()
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
    addTodo(params).then(res => {
      successEffect('新增')
    })
  }
  // 编辑事由
  const updateForm = params => {
    updateTodo(params).then(res => {
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
      name: ''
    })
    const rules = {
      name: [{ required: true, message: '请输入单位名', trigger: 'blur' }]
    }
    const { ruleForm, layerDom, submit } = useFromEffcet(form, ctx)
    const { init } = useInitEffect(props, form)
    init()
    return {
      form,
      rules,
      layerDom,
      ruleForm,
      submit
    }
  }
})
</script>

<style lang="scss" scoped></style>
