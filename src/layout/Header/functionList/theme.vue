<template>
  <div :title="$t('message.system.setting.name')" @click="drawerChange(true)">
    <span class="el-dropdown-link">系统设置</span>
  </div>
  <el-drawer :title="$t('message.system.setting.name')" v-model="drawer" size="393px" :show-close="false" direction="rtl">
    <h3>{{ $t('message.system.setting.style.name') }}</h3>
    <div class="theme-box">
      <theme-icon
        v-model:active="state.style"
        v-for="(row, index) in style"
        :key="index"
        :name="index"
        :tip="$t(row.name)"
        :logo="row.logo.background"
        :menu="row.menu.background"
        :header="row.header.background"
        :main="row.container.background"
        :activeColor="row.page.color"
      ></theme-icon>
    </div>
    <h3>{{ $t('message.system.setting.primaryColor.name') }}</h3>
    <div class="theme-box">
      <theme-color
        v-for="(item, key) in themeColorArr"
        v-model:active="state.primaryColor"
        v-model:activeTextColor="state.primaryTextColor"
        :key="key"
        :color="item.color"
        :textColor="item.textColor"
        :tip="item.tip"
      ></theme-color>
    </div>
    <h3>配项设置</h3>
    <div class="list">
      <div class="list-item">
        <span>签到模式</span>
        <div class="radios">
          <el-radio-group v-model="state.radioval" size="large" @change="handelRadioVal">
            <el-radio label="0">人脸识别</el-radio>
            <el-radio label="1">指纹识别</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="list-item">
        <span>自动签退时长</span>
        <el-select v-model="state.SignOutTime"  placeholder="请选择时长" size="large" @change="handelSignTime">
          <el-option v-for="item in timeOptions" :key="item.id" :value="item.time"></el-option>
        </el-select>
      </div>
      <div class="list-item">
        <span>定时开机</span>
        <el-time-select 
        v-model="state.sartTimeValue" 
        size="large"
        start="00:00" 
        end="23:59" 
        step="00:15" 
        :max-time="state.endTimeValue"
        format="hh:mm A"
        @change="handleStartTime"
        placeholder="选择时间"></el-time-select>
      </div>
      <div class="list-item">
        <span>定时关机</span>
        <el-time-select 
        size="large"
        v-model="state.endTimeValue" 
        start="00:00" 
        end="23:59" 
        step="00:15" 
        :min-time="state.sartTimeValue"
        format="hh:mm A"
        @change="handleEndTime"
        placeholder="选择时间"></el-time-select>
      </div>
      <div class="list-item">
        <span>备份时间</span>
        <div class="list-item-backups">
          <el-select v-model="state.selectBackup" class="m-2" @change="handleAutoBackUpDate" placeholder="Select" size="large">
            <el-option v-for="item in BackupTimeOptions" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
          <el-time-select v-model="state.BackupTime"
           size="large"
           start="00:00" end="23:59" step="00:15"
           format="hh:mm A"
           @change="handleAutoBackUpTime"
          placeholder="选择时间"></el-time-select>
        </div>
      </div>
      <div class="list-item">
        <span>立即备份</span>
        <el-button type="primary" @click="backUpData">备份</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { defineComponent, ref, reactive, computed, watch, watchEffect, onMounted } from 'vue'
import { useStore } from 'vuex'
import { style } from '@/theme/index'
import { useI18n } from 'vue-i18n'
import { updateActiveModel, updateEndTime, updateExitTime, backUpDateNow, getSystemParams, updateStartTime, updateBackUpTime } from '@/api/base.js'
import themeIcon from './theme/theme-icon.vue'
import themeColor from './theme/theme-color.vue'
import { ElMessageBox, ElMessage } from 'element-plus'


const getAllSystemParams = (state) => {
  getSystemParams()
  .then(res => {
    state.sartTimeValue = res.data.start_time
    state.endTimeValue = res.data.end_time
    state.SignOutTime = res.data.lab_time
    state.selectBackup = res.data.backup_time.split(" ")[0]
    state.BackupTime = res.data.backup_time.split(" ")[1]
    state.backupCron = res.data.backup_cron
    state.radioval = res.data.active_mode.toString()
  })
}

