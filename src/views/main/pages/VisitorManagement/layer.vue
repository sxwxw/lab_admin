<template>
  <Layer :layer="layer" @confirm="submit" ref="layerDom">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" style="margin-right: 30px">
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="form.realName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="telphone">
        <el-input v-model="form.telphone" placeholder="请输入电话"></el-input>
      </el-form-item>
      <el-form-item label="单位名称" prop="unitId">
        <el-select v-model="form.unitId" placeholder="请选择单位">
          <el-option v-for="(item, index) in unitName" :label="item" :key="item" :value="index + 1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间开始-结束" prop="time">
        <el-date-picker v-model="form.time" value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange" start-placeholder="Start Date" end-placeholder="End Date"></el-date-picker>
      </el-form-item>
    </el-form>
  </Layer>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, unref } from 'vue'
import { getAallUnit } from '@/api/user'
import { updateVisitor, addVisitor } from '@/api/table'
import Layer from '@/components/layer/index.vue'
import { ElMessage } from 'element-plus'
import { cheackName, checkEmail, checkPhone, companySelect } from '@/utils/system/rules.js'
// 表单操作
const useFromEffcet = (form, props, ctx) => {
  const ruleForm = ref()
  const layerDom = ref()
  const user = reactive({
    unitName: []
  })
  // 获取单位数据
  getAallUnit().then(res => {
    const data = res.data
    data.filter(function (item) {
      user.unitName.push(item.name)
    })
  })
  // 事由操作
  const submit = () => {
    const FromVal = unref(ruleForm)
    if (!FromVal) {
      return
    }
    try {
      FromVal.validate(valid => {
        if (valid) {
          const { realName, email, telphone, unitId } = form
          let params = { id: '', realName, email, telphone, unitId, startTime: '', endTime: '', userTypeId: 0 }
          params.startTime = form.time[0]
          params.endTime = form.time[1]
          console.log(params)
          if (form.id === '') {
            params.userTypeId = 2
            return addForm(params)
          }
          params.id = form.id
          updateForm(params)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  // 新增事由
  const addForm = params => {
    addVisitor(params).then(res => {
      successEffect('新增')
    })
  }
  // 编辑事由
  const updateForm = params => {
    updateVisitor(params).then(res => {
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
  const { unitName } = toRefs(user)
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
      const { real_name, email, telphone, unit_id, end_time, start_time, id, user_type_id } = props.layer.row
      form.id = id
      form.realName = real_name
      form.email = email
      form.telphone = telphone
      form.unitId = unit_id
      form.userTypeId = user_type_id
      if (!start_time) {
        form.time = ['', '']
      } else {
        form.time = [start_time.replace('T', ' '), end_time.replace('T', ' ')]
      }
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
    },
    searchData: {
      type: Object
    }
  },
  setup(props, ctx) {
    const form = reactive({
      id: '',
      realName: '',
      email: '',
      telphone: '',
      unitId: '',
      userTypeId: '',
      time: []
    })
    const rules = {
      realName: [{ required: true, validator: cheackName, trigger: 'blur' }],
      email: [{ required: false, validator: checkEmail, trigger: 'blur' }],
      telphone: [{ required: false, validator: checkPhone, trigger: 'blur' }],
      unitId: [{ required: true, validator: companySelect, trigger: 'blur' }]
    }
    const { unitName, ruleForm, layerDom, submit } = useFromEffcet(form, props, ctx)
    const { init } = useInitEffect(props, form)
    init()
    return { form, rules, layerDom, ruleForm, unitName, submit }
  }
})
</script>

<style lang="scss" scoped></style>
