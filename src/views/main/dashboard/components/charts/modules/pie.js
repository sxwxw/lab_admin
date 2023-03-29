const option = {
  title: {
    text: '本周各单位访问人数',
    top: 10
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    type: 'scroll',
    bottom: 10
  },
  series: [
    {
      type: 'pie',
      data: [
        {
          value: 104,
          name: '检测单位'
        },
        {
          value: 204,
          name: '科研单位'
        },
        {
          value: 304,
          name: '后勤单位'
        },
        {
          value: 204,
          name: '人事单位'
        },
        {
          value: 500,
          name: '化验单位'
        },
        {
          value: 524,
          name: '教学单位'
        }
      ],
      roseType: 'area'
    }
  ]
}

export default option
