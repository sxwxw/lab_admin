<template>
  <Layer :layer="layer" @confirm="submit" ref="layerDom">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" style="margin-right: 30px">
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="form.realName" placeholder="请输入姓名"> </el-input>
      </el-form-item>
      <div>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"> </el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telphone">
          <el-input v-model="form.telphone" placeholder="请输入电话"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="用户类型" prop="userTypeId" v-if="layer.userFlag || layer.userType">
        <el-select v-model="form.userTypeId" placeholder="请选择用户类型" @change="changeUserType">
          <el-option v-for="(item, index) in userTypeData" :label="item" :key="index" :value="index + 1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位名称" prop="unitId">
        <el-select v-model="form.unitId" placeholder="请选择单位" @change="changeClassGroup">
          <el-option v-for="(item, index) in unitNameData" :label="item" :key="index" :value="index + 1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课题组" prop="classGroupId" v-if="usertypeNum == 2 ? false : layer.userFlag">
        <el-select @change="handelselect" v-model="form.classGroupId" placeholder="请选择课题组">
          <el-option v-for="item in classGroupData" :label="item.name" :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <div class="visitor" v-if="usertypeNum == 2 ? true : !layer.userFlag">
        <el-form-item label="时间开始-结束" prop="time">
          <el-date-picker
            v-model="form.time"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetimerange"
            start-placeholder="Start Date"
            end-placeholder="End Date"
          >
            >
          </el-date-picker>
        </el-form-item>
      </div>
    </el-form>
  </Layer>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, unref } from 'vue'
