const staffStatus = [
  {
    label: '全部',
    value: ''
  }, {
    label: '试用',
    value: '1'
  },
  {
    label: '正式',
    value: '2'
  },
  {
    label: '实习',
    value: '3'
  }
]
const accountStatus = [
  {
    label: '全部',
    value: null
  }, {
    label: '正常',
    value: '0'
  },
  {
    label: '禁用',
    value: '9'
  }
]

const officalStatus = [{
  label: '全部',
  value: ''
}, {
  label: '已关注',
  value: '1'
}, {
  label: '未关注',
  value: '0'
}]

const sexList = [{
  label: '男',
  value: '1'
}, {
  label: '女',
  value: '0'
}]

export default {
  staffStatus,
  accountStatus,
  officalStatus,
  sexList
}