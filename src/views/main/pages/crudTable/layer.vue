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
          <el-input v-model="form.telphone" placeholder="请输入电话"> </el-input>
        </el-form-item>
      </div>
      <div class="selects" v-show="layer.userFlag">
        <el-form-item label="单位" prop="unitId">
          <el-select v-model="form.unitId" placeholder="请选择单位">
            <!-- <el-option :key="''" :label="'全部'" :value="''"></el-option> -->
            <!-- <el-option> </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="课题组" prop="classGroupId">
          <el-select v-model="form.classGroupId" placeholder="请选择课题组">
            <!-- <el-option :key="''" :label="'全部'" :value="''"></el-option> -->
          </el-select>
        </el-form-item>
      </div>
      <div class="visitor" v-show="!layer.userFlag">
        <el-form-item label="时间开始-结束" prop="time">
          <el-date-picker v-model="form.time" type="datetimerange" start-placeholder="Start Date" end-placeholder="End Date"> </el-date-picker>
        </el-form-item>
      </div>
      <el-form-item label="用户类型" prop="userTypeId">
        <el-select v-model="form.userTypeId" placeholder="请选择用户类型">
          <!-- <el-option :key="''" :label="'全部'" :value="''"></el-option> -->
          <!-- <el-option> </el-option> -->
        </el-select>
      </el-form-item>
    </el-form>
  </Layer>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { add, update } from '@/api/table'
import { selectData, radioData } from './enum'
import Layer from '@/components/layer/index.vue'
import { realName, checkEmail, checkPhone, companyNameC, classGroup } from '@/utils/system/rules.js'
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
          userFlag: ''
        }
      }
    }
  },
  setup(props, ctx) {
    console.log(props)
    const ruleForm = ref(null)
    const layerDom = ref(null)
    let form = ref({
      realName: '',
      email: '',
      telphone: '',
      unitId: '',
      classGroupId: '',
      userTypeId: ''
    })
    const rules = {
      realName: [{ required: true, validator: realName, trigger: 'blur' }],
      email: [{ required: false, validator: checkEmail, trigger: 'blur' }],
      telphone: [{ required: false, validator: checkPhone, trigger: 'blur' }],
      unitId: [{ required: true, trigger: 'blur' }],
      classGroupId: [{ required: true, trigger: 'blur' }],
      userTypeId: [{ required: true, message: '请选择用户类型', trigger: 'blur' }]
    }
    init()
    function init() {
      // 用于判断新增还是编辑功能
      if (props.layer.row) {
        form.value = JSON.parse(JSON.stringify(props.layer.row)) // 数量量少的直接使用这个转
      } else {
      }
    }
    return {
      form,
      rules,
      layerDom,
      ruleForm,
      selectData,
      radioData
    }
  },
  methods: {
    submit() {
      if (this.ruleForm) {
        this.ruleForm.validate(valid => {
          if (valid) {
            let params = this.form
            form.userTypeId = 1
            form.classGroupId = 1
            form.unitId = 1
            if (this.layer.row) {
              this.updateForm(params)
            } else {
              this.addForm(params)
            }
          } else {
            return false
          }
        })
      }
    },
    // 新增提交事件
    addForm(params) {
      add(params).then(res => {
        this.$message({
          type: 'success',
          message: '新增成功'
        })
        this.$emit('getTableData', true)
        this.layerDom && this.layerDom.close()
      })
    },
    // 编辑提交事件
    updateForm(params) {
      console.log(params)
      // update(params).then(res => {
      //   this.$message({
      //     type: 'success',
      //     message: '编辑成功'
      //   })
      //   this.$emit('getTableData', false)
      //   this.layerDom && this.layerDom.close()
      // })
    }
  }
})
</script>

<style lang="scss" scoped>
.selects {
  display: flex;
}
</style>
