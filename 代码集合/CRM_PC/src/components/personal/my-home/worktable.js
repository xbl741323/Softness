
// menuList  快捷入口
export const menuList = [
  {
    imgUrl: require("@/assets/images/my-home/icon-wodefabu@2x.png"),
    title: "我的发布",
    status: true,
    path: '/personal/myPublish',
    Privilege:{
      bt_page_policy_my:true
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-woderizhi@2x.png"),
    title: "我的日志",
    status: true,
    path: '/personal/my-log/index',
    Privilege:{
      bt_page_journal_my:true,
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-wodeyonghu@2x.png"),
    title: "我的用户",
    status: true,
    path: '/personal/my-users',
    Privilege:{
      	bt_user_my_flag:true
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-wodexiansuo@2x.png"),
    title: "我的线索",
    status: true,
    path: '/personal/customer/my-clue',
    Privilege:{
      bt_clue_my_flag:true
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-wodekehu@2x.png"),
    title: "我的客户",
    status: true,
    path: '/personal/customer/my-client',
    Privilege:{
      bt_customer_my_flag:true,
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-wodehetong@2x.png"),
    title: "我的合同",
    status: true,
    path: '/personal/my-contracts',
    Privilege:{
      bt_contract_my_flag:true,
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-wodeliucheng@2x.png"),
    title: "我的流程",
    status: true,
    path: '/personal/my-process',
    Privilege:{
      bt_process_my_flag:true,
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-wodedingdan@2x.png"),
    title: "我的订单",
    status: true,
    path: '/personal/personal-order',
    Privilege:{
      bt_order_product_my:true,
      bt_order_course_my:true,
      bt_order_courseVip_my:true,
      bt_order_init_my:true,
      }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-woderenwu@2x.png"),
    title: "我的任务",
    status: true,
    path: '/personal/my-task',
    Privilege:{
      bt_task_my_flag:true
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-wodehuikuan@2x.png"),
    title: "我的回款",
    status: true,
    path: '/personal/my-receive',
    Privilege:{
      bt_receive_my_flag:true,
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-wodehuikuan@2x.png"),
    title: "我的工资条",
    status: true,
    path: '/personal/my-salary',
    Privilege:{
      bt_salary_flag:true,
    },
  },
]

export const taskStatusList = [
  {
    label: "全部",
    count: 0,
    taskStatus: 'null',
  },
  {
    label: "待开始",
    count: 0,
    taskStatus: '0',
  },
  {
    label: "进行中",
    count: 0,
    taskStatus: '1',
    startCount: 0,
  },
  {
    label: "已暂停",
    count: 0,
    taskStatus: '-1',
  },
  {
    label: "已完成",
    count: 0,
    taskStatus: '2',
  },
  {
    label: "已关闭",
    count: 0,
    taskStatus: '-2',
  },
]
// imgList 工具箱
export const   imgList = [
  {
    imgUrl: require("@/assets/images/my-home/icon-chaxun@2x.png"),
    title: "查询客户",
    status: true,
    showNum:0,
    Privilege:{
      bt_get_clue_flag:true,
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-chaxunanli@2x.png"),
    title: "查询案例",
    status: true,
    showNum:1,
    Privilege:{
      bt_get_case_flag:true,
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-chuangjianxiansuo@2x.png"),
    title: "创建线索",
    status: true,
    showNum:2,
    Privilege:{
      bt_add_clue_flag:true,
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-luruhetong@2x.png"),
    title: "录入合同",
    status: true,
    showNum:3,
    Privilege:{
      bt_enter_contract_flag:true,
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-tianxierizhi@2x.png"),
    title: "填写日志",
    status: true,
    showNum:4,
    Privilege:{
      bt_get_journal_flag:true,
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-returned-money@2x.png"),
    title: "领取回款",
    status: true,
    showNum:5,
    Privilege:{
      bt_receive_amount_flag:true,
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-tianxierizhi@2x.png"),
    title: "陌拜记录",
    status: true,
    showNum:6,
    Privilege:{
      bt_allot_visit_flag:true,
    }
  }
]