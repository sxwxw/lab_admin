export const cheackName = (rule, value, callback) => {
  //校验中文的正则：/^[\u4e00-\u9fa5]{0,}$/
  if (!value) {
    callback(new Error('姓名不能为空'))
    return
  }
  const re = /^[\u4e00-\u9fa5]+$/
  if (!re.test(value)) {
    callback(new Error('输入的姓名错误'))
    return
  } else {
    return callback()
  }
}

export const checkEmail = (rule, value, callback) => {
  if (!value) {
    callback()
  }
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (!mailReg.test(value)) {
    callback(new Error('输入的邮箱错误'))
    return
  } else {
    callback()
  }
}

export const checkPhone = (rule, value, callback) => {
  if (!value) {
    callback()
  }
  const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
  if (!phoneReg.test(value)) {
    callback(new Error('输入的电话错误'))
    return
  } else {
    callback()
  }
}

export const companySelect = (rule, value, callback) => {
  //校验中文的正则：/^[\u4e00-\u9fa5]{0,}$/
  if (!value) {
    callback(new Error('单位名称不能为空'))
    return
  } else {
    callback()
  }
}

export const classGroupSelect = (rule, value, callback) => {
  //校验中文的正则：/^[\u4e00-\u9fa5]{0,}$/
  if (!value) {
    callback(new Error('课题组名称不能为空'))
    return
  } else {
    callback()
  }
}

export const userTypeSelect = (rule, value, callback) => {
  //校验中文的正则：/^[\u4e00-\u9fa5]{0,}$/
  if (!value) {
    callback(new Error('用户类型不能为空'))
    return
  } else {
    callback()
  }
}
