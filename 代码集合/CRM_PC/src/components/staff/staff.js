export function sex(val) {
  return val == 0 ? '女' : val == 1 ? '男' : '/';
}

export function status(val) {
  return val == 1 ? '试用' : val == 2 ? '正式' : val == 3 ? '实习' :'/';
}

export const sexList = [
  {
    value: 0,
    label: '女'
  },{
    value: 1,
    label: '男'
  }
]

export const statusList = [
  {
    value: 1,
    label: '试用'
  },
  {
    value: 2,
    label: '正式'
  },
  {
    value: 3,
    label: '实习'
  }
]

export const credentialsTypeList = [
  {
    value: 1,
    label: '居民身份证'
  }
]

export function education(val) {
  return val == 1 ? '专科' : val == 2 ? '本科' : val == 3 ? '硕士' : val == 4 ? '博士' : val == 5 ? '其他' : '/';
}

export const educationOptions = [
  {
    label: '专科',
    value: 1
  }, 
  {
    label: '本科',
    value: 2
  }, 
  {
    label: '硕士',
    value: 3
  }, 
  {
    label: '博士',
    value: 4
  }, 
  {
    label: '其他',
    value: 5
  }, 
]
