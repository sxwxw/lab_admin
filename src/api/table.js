import request from '@/utils/system/request'

// const baseURL = 'http://180.76.157.232:8088/api'
const baseURL = 'http://localhost:8088/api'
// 多条件获取数据
export function selectAllUser(data) {
  return request({
    url: '/selectAllUser',
    method: 'POST',
    baseURL: baseURL + '/user',
    data
  })
}

// 修改用户激活状态
export function updateUserIsActive(data) {
  return request({
    url: '/updateUserIsActive',
    method: 'post',
    baseURL: baseURL + '/user',
    data
  })
}

// 新增用户
export function addUser(data) {
  console.log(data)
  return request({
    url: '/addUser',
    method: 'post',
    baseURL: baseURL + '/user',
    data
  })
}

// 编辑用户
export function updateUser(data) {
  return request({
    url: '/updateUser',
    method: 'post',
    baseURL: baseURL + '/user',
    data
  })
}

// 新增访客
export function addVisitor(data) {
  return request({
    url: '/addVisitor',
    method: 'post',
    baseURL: baseURL + '/user',
    data
  })
}

// 编辑访客
export function updateVisitor(data) {
  console.log(data)
  return request({
    url: '/updateVisitor',
    method: 'post',
    baseURL: baseURL + '/user',
    data
  })
}

// 删除访客或用户
export function del(data) {
  if (data.userType === '访客') {
    return request({
      url: '/deleteVisitor',
      method: 'Delete',
      baseURL: baseURL + '/user',
      data
    })
  } else {
    return request({
      url: '/deleteUser',
      method: 'Delete',
      baseURL: baseURL + '/user',
      data
    })
  }
}

//获取某天签到表
export function queryTodaySignLog(data) {
  return request({
    url: '/queryTodaySignLog',
    method: 'post',
    baseURL: baseURL + '/signLog',
    data
  })
}

// 多条件筛选单位
export function getAllUnitByCdt(data) {
  console.log(data)
  return request({
    url: '/getAllUnitByCdt',
    method: 'post',
    baseURL: baseURL + '/unit',
    data
  })
}

// 多条件筛选签到
export function querySignLogByCdt(data) {
  delete data.todoSelect
  return request({
    url: '/querySignLogByCdt',
    method: 'post',
    baseURL: baseURL + '/signLog',
    data
  })
}

// 导出签到表
export function exportSignLog(data) {
  return request({
    url: '/exportSignLog',
    method: 'post',
    baseURL: baseURL + '/signLog',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

// 获取全部事由
export function getAllTodo(data) {
  console.log(data)
  return request({
    url: '/getAllTodo?' + 'pageNo=' + data.pageNo + '&pageSize=' + data.pageSize + '&search=' + data.search,
    method: 'get',
    baseURL: baseURL + '/todoList'
  })
}

// 新增事由
export function addTodo(data) {
  return request({
    url: '/addTodo',
    method: 'post',
    baseURL: baseURL + '/todoList',
    data
  })
}

// 编辑事由
export function updateTodo(data) {
  return request({
    url: '/updateTodo',
    method: 'post',
    baseURL: baseURL + '/todoList',
    data
  })
}

// 删除事由
export function deleteTodo(data) {
  return request({
    url: '/deleteTodo',
    method: 'post',
    baseURL: baseURL + '/todoList',
    data
  })
}

// 删除单位
export function deleteUnitById(uid) {
  return request({
    url: '/deleteUnitById/' + uid,
    method: 'Delete',
    baseURL: baseURL + '/unit'
  })
}

// 删除课题组url: /deleteClassGroupById/{cid}
export function deleteClassGroupById(cid) {
  console.log(cid)
  return request({
    url: '/deleteClassGroupById/' + cid,
    method: 'Delete',
    baseURL: baseURL + '/classGroup'
  })
}

// 导出课题组 /classGroup/ExportClassGroupExcel
export function ExportClassGroupExcel(data) {
  return request({
    url: '/ExportClassGroupExcel',
    method: 'post',
    baseURL: baseURL + '/classGroup',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}
