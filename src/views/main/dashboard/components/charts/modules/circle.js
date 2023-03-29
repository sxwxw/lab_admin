const option = {
  title: {
    text: '本周各课题组访问人数',
    top: 10,
    left: 10
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 10
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '26',
          fontWeight: 'bold',
          formatter: p => {
            let dom = `<div backgroundColor="red">1</div>`
            return p.name + '\n' + p.value
          }
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 20, name: '材料检测课题组' },
        { value: 25, name: '动物检测课题组' },
        { value: 30, name: '动物解剖课题组' },
        { value: 35, name: '动物临床实验课题组' },
        { value: 26, name: '后勤管理课题组' },
        { value: 28, name: '教师管理课题组' },
        { value: 27, name: '动物化验课题组' },
        { value: 24, name: '化学用品化验课题组' },
        { value: 35, name: '生物教学研究课题组' },
        { value: 32, name: '化学教学研究课题组' },
        { value: 24, name: '药学教学研究课题组' },
        { value: 28, name: '党员管理课题组' }
      ]
    }
  ]
}

export default option
