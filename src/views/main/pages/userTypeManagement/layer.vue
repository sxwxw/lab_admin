<template>
  <Layer :layer="layer" @confirm="submit" ref="layerDom">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" style="margin-right: 30px">
      <el-form-item label="用户类型" prop="name">
        <el-input v-model="form.name" placeholder="请输入类型名"></el-input>
      </el-form-item>
      <el-form-item label="事由">
        <div class="transfer">
          <el-transfer
            v-model="form.yesData"
            style="text-align: left; display: flex"
            :props="{ key: 'id', label: 'name' }"
            :titles="['事由列表', '已选事由']"
            :right-default-checked="form.yesData"
            @change="handleChange"
            :data="fileArr"
          ></el-transfer>
        </div>
      </el-form-item>
    </el-form>
  </Layer>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { addUserType, updateUserType } from '@/api/user'
import { getAllTodo } from '@/api/table'
import Layer from '@/components/layer/index.vue'
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
    const ruleForm = ref(null)
    const layerDom = ref(null)
    let form = ref({
      id: '',
      name: '',
      yesData: []
    })
    const fileArr = ref([])
    const rules = {
      name: [{ required: true, message: '请输入类型名', trigger: 'blur' }]
    }
    // 获取全部事由
    const getData = () => {
      const params = {
        pageNo: 1,
        pageSize: 10000,
        search: ''
      }
      getAllTodo(params)
        .then(res => {
          fileArr.value = res.data.records
          let str = props.layer.row.todoListId.split(',')
          str = str.map(Number)
          // 已选事由
          form.value.yesData = str
        })
        .catch(err => {
          console.log(err)
        })
    }
    getData()
    const init = () => {
      // 用于判断新增还是编辑功能
      if (props.layer.row) {
        const { id, name } = props.layer.row
        form.value.id = id
        form.value.name = name
      } else {
      }
    }
    init()
    const handleChange = (value, direction, movedKeys) => {
      console.log(value, direction, movedKeys)
    }
    return {
      fileArr,
      form,
      rules,
      layerDom,
      ruleForm,
      handleChange
    }
  },
  methods: {
    submit() {
      if (this.ruleForm) {
        this.ruleForm.validate(valid => {
          if (valid) {
            let params = {}
            params.id = this.form.id
            params.name = this.form.name
            params.todoListId = this.form.yesData.toString()
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
      addUserType(params).then(res => {
        this.$message({
          type: 'success',
          message: '新增成功'
        })
        this.$emit('fromChangeData', true)
        this.layerDom && this.layerDom.close()
      })
    },
    // 编辑提交事件
    updateForm(params) {
      updateUserType(params).then(res => {
        this.$message({
          type: 'success',
          message: '编辑成功'
        })
        this.$emit('fromChangeData', false)
        this.layerDom && this.layerDom.close()
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.el-transfer {
  width: 100%;
  justify-content: center;
  align-items: center;

  ::v-deep .el-transfer__buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  ::v-deep .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
