function refundProcessStatus() {
  return [{
      text: '全部',
      value: null
    },{
      value: 88,//前端自定义88，待我处理字段handleBy
      text: '待我处理'
    },{
      value: 99,//前端自定义99，待他人处理字段handleByOther
      text: '待他人处理'
    },{
      value: 4,
      text: '已通过'
    },{
      value: -2,
      text: '未通过'
    },{
      value: -1,
      text: '已撤销'
    }
  ]
}
function feeType() {
  return [
    {
      text: '全部',
      value: null
    },{
      text: '代理费',
      value: 1
    },{
      text: '第三方费用',
      value: 2
    },{
      text: '官费',
      value: 3
    }
  ]
}
module.exports = {
  refundProcessStatus,
  feeType
}