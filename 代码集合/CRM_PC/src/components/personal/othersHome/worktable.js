// menuList  快捷入口
export const menuList = [
  {
    imgUrl: require("@/assets/images/my-home/icon-wodeyonghu@2x.png"),
    title: "我的用户",
    status: true,
    path:'/personal/my-users',
    Privilege:{
      bt_user_my_flag:true
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-wodexiansuo@2x.png"),
    title: "我的线索",
    status: true,
    path:'/personal/customer/my-clue',
    Privilege:{
      bt_clue_my_flag:true
    }
  },
  {
    imgUrl: require("@/assets/images/my-home/icon-woderenwu@2x.png"),
    title: "我的任务",
    status: true,
    path:'/personal/my-task',
    Privilege:{
      bt_task_my_flag:true
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
]
// imgList 工具箱
export const  imgList =  [
  {
    imgUrl: require("@/assets/images/my-home/icon-chuangjianxiansuo@2x.png"),
    title: "创建线索",
    status: true,
    showNum:0,
    Privilege:{
      bt_add_clue_flag:true,
    }
  }
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

