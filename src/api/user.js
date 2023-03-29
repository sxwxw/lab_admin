import request from '@/utils/system/request'

// const baseURL = 'http://180.76.157.232:8088/api'
const baseURL = 'http://localhost:8088/api'

// 登录api
export function loginApi(data) {
  return request({
    url: '/login',
    method: 'post',
    baseURL: baseURL + '/admin',
    data
  })
}

// 退出登录Api
export function loginOutApi() {
  return request({
    url: '/user/out',
    method: 'post',
    baseURL: '/mock'
  })
}

// 获取用户信息Api
export function getInfoApi(data) {
  return request({
    url: '/getCurrentAdmin',
    method: 'get',
    baseURL: baseURL + '/admin'
  })
}

// 根据名称获取用户类型
export function getUserTypeByName(data) {
  console.log(data)
  return request({
    url: '/getUserTypeByName',
    method: 'post',
    baseURL: baseURL + '/userType',
    data
  })
}

// 根据用户类型获取事由
export function getUserTypeTodo(data) {
  console.log(data)
  return request({
    url: '/getUserTypeTodo',
    method: 'post',
    baseURL: baseURL + '/todoList',
    data
  })
}
export function getAallUnit() {
  return request({
    url: '/getAllUnit',
    method: 'get',
    baseURL: baseURL + '/unit'
  })
}

// 添加单位addUnit
export function addUnit(data) {
  return request({
    url: '/addUnit',
    method: 'post',
    baseURL: baseURL + '/unit',
    data
  })
}

// 修改单位
export function updateUnit(data) {
  return request({
    url: '/updateUnit',
    method: 'post',
    baseURL: baseURL + '/unit',
    data
  })
}

// 获取所有用户类型
export function getAallUserType() {
  return request({
    url: '/getAllUserType',
    method: 'get',
    baseURL: baseURL + '/userType'
  })
}

// 添加用户类型
export function addUserType(data) {
  console.log(data)
  return request({
    url: '/addUserType',
    method: 'post',
    baseURL: baseURL + '/userType',
    data
  })
}

// 修改用户类型
export function updateUserType(data) {
  return request({
    url: '/updateUserType',
    method: 'post',
    baseURL: baseURL + '/userType',
    data
  })
}

// 获取所有课题组
export function getAallClass(id) {
  return request({
    url: '/getAllClassGroupById/' + id,
    method: 'get',
    baseURL: baseURL + '/classGroup'
  })
}

// 多条件查询课题组
export function queryClassGroupByCdt(data) {
  return request({
    url: '/queryClassGroupByCdt',
    method: 'post',
    baseURL: baseURL + '/classGroup',
    data
  })
}

// 新增课题组
export function addClassGroup(data) {
  return request({
    url: '/addClassGroup',
    method: 'post',
    baseURL: baseURL + '/classGroup',
    data
  })
}

// 修改课题组
export function updateClassGroup(data) {
  console.log(data)
  return request({
    url: '/updateClassGroup',
    method: 'post',
    baseURL: baseURL + '/classGroup',
    data
  })
}

// 人脸录入
export function registerFace(data) {
  console.log(data)
  return request({
    url: '/registerFace',
    method: 'post',
    baseURL: baseURL + '/user',
    data
  })
}

// base64人脸录入
export function registerUserFaceBase64(data) {
  console.log(data)
  return request({
    url: '/registerUserFaceBase64',
    method: 'post',
    baseURL: baseURL + '/user',
    data
  })
}

// 指纹录入
export function registerFinger(data) {
	return request({
		url: '/addFinger',
    method: 'post',
    baseURL: baseURL + '/finger',
    data
	})
}

// 指纹删除
export function deleteUserFinger(fingerId) {
  return request({
    url: '/deleteFingerId/' + fingerId,
    method: 'delete',
    baseURL: baseURL + '/finger'
  })
}
// 获取用户信息Api
export function passwordChange(data) {
  return request({
    url: '/user/passwordChange',
    method: 'post',
    baseURL: '/mock',
    data
  })
}

// 访问总人数getAllLabPerson
export function getAllLabPerson(data) {
  return request({
    url: 'getAllLabPerson',
    method: 'get',
    baseURL: baseURL + '/signLog',
    data
  })
}

// 签到总人数
export function getTodayAllPerson(data) {
  return request({
    url: 'getTodayAllPerson',
    method: 'get',
    baseURL: baseURL + '/signLog',
    data
  })
}

// 正在实验室人数
export function getTodayAllSigningPerson(data) {
  return request({
    url: 'getTodayAllSigningPerson',
    method: 'get',
    baseURL: baseURL + '/signLog',
    data
  })
}

// 今日已签退人数
export function getTodayAllSignOutPerson() {
  return request({
    url: 'getTodayAllSignOutPerson',
    method: 'get',
    baseURL: baseURL + '/signLog'
  })
}

// 根据单位类型获取单位
export function getAllUnitByType(data) {
  return request({
    url: 'getAllUnitByType',
    method: 'post',
    baseURL: baseURL + '/unit',
    data
  })
}

// 删除用户人脸信息
export function deleteUserFace(data) {
  return request({
    url: 'deleteUserFace',
    method: 'post',
    baseURL: baseURL + '/user',
    data
  })
}

// 导入用户
export function importUserExcel(data) {
  return request({
    url: 'importUserExcel',
    method: 'post',
    baseURL: baseURL + '/user',
    data
  })
}

// 删除用户类型
export function deleteUserTypeById(uid) {
  return request({
    url: 'deleteUserTypeById/' + uid,
    method: 'delete',
    baseURL: baseURL + '/userType'
  })
}

// 下载用户模板
export function getUserImportTemplate() {
  return request({
    url: 'getUserImportTemplate',
    method: 'get',
    baseURL: baseURL + '/user',
    responseType: 'blob'
  })
}

// 导入访客
export function importVisitorExcel(data) {
  return request({
    url: 'importVisitorExcel',
    method: 'post',
    baseURL: baseURL + '/user',
    data
  })
}

// 下载访客模板
export function getVisitorImportTemplate() {
  return request({
    url: 'getVisitorImportTemplate',
    method: 'get',
    baseURL: baseURL + '/user',
    responseType: 'blob'
  })
}