import { getAallUserType, getAallUnit, getAallClass } from '@/api/user'
import { addUser, updateVisitor, updateUser, addVisitor } from '@/api/table'
import Layer from '@/components/layer/index.vue'
import { cheackName, checkEmail, checkPhone, companySelect, classGroupSelect, userTypeSelect } from '@/utils/system/rules.js'
import { ElMessage } from 'element-plus'
const useFromEffect = form => {
  // 获取单位，单位类型,课题组
  const user = reactive({
    userTypeData: [],
    unitNameData: [],
    classGroupData: []
  })
  getAallUserType().then(res => {
    const data = res.data
    data.filter(function (item) {
      user.userTypeData.push(item.name)
    })
  })
  getAallUnit().then(res => {
    const data = res.data
    data.filter(function (item) {
      user.unitNameData.push(item.name)
    })
  })
  const changeClassGroup = e => {
    user.classGroupData = ''
    getAallClass(e).then(res => {
      user.classGroupData = res.data
    })
  }
  // 编辑用户课题组选择
  const handelselect = item => {
    user.classGroupData.map(e => {
      if (e.name === item) {
        form.classGroupId = e.name
        form.classGroupName = e.id
        return true
      }
    })
  }
  const { userTypeData, unitNameData, classGroupData } = toRefs(user)
  return { userTypeData, unitNameData, classGroupData, changeClassGroup, handelselect }
}
// 表单操作
const useFromEffcet = (form, props, ctx) => {
  const ruleForm = ref()
  const layerDom = ref()
  const submit = () => {
    const FromVal = unref(ruleForm)
    if (!FromVal) {
      return false
    }
    try {
      FromVal.validate(valid => {
        if (valid) {
          const { id, realName, email, telphone, unitId } = form
          let params = {}
          params.id = id
          params.realName = realName
          params.email = email
          params.telphone = telphone
          params.unitId = unitId
          if (props.layer.row) {
            if (props.layer.row.user_type_name === '访客') {
              updateVisitorForm(form, params)
            } else {
              updateUserForm(form, params)
            }
          } else {
            addForm(form, params)
          }
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  // 用户/访客新增
  const addForm = (formValue, params) => {
    const { userTypeId, classGroupId, classGroupName } = formValue
    if (formValue.time) {
      const VisitorParams = { ...params, userTypeId }
      VisitorParams.startTime = formValue.time[0]
      VisitorParams.endTime = formValue.time[1]
      addVisitor(VisitorParams).then(res => {
        successEffect('新增')
      })
    } else {
      const Userparams = { ...params, userTypeId, classGroupId }
      Userparams.classGroupId = classGroupName
      console.log(Userparams)
      addUser(Userparams).then(res => {
        successEffect('新增')
      })
    }
  }
  // 编辑访客提交事件
  const updateVisitorForm = (formValue, params) => {
    params.startTime = formValue.time[0]
    params.endTime = formValue.time[1]
    updateVisitor(params).then(res => {
      successEffect('编辑')
    })
  }
  // 编辑用户提交事件
  const updateUserForm = (formValue, params) => {
    params.userTypeId = formValue.userTypeId
    params.classGroupId = formValue.classGroupName
    updateUser(params).then(res => {
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
// 判断用户类型
const useTypeEffect = props => {
  // 用来辨别模态框为访客或用户
  const usertypeNum = ref(0)
  // 判断用户
  const changeUserType = e => {
    if (props.layer.title === '新增数据') {
      usertypeNum.value = e
    }
  }
  return {
    usertypeNum,
    changeUserType
  }
}
// 初始化函数
const useInitEffect = (form, fangFalg, props, classGroupData) => {
  const init = () => {
    // 用于判断新增还是编辑功能,及初始页面渲染
    if (props.layer.row) {
      form.id = props.layer.row.id
      form.realName = props.layer.row.real_name
      form.email = props.layer.row.email
      form.telphone = props.layer.row.telphone
      form.unitId = props.layer.row.unit_id
      if (props.layer.row.user_type_name != '访客') {
        fangFalg.value = true
        form.userTypeId = props.layer.row.user_type_id
        form.classGroupId = props.layer.row.class_group_name
        form.classGroupName = props.layer.row.class_group_id
        getAallClass(form.unitId).then(res => {
          classGroupData.value = res.data
        })
      } else {
        fangFalg.value = false
        form.time = [props.layer.row.start_time.replace('T', ' '), props.layer.row.end_time.replace('T', ' ')]
      }
    } else {
      fangFalg.value = true
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
          showButton: true,
          userFlag: '',
          userType: true
        }
      }
    },
    searchData: {
      type: Object
    }
  },
  setup(props, ctx) {
    // 用来辨别用户和访客rules的规则
    const fangFalg = ref(false)
    // 表单获取及验证
    const form = reactive({
      id: null,
      realName: null,
      email: null,
      telphone: null,
      unitId: null,
      userTypeId: null,
      classGroupId: null,
      classGrunp: null,
      classGroupName: null,
      time: null
    })
    const rules = {
      realName: [{ required: true, validator: cheackName, trigger: 'blur' }],
      email: [{ required: false, validator: checkEmail, trigger: 'blur' }],
      telphone: [{ required: false, validator: checkPhone, trigger: 'blur' }],
      unitId: [{ required: true, validator: companySelect, trigger: 'blur' }],
      classGroupId: [{ required: fangFalg.value, validator: classGroupSelect, trigger: 'blur' }],
      userTypeId: [{ required: fangFalg.value, validator: userTypeSelect, trigger: 'blur' }]
    }
    let { userTypeData, unitNameData, classGroupData, changeClassGroup, handelselect } = useFromEffect(form)
    const { init } = useInitEffect(form, fangFalg, props, classGroupData)
    const { ruleForm, layerDom, submit } = useFromEffcet(form, props, ctx)
    const { usertypeNum, changeUserType } = useTypeEffect(props)
    init()
    return {
      userTypeData,
      unitNameData,
      classGroupData,
      form,
      rules,
      layerDom,
      ruleForm,
      usertypeNum,
      fangFalg,
      changeClassGroup,
      changeUserType,
      handelselect,
      submit
    }
  }
})
</script>

<style lang="scss" scoped>
.selects {
  display: flex;
  flex-direction: column;
  .selects_item {
    display: flex;
  }
}
</style>
