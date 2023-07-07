// 订单类型
function getOrderType() {
  return [{
      text: '全部类型',
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

// 合作机构订单类型
function getOrderTypePartner() {
  return [{
      text: '全部类型',
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
      text: '工商财税',
      value: 7
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

// 订单状态
function getOrderStatus() {
  return [{
      text: '全部状态',
      value: null
    },
    {
      text: '待签约',
      value: 1,
    },
    {
      text: '待付款',
      value: 0,
    },
    {
      text: '待开始',
      value: 2,
    },
    {
      text: '进行中',
      value: 3,
    },
    {
      text: '已完成',
      value: 4,
    },
    {
      text: '已关闭',
      value: 5,
    },
    {
      text: '已取消',
      value: 6,
    },
  ]
}
// 待生效订单状态
function getWaitOrderStatus() {
  return [{
      text: '全部状态',
      value: null
    },
    {
      text: '草稿',
      value: -2,
    },
    {
      text: '待审核',
      value: -4,
    },
    {
      text: '未通过',
      value: -5,
    },
  ]
}

// 会员订单状态
function getMemberOrderStatus() {
  return [{
      text: '全部状态',
      value: null
    },
    {
      text: '待付款',
      value: 0,
    },
    {
      text: '待生效',
      value: 2,
    },
    {
      text: '已生效',
      value: 1,
    },
    {
      text: '已到期',
      value: 3,
    },
  ]
}

// 课程订单状态
function getCourseOrderStatus() {
  return [{
      text: '全部状态',
      value: null
    },
    {
      text: '待付款',
      value: 0,
    },
    {
      text: '已付款',
      value: 2,
    },
    {
      text: '已取消',
      value: 4,
    },
    {
      text: '已删除',
      value: 1,
    },
  ]
}

// 订单尾款状态
function getTailStatus() {
  return [{
      text: '全部尾款',
      value: null
    },
    {
      text: '待定',
      value: 0,
    },
    {
      text: '待付款',
      value: 1,
    },
    {
      text: '已结清',
      value: 2,
    },
    {
      text: '无',
      value: 3,
    }
  ]
}
// 待生效订单尾款状态
function getWaitTailStatus() {
  return [{
      text: '全部尾款',
      value: null
    },
    {
      text: '待定',
      value: 0,
    },
    {
      text: '待付款',
      value: 1,
    },
    {
      text: '无',
      value: 2,
    }
  ]
}

// 获取规格属性数据
function getAttributeList(attributeList) {
  if (attributeList.length > 1) {
    return [
      attributeList[0][Object.keys(attributeList[0])],
      attributeList[1][Object.keys(attributeList[1])]
    ]
  } else {
    return [attributeList[0][Object.keys(attributeList[0])]]
  }
}

// 规格属性筛选值lebel
function getAttributeLabel(AttributeList, skuIndex) {
  var arrOne = []
  var arrTwo = []
  arrOne = AttributeList[0]
  var skuIndexList = skuIndex.split('_')
  if (skuIndexList.length > 1) {
    arrTwo = AttributeList[1]
    return [arrOne[parseInt(skuIndexList[0])], arrTwo[parseInt(skuIndexList[1])]].join('+')
  } else {
    return arrOne[parseInt(skuIndexList[0])]
  }
}

// 任务状态筛选

function filterTaskStatus(value) {
  return value == 0 ? '待开始' : value == 1 ? '进行中' : value == 2 ? '已完成' : value == -1 ? '已暂停' : value == -2 ? '已关闭' : ''
}

// 订单/产品类型
function category(value) {
  return value == 1 ? '项目申报' : value == 2 ? '知识产权' : value == 3 ? '专利' : value == 4 ? '版权' : value == 5 ? '商标' : value == 6 ? '其他' : value == 7 ? '工商注册' : value == 8 ? '财税服务' : value == 9 ? '融资上市' : value == 10 ? '法律服务' : value == 11 ? '软件开发' : ''
}

function getPatternOfPayment() {
  return [{
      text: '费用类型',
      value: null
    },
    {
      text: '代理费',
      value: 1
    },
    {
      text: '第三方费用',
      value: 2
    },
    {
      text: '服务费',
      value: 3
    },

  ]
}

function getTypeOfExpense() {
  return [{
      text: '支付方式',
      value: null
    },
    {
      text: '支付宝',
      value: 0
    },
    {
      text: '对公转账',
      value: 1
    },
    {
      text: '微信',
      value: 2
    },

  ]
}

function getTaskOrderType() {
  return [{
      id: 10,
      text: '全部'
    },
    {
      id: 0,
      text: '待开始'
    },
    {
      id: 1,
      text: '进行中',
      children: []
    },
    {
      id: -1,
      text: '已暂停',
    },
    {
      id: 2,
      text: '已完成',
      children: [{
          id: 1,
          text: '全部',
        }, {
          id: 2,
          text: '已完成',
        },
        {
          id: 3,
          text: '已完成（通过）',
        },
        {
          id: 4,
          text: '已完成(未通过）',
        },
      ]
    },
    {
      id: -2,
      text: '已关闭',
    },
  ]
}

function getTaskOrderLsti() {
  return [{
      id: 10,
      text: '全部'
    },
    {
      id: 0,
      text: '待开始'
    },
    {
      id: 1,
      text: '进行中',
      children: []
    },
    {
      id: -1,
      text: '已暂停',
    },
    {
      id: 2,
      text: '已完成',
      children: [{
          id: -1,
          text: '',
        },
        {
          id: -1,
          text: '已完成',
        },
        {
          id: -1,
          text: '已完成(通过）',
        },
      ]
    },
    {
      id: -2,
      text: '已关闭',
    },
  ]
}

function getDirectionOfReceive() {
  return [{
      text: '回款去向',
      value: null
    },
    {
      text: '全部',
      value: 0
    },
    {
      text: '上海恩凡知识产权代理有限公司',
      value: 1
    },
    {
      text: '卧涛科技有限公司',
      value: 2
    }
  ]
}

function arrToObj(type, arr) {
  if (wx.getStorageSync('userInfo').authorities) {
    let permissions = wx.getStorageSync('userInfo').authorities
    let obj = {
      certainly: true
    }
    permissions.forEach(item => {
      obj[item.authority] = true
    })
    return obj
  } else {
    return {}
  }
}

function filterPer(imgList) {
  if (Object.keys(arrToObj()).length == 0) return []
    let arr = imgList.filter(item=>Object.keys(item.Privilege).some(el => {
      if(Object.keys(item.Privilege).length > 1){
        let keyList = Object.keys(item.Privilege).filter(element => {
          Object.keys(arrToObj()).indexOf(element) > -1;
        });
        return keyList
      }else{
        return Object.keys(arrToObj()).includes(el)
      }
    })
  )
  return arr;
}

function workList() {
  return [{
      imgUrl: "../../image/index/icon_creation@2x.png",
      title: "我的线索",
      path: "/personal/pages/my-clue/list/list",
      Privilege: {
        bt_clue_my_flag: true
      }
    }, {
      imgUrl: "../../image/index/icon_see_about@2x.png",
      title: "我的用户",
      path: "/personal/pages/my-user/list/list",
      Privilege: {
        bt_user_my_flag: true,
      }
    }, {
      imgUrl: "../../image/index/icon_flow_path@2x.png",
      title: "我的流程",
      path: "/personal/pages/my-process/list/list",
      Privilege: {
        bt_process_my_flag: true,
      }
    },
    {
      imgUrl: "../../image/index/icon_order_form@2x.png",
      title: "我的订单",
      path: "/personal/pages/my-order/list/list",
      Privilege: {
        bt_order_my_flag: true,
      }
    },
    {
      imgUrl: "../../image/index/icon_my_task@2x.png",
      title: "我的任务",
      path: "/personal/pages/my-task/list/list",
      Privilege: {
        bt_task_my_flag: true
      }
    },
    {
      imgUrl: "../../image/index/icon_my_contract@2x.png",
      title: "我的合同",
      path: "/personal/pages/my-contract/list/index",
      Privilege: {
        bt_contract_my_flag: true,
      }
    }, {
      imgUrl: "../../image/index/icon_my_thread@2x.png",
      title: "我的回款",
      path: "/personal/pages/my-collection/home/home",
      Privilege: {
        bt_receive_my_flag: true
      }
    }, {
      imgUrl: "../../image/index/icon_region@2x.png",
      title: "地区公海",
      path: `/personal/pages/my-seas/seas-region/seas-region?highSeasType=${1}`,
      Privilege: {
        bt_page_sector_seas: true
      }
    }, {
      imgUrl: "../../image/index/icon_group@2x.png",
      title: "集团公海",
      path: `/personal/pages/my-seas/seas-region/seas-region?highSeasType=${2}`,
      Privilege: {
        bt_page_group_seas: true
      }
    }
  ]
}

function heZhuoList() {
  return [{
      imgUrl: "../../image/index/icon_creation@2x.png",
      title: "我的线索",
      path: "/personal/pages/my-clue/list/list",
      Privilege: {
        bt_clue_my_flag: true
      }
    }, {
      imgUrl: "../../image/index/icon_order_form@2x.png",
      title: "我的订单",
      path: "/personal/pages/my-order/list/list",
      Privilege: {
        bt_order_product_my: true,
        bt_order_course_my: true,
        bt_order_courseVip_my: true,
        bt_order_init_my: true,
      }
    }, {
      imgUrl: "../../image/index/icon_see_about@2x.png",
      title: "我的用户",
      path: "/personal/pages/my-user/list/list",
      Privilege: {
        bt_user_my_flag: true
      }
    },
    {
      imgUrl: "../../image/index/icon_my_task@2x.png",
      title: "我的任务",
      path: "/personal/pages/my-task/list/list",
      Privilege: {
        bt_task_my_flag: true
      }
    }
  ]
}

function swiprList() {
  return [{
      imgUrl: "../../image/index/jpg-chaxunkehu@2x.png",
      path: "/personal/pages/customer/search-list/search-list",
      permisson: {
        label: 'bt_get_clue_flag',
        value: true
      }
    },
    {
      imgUrl: "../../image/index/jpg-chaxundingdan@2x.png",
      path: "/personal/pages/order/search-order",
      permisson: {
        label: 'bt_get_case_flag',
        value: true
      }
    },
    {
      imgUrl: "../../image/index/jpg-jianmianbaifang@2x.png",
      path: "/additional/pages/meet-visit/meet-visit",
      permisson: {
        label: 'bt_clue_meet_flag',
        value: false
      }
    },
    {
      imgUrl: "../../image/index/jpg-diarykeeping@2x.png",
      path: "/personal/pages/my-blogs/blogs-details/index?homeClick=true",
      permisson: {
        label: 'bt_get_journal_flag',
        value: false
      }
    },
  ]
}
module.exports = {
  arrToObj,
  heZhuoList,
  swiprList,
  workList,
  filterPer,
  getTaskOrderLsti,
  getTaskOrderType,
  getOrderType,
  getOrderStatus,
  getWaitOrderStatus,
  getTailStatus,
  getAttributeList,
  getAttributeLabel,
  getMemberOrderStatus,
  getCourseOrderStatus,
  getWaitTailStatus,
  filterTaskStatus,
  category,
  getPatternOfPayment,
  getTypeOfExpense,
  getDirectionOfReceive,
  getOrderTypePartner
}