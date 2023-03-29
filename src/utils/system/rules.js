export const realName = (rule, value, callback) => {
  //校验中文的正则：/^[\u4e00-\u9fa5]{0,}$/
  const re = /^[\u4e00-\u9fa5]+$/
  if (!value) {
    return callback(new Error('姓名不能为空'))
  }
  setTimeout(() => {
    if (re.test(value.trim())) {
      callback()
    } else {
      callback(new Error('请输入正确的姓名'))
    }
  }, 100)
}
export const checkEmail = (rule, value, callback) => {
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (value) {
    if (mailReg.test(value.trim())) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱格式'))
    }
  }
}

export const checkPhone = (rule, value, callback) => {
  const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
  if (value) {
    if (!Number.isInteger(+value.trim())) {
      callback(new Error('请输入数字值'))
    } else {
      if (phoneReg.test(value)) {
        callback()
      } else {
        callback(new Error('电话号码格式不正确'))
      }
    }
  }
}

export const companyNameC = (rule, value, callback) => {
  //校验中文的正则：/^[\u4e00-\u9fa5]{0,}$/
  const re = /^[\u4e00-\u9fa5]+$/
  if (!value) {
    return callback(new Error('单位名称不能为空'))
  }
  setTimeout(() => {
    if (re.test(value.trim())) {
      callback()
    } else {
      callback(new Error('请输入正确的单位名称'))
    }
  }, 100)
}

export const classGroup = (rule, value, callback) => {
  //校验中文的正则：/^[\u4e00-\u9fa5]{0,}$/
  const re = /^[\u4e00-\u9fa5]+$/
  if (!value) {
    return callback(new Error('课题组名称不能为空'))
  }
  setTimeout(() => {
    if (re.test(value.trim())) {
      callback()
    } else {
      callback(new Error('请输入正确的课题组名称'))
    }
  }, 100)
}
