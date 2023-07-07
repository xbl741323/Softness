function contractStatus(el) {
  return el == -1 ? '草稿' : el == 0 ? '待审核' : el == 1 ? '审核通过' : el == 2 ? '审核不通过' : '';
}

// 订单类型
function getOrderType() {
  return [{
      text: '全部订单',
      value: null
    },
    {
      text: '项目申报',
      value: 1
    },
    {
      text: '知识产权',
      value: 2
    },
    {
      text: '工商注册',
      value: 7
    },
    {
      text: '财税服务',
      value: 8
    },
    {
      text: '融资上市',
      value: 9
    },
    {
      text: '法律服务',
      value: 10
    },
    {
      text: '软件开发',
      value: 11
    },
  ]
}
 
function elecContractStatus() {
  return [
    {
      text:'合同状态',
      value: null
    },
    {
      text:'已签约',
      value: 0
    }
  ]
}

function contractStatusList() {
  return [
    {
      text:'合同状态',
      value: null
    },
    {
      value:-1,
      text:'草稿'
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
  contractStatus,
  contractStatusList,
  getOrderType,
  elecContractStatus
}