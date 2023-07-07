function accountStatusList() {
  return [
    {
      text:'账号状态',
      value: null
    },
    {
      text:'全部',
      value: ''
    },
    {
      value:0,
      text:'启用'
    },
    {
      value: 1,
      text: '禁用'
    }
  ]
}
 
module.exports = {
  accountStatusList,
}