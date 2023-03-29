import request from '@/utils/system/request'

// 获取数据api
export function getData(data) {
  return request({
    url: '/selectAllUser',
    method: 'POST',
    baseURL: 'http://localhost:8088/api/user',
    data
  })
}

// 修改用户激活状态
export function changeActiveApi(data) {
  return request({
    url: '/updateUserIsActive',
    method: 'post',
    baseURL: 'http://localhost:8088/api/user',
    data
  })
}

// 获取分类数据
export function getCategory(data) {
  return request({
    url: '/table/category',
    method: 'post',
    baseURL: '/mock',
    data
  })
}

// 获取树组织数据
export function getTree(data) {
  return request({
    url: '/table/tree',
    method: 'post',
    baseURL: '/mock',
    data
  })
}

// 新增
export function add(data) {
  return request({
    url: '/table/add',
    method: 'post',
    baseURL: '/mock',
    data
  })
}

// 编辑
export function update(data) {
  return request({
    url: '/user/deleteUser',
    method: 'post',
    baseURL: '/mock',
    data
  })
}

// 删除
export function del(data) {
  if (data.userType === '访客') {
    return request({
      url: '/deleteVisitor',
      method: 'Delete',
      baseURL: 'http://localhost:8088/api/user',
      data
    })
  } else {
    return request({
      url: '/deleteUser',
      method: 'Delete',
      baseURL: 'http://localhost:8088/api/user',
      data
    })
  }
}
