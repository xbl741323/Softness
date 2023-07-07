// 订单类型
function orderTypeData() {
  return [{
      value: null,
      text: '全部订单'
    },
    {
      value: 1,
      text: '项目申报'
    },
    {
      value: 2,
      text: '知识产权'
    },
    {
      value: 3,
      text: '专利'
    },
    {
      value: 4,
      text: '版权'
    },
    {
      value: 5,
      text: '商标'
    },
    {
      value: 6,
      text: '其他'
    },
    {
      value: 7,
      text: '工商注册'
    },
    {
      value: 8,
      text: '财税服务'
    },
    {
      value: 9,
      text: '融资上市'
    },
    {
      value: 10,
      text: '法律服务'
    },
    {
      value: 11,
      text: '软件开发'
    }
  ]
}

function changePriceData() {
  return [{
      value: null,
      text: '全部订单'
    },
    {
      value: 1,
      text: '产品订单'
    },
    {
      value: 2,
      text: '课程订单'
    },
    {
      value: 3,
      text: '课程会员订单'
    },
  ]
}
//审核状态
function typeData() {
  return [{
      text: '全部',
      value: ""
    },
    {
      value: 0,
      text: '待审核'
    },
    {
      value: 1,
      text: '已通过'
    },
    {
      value: 2,
      text: '未通过'
    },
  ]
}

function changetypeData() {
  return [{
      text: '全部',
      value: ""
    },
    {
      value: 1,
      text: '待审核'
    },
    {
      value: 2,
      text: '已通过'
    },
    {
      value: 3,
      text: '未通过'
    },
  ]
}

function changePrimary() {
  return [{
      text: '全部',
      value: null
    },
    {
      value: 0,
      text: '待审核'
    },
    {
      value: 1,
      text: '已通过'
    },
    {
      value: 2,
      text: '未通过'
    },
  ]
}
module.exports = {
  changePrimary,
  orderTypeData,
  typeData,
  changePriceData,
  changetypeData
}