// 根据日期修改cron表达式
const updateCronByDate = (state, val) => {
  let cron = state.backupCron.split(" ")
  if (val == "每日") {
    cron[3] = "*"
    cron[4] = "*"
    cron[5] = "?"
  } else if (val == "每周") {
    cron[3] = "?"
    cron[4] = "*"
    cron[5] = "01"
  } else if (val == "每月") {
    cron[3] = "01"
    cron[4] = "*"
    cron[5] = "?"
  }
  state.backupCron = cron.join(" ")
}

// 根据时间修改cron表达式
const updateCronByTime = (state, val) => {
  let cron = state.backupCron.split(" ")
  cron[0] = val.split(":")[2]
  cron[1] = val.split(":")[1]
  cron[2] = val.split(":")[0]
  state.backupCron = cron.join(" ")
}

export default defineComponent({
  components: {
    themeIcon,
    themeColor
  },
  setup() {
    const store = useStore()
    const { t } = useI18n()
    // 只取值，不做computed
    const state = reactive({
      style: store.state.app.theme.state.style,
      primaryColor: store.state.app.theme.state.primaryColor,
      menuType: store.state.app.theme.state.menuType,
      radioval: store.state.app.theme.state.radioval,
      sartTimeValue: '',
      endTimeValue: '',
      SignOutTime: store.state.app.theme.state.SignOutTime,
      BackupTime: '',
      selectBackup: '',
      backupCron: ''
    })
    getAllSystemParams(state)
    const themeColorArr = [
      { color: '#409eff', textColor: '#fff', tip: 'message.system.setting.primaryColor.blue' },
      { color: '#d60f20', textColor: '#fff', tip: 'message.system.setting.primaryColor.red' },
      { color: '#ac25e6', textColor: '#fff', tip: 'message.system.setting.primaryColor.violet' },
      { color: '#4dc86f', textColor: '#fff', tip: 'message.system.setting.primaryColor.green' },
      { color: '#13c2c2', textColor: '#fff', tip: 'message.system.setting.primaryColor.cyan' },
      { color: '#333', textColor: '#fff', tip: 'message.system.setting.primaryColor.black' }
    ]
    const setTheme = () => {
      const userTheme = style[state.style]
      const body = document.getElementsByTagName('body')[0]
      // 设置全局顶部body上的class名称，即为主题名称，便于自定义配置符合当前主题的样式统一入口
      body.className = state.style
      // 需要设置的颜色参照theme.scss，位置：assets/style/theme.scss
      // 设置主题色
      body.style.setProperty('--system-primary-color', state.primaryColor)
      for (let i in userTheme) {
        const item = userTheme[i]
        for (let y in item) {
          let cssVarName = '--system-' + i + '-' + y.replace(/([A-Z])/g, '-$1').toLowerCase()
          body.style.setProperty(cssVarName, item[y])
        }
      }
    }
    // 监听数据的变化
    watch(state, newVal => {
      const theme = {
        state: {
          ...state
        }
      }
      store.commit('app/stateChange', {
        name: 'theme',
        value: theme
      })
      setTheme()
    })

    const drawer = ref(false)
    const drawerChange = val => {
      drawer.value = val
    }
    // 模式选择
    const radioAry = ['人脸识别', '指纹识别']
    const handelRadioVal = e => {
      const params = {
        activeModel: e
      }
      updateActiveModel(params).then(res => {
        console.log(res)
      })
    }
    // 定时关机
    const handleEndTime = val => {
      val = val + ":00"
      state.endTimeValue = val
      const date = { endTime: val }
      updateEndTime(date).then(res => {
        console.log(res.msg)
      })
      .catch(err => {
        ElMessage({
          type: 'error',
          message: err.msg
        })
      })
    }
    // 定时开机
    const handleStartTime = val => {
      val = val + ":00"
      state.sartTimeValue = val
      const data = { startTime: val }
      updateStartTime(data)
      .then(res => {
        console.log(res.msg)
      })
      .catch(err => {
        ElMessage({
          type: 'error',
          message: err.msg
        })
      })
    }
    // 自动签退
    const timeOptions = [
      {
        id: 1,
        time: 1
      },
      {
        id: 2,
        time: 2
      },
      {
        id: 3,
        time: 3
      },{
        id: 4,
        time: 4
      },
      {
        id: 5,
        time: 5
      },
      {
        id: 6,
        time: 6
      }
    ]
    const handelSignTime = e => {
      const params = {
        exitTime: e
      }
      updateExitTime(params).then(res => {
        console.log(res)
      })
    }
    // 备份时间
    const BackupTimeOptions = reactive([
      {
        id: '1',
        name: '每日'
      },
      {
        id: '2',
        name: '每周'
      },
      {
        id: '3',
        name: '每月'
      }
    ])
    setTheme()
    // 自动备份定时任务
    const handleAutoBackUpTime = val => {
      // 修改cron
      val = val + ":00"
      state.BackupTime = val
      updateCronByTime(state, val)     
      const data = {
        backupTime: state.selectBackup + " " + state.BackupTime,
        backupCron: state.backupCron
      }
      updateBackUpTime(data)
      .then(res => {
        console.log(res)
      }).catch(err => {
        ElMessage({
          type: 'error',
          message: err.msg
        })
      })
    }
    // 自定备份定时任务【每日 每周 每月】
    const handleAutoBackUpDate = val => {
      updateCronByDate(state, val)
      state.selectBackup = val
      const data = {
        backupTime: state.selectBackup + " " + state.BackupTime,
        backupCron: state.backupCron
      }
      updateBackUpTime(data)
      .then(res => {
        console.log(res)
      }).catch(err => {
        ElMessage({
          type: "error",
          message: err.msg
        })
      })
    }
    // 立即备份按钮点击事件
    const backUpData = () => {
      ElMessageBox.confirm(
        '确定要立即备份吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
      .then(() => {
        backUpDateNow()
        .then(res => {
          ElMessage({
            type: 'success',
            message: res.msg
          })
        }).catch(err => {
          ElMessage({
            type: 'error',
            message: res.msg
          })
        })
      })
      .catch(() => {
        console.log("hello")
      }) 
    }
    const tims = '13:9:30'
    return {
      drawer,
      tims,
      state,
      style,
      radioAry,
      timeOptions,
      themeColorArr,
      BackupTimeOptions,
      backUpData,
      drawerChange,
      handleEndTime,
      handleStartTime,
      handleAutoBackUpTime,
      handleAutoBackUpDate,
      handelRadioVal,
      handelSignTime
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep .el-date-editor--time {
  font-size: 16px;
  .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  .el-input__icon {
    line-height: 40px;
  }
}
.radios {
  width: 223px;
  .el-radio-group {
    display: flex;
    justify-content: space-between;
  }
}
i {
  cursor: pointer;
  &:focus {
    outline: none;
  }
}

::v-deep.list {
  padding: 0 20px;
  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    span {
      font-size: 16px;
    }
    .el-select {
      width: 65%;
    }
    &-backups {
      width: 65%;
      display: flex;
      justify-content: flex-end;
      .m-2 {
        width: 40%;
      }
      .el-select {
        .el-input {
          width: 100%;
        }
      }
      .el-input {
        width: 60%;
      }
    }
    .el-button {
      width: 65%;
    }
  }
}
h3 {
  margin-top: 40px;
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  padding: 0 20px;
  &:first-child {
    margin-top: 0;
  }
}
.theme-box {
  text-align: left;
  padding-left: 20px;
}
.el-radio {
  margin-right: 0px;
}
.el-dropdown-link {
  margin-left: 10px;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--system-header-breadcrumb-text-color);
}
</style>
