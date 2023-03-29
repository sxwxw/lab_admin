import request from '@/utils/system/request'

// const baseURL = 'http://180.76.157.232:8088/api'
const baseURL = 'http://localhost:8088/api'

// 修改签到模式（0 代表人脸识别， 1代表指纹识别）
export function updateActiveModel(data) {
  return request({
    url: '/updateActiveModel',
    method: 'POST',
    baseURL: baseURL + '/systemParams',
    data
  })
}

// 自动关机/updateEndTime
export function updateEndTime(data) {
  console.log(data)
  return request({
    url: '/updateEndTime',
    method: 'POST',
    baseURL: baseURL + '/systemParams',
    data
  })
}

// 签退时间/systemParams/updateExitTime
export function updateExitTime(data) {
  console.log(data)
  return request({
    url: '/updateExitTime',
    method: 'POST',
    baseURL: baseURL + '/systemParams',
    data
  })
}

// 设置自动开机时间
export function updateStartTime(data) {
  return request({
    url: '/updateStartTime',
    method: 'POST',
    baseURL: baseURL + '/systemParams',
    data
  })
}

// 立即备份
export function backUpDateNow() {
  return request({
    url: '/backUpData',
    method: 'GET',
    baseURL: baseURL + '/systemParams'
  })
}

// 获取系统配置参数
export function getSystemParams() {
  return request({
    url: '/getAllSystemParams',
    method: 'GET',
    baseURL: baseURL + '/systemParams'
  })
}

// 设置自动备份时间
export function updateBackUpTime(data){
  return request({
    url: '/updateBackUpTime',
    method: 'POST',
    baseURL: baseURL + '/systemParams',
    data
  })
}