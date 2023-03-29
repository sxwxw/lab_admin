<template>
  <div class="card-list">
    <Row v-for="row in list" :key="row.id" :row="row" />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import Row from './row.vue'
import { getAllLabPerson, getTodayAllPerson, getTodayAllSigningPerson, getTodayAllSignOutPerson } from '@/api/user'
export default defineComponent({
  components: {
    Row
  },
  setup() {
    // 获取访问总人数
    const AllLabPerson = ref('')
    getAllLabPerson().then(res => {
      AllLabPerson.value = res.data
    })
    // 获取签到总人数
    const TodayAllPerson = ref('')
    getTodayAllPerson().then(res => {
      TodayAllPerson.value = res.data.total_num
    })
    // 获取正在实验室总人数
    const AllSigningPerson = ref('')
    getTodayAllSigningPerson().then(res => {
      AllSigningPerson.value = res.data.total_signing_num
    })
    // 今日已签退人数
    const TodayAllSignOutPerson = ref('')
    getTodayAllSignOutPerson().then(res => {
      TodayAllSignOutPerson.value = res.data.total_signOut_num
    })
    const list = [
      { id: 1, name: '实验室访问总人数', data: AllLabPerson, color: '#4e73df', icon: 'sfont system-yonghu' },
      { id: 2, name: '今日签到人数', data: TodayAllPerson, color: '#1cc88a', icon: 'sfont system-xiaoxi' },
      { id: 3, name: '当前在室人数', data: AllSigningPerson, color: '#36b9cc', icon: 'sfont system-shuliang_mianxing' },
      { id: 4, name: '今日签退人数', data: TodayAllSignOutPerson, color: '#f6c23e', icon: 'sfont system-jindutiaoshouyidaozhang' }
    ]
    return {
      list
    }
  }
})
</script>

<style lang="scss" scoped>
.card-list {
  width: calc(100% + 20px);
  margin-left: -10px;
  display: flex;
  flex-wrap: wrap;
}
</style>
