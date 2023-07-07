import Layout from "@/page/index/";
import {
  Tag
} from "element-ui";
export default [{
    path: "/login",
    name: "登录页",
    component: () =>
      import( /* webpackChunkName: "page" */ "@/page/login/index"),
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/wel",
    component: Layout,
    redirect: "/wel/index",
    children: [{
      path: "index",
      name: "工作台",
      component: () =>
        import( /* webpackChunkName: "views" */ "@/views/personal/myHome")
    }]
  },
  {
    path: "/personal",
    component: Layout,
    redirect: "/personal/myHome",
    children: [{
      path: "myHome",
      name: localStorage.getItem("globalLabel") ?
        localStorage.getItem("globalLabel") : "工作台",
      component: () =>
        import( /* webpackChunkName: "views" */ "@/views/personal/myHome")
    }]
  },
  {
    path: "/lock",
    name: "锁屏页",
    component: () => import( /* webpackChunkName: "page" */ "@/page/lock/index"),
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/404",
    component: () =>
      import( /* webpackChunkName: "page" */ "@/components/error-page/404"),
    name: "404",
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: true
    }
  },
  {
    path: "/403",
    component: () =>
      import( /* webpackChunkName: "page" */ "@/components/error-page/403"),
    name: "403",
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/500",
    component: () =>
      import( /* webpackChunkName: "page" */ "@/components/error-page/500"),
    name: "500",
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/",
    name: "主页",
    redirect: "/wel"
  },
  {
    path: "/myiframe",
    component: Layout,
    redirect: "/myiframe",
    children: [{
      path: ":routerPath",
      name: "iframe",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/components/iframe/main"),
      props: true
    }]
  },
  {
    path: "*",
    redirect: "/404"
  },
  {
    path: "/wechatcode",
    name: "微信登录",
    component: () =>
      import( /* webpackChunkName: "page" */ "@/page/login/wechatcode"),
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/wechatlogin",
    name: "微信登录",
    component: () =>
      import( /* webpackChunkName: "page" */ "@/page/login/wechatLogin"),
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/authredirect",
    name: "授权页",
    component: () =>
      import( /* webpackChunkName: "page" */ "@/page/login/authredirect"),
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/init-order",
    component: Layout,
    redirect: "@/components/order/init-order",
    children: [{
      path: "/init-order",
      name: "发起订单",
      component: () => import("@/components/order/init-order.vue"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  }, {
    path: "/launch-approve",
    component: Layout,
    redirect: "@/components/clue/launch-approve",
    children: [{
      path: "/launch-approve",
      name: "发起认证",
      component: () => import("@/components/clue/launch-approve.vue"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  }, {
    path: "/launch-accredit",
    component: Layout,
    redirect: "@/components/clue/launch-accredit",
    children: [{
      path: "/launch-accredit",
      name: "发起授权",
      component: () => import("@/components/clue/launch-accredit.vue"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  }, {
    path: "/create-examine",
    component: Layout,
    redirect: "@/components/salary/create-examine",
    children: [{
      path: "/create-examine",
      name: "新建考核方案",
      component: () => import("@/components/salary/create-examine"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal-addnotice",
    component: Layout,
    children: [{
      path: "/personal-addnotice",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/personal/addNotice"),
      name: "个人中心-政策广场-新建通告",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal-addpolicy",
    component: Layout,
    children: [{
      path: "/personal-addpolicy",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/personal/addPolicy"),
      name: "个人中心-政策广场-新建政策汇编",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal-addtrouble",
    component: Layout,
    children: [{
      path: "/personal-addtrouble",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/personal/addTrouble"),
      name: "个人中心-政策广场-新建疑难解答",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/notice-addnotice",
    component: Layout,
    children: [{
      path: "/notice-addnotice",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/policySquare/notice/add"),
      name: "政策广场-新建通告",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/policy-addnotice",
    component: Layout,
    children: [{
      path: "/policy-addnotice",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/policySquare/policy/add"),
      name: "政策广场-新建政策",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/problem-addnotice",
    component: Layout,
    children: [{
      path: "/problem-addnotice",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/policySquare/trouble/add"),
      name: "政策广场-新建疑难",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/project-addnotice",
    component: Layout,
    children: [{
      path: "/project-addnotice",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/project/add"),
      name: "政策广场-新建项目",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/policy-preview",
    component: () =>
      import( /* webpackChunkName: "page" */ "@/views/policySquare/preview"),
    name: "政策广场-预览通告",
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: true
    }
  },
  {
    path: "/article-preview",
    component: () =>
      import( /* webpackChunkName: "page" */ "@/views/policySquare/articleview"),
    name: "文章预览",
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: true
    }
  },
  {
    path: "/project-preview",
    component: () =>
      import( /* webpackChunkName: "page" */ "@/views/project/preview"),
    name: "项目申报-预览",
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: true
    }
  },
  {
    path: "/requirement-create",
    component: Layout,
    children: [{
      path: "/requirement-create",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/project/technical-requirements/create"),
      name: "技术需求-新建",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/requirement-detail",
    component: Layout,
    children: [{
      path: "/requirement-detail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/project/technical-requirements/requirement-detail"),
      name: "技术需求-详情/编辑",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/requirement-preview",
    component: () =>
      import( /* webpackChunkName: "page" */ "@/views/project/technical-requirements/preview"),
    name: "技术需求-预览",
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: true
    }
  },
  {
    path: "/notice-editnotice",
    component: Layout,
    children: [{
      path: "/notice-editnotice",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/policySquare/notice/edit"),
      name: "政策广场-编辑通告",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/policy-editnotice",
    component: Layout,
    children: [{
      path: "/policy-editnotice",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/policySquare/policy/edit"),
      name: "政策广场-编辑汇编",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/problem-editnotice",
    component: Layout,
    children: [{
      path: "/problem-editnotice",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/policySquare/trouble/edit"),
      name: "政策广场-编辑疑难",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/project-editnotice",
    component: Layout,
    children: [{
      path: "/project-editnotice",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/project/edit"),
      name: "政策广场-编辑项目",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal-editnotice",
    component: Layout,
    children: [{
      path: "/personal-editnotice",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/personal/edit"),
      name: "个人中心-政策广场-编辑通告",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal-fileDetail",
    component: Layout,
    children: [{
      path: "/personal-fileDetail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/personal/my-fileDetail"),
      name: "个人中心-卧涛文档-文档详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/file",
    component: () =>
      import( /* webpackChunkName: "page" */ "@/views/policySquare/file/fileManagement"),
    name: "政策广场-文件管理",
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: true
    }
  },
  {
    path: "/staff-detail",
    component: Layout,
    children: [{
      path: "/staff-detail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/staff/staffDetail"),
      name: "员工详情页面",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/user-detail",
    component: Layout,
    children: [{
      path: "/user-detail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/user/detail"),
      name: "用户详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/mp-remindList",
    component: Layout,
    children: [{
      path: "/mp-remindList",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/mp/remindList"),
      name: "微信提醒详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/mycontracts-detail",
    component: Layout,
    children: [{
      path: "/mycontracts-detail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/personal/mycontracts-detail"),
      name: "我的合同详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/online-contract-detail",
    component: Layout,
    children: [{
      path: "/online-contract-detail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/personal/online-contract-detail"),
      name: "线上合同详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/contracts-template-add",
    component: Layout,
    children: [{
      path: "/contracts-template-add",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/contracts/contracts-template-add"),
      name: "合同模板",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/contracts-template-map",
    component: Layout,
    children: [{
      path: "/contracts-template-map",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/contracts/contracts-template-map"),
      name: "合同模板",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/achievement-create",
    component: Layout,
    children: [{
      path: "/achievement-create",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/project/technical-result/achievement-create"),
      name: "新建成果",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/contracts-detail",
    component: Layout,
    children: [{
      path: "/contracts-detail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/contracts/contracts-detail"),
      name: "合同详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal-new-contracts",
    component: Layout,
    children: [{
      path: "/personal-new-contracts",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/components/staff/achievement/personal-new-contracts"),
      name: "个人新增关联合同",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal-new-contracts",
    component: Layout,
    children: [{
      path: "/personal-follow",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/components/staff/achievement/personal-follow"),
      name: "个人客户跟进",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal-new-contracts",
    component: Layout,
    children: [{
      path: "/personal-payment",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/components/staff/achievement/personal-payment"),
      name: "个人回款",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal-new-contracts",
    component: Layout,
    children: [{
      path: "/personal-create-clue",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/components/staff/achievement/personal-create-clue"),
      name: "个人创建线索",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/contracts-newprocessdetail",
    component: Layout,
    children: [{
      path: "/contracts-newprocessdetail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/contracts/contracts-newprocessdetail"),
      name: "新的合同我的流程详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/contracts-processlistdetail",
    component: Layout,
    children: [{
      path: "/contracts-processlistdetail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/contracts/contracts-processlistdetail"),
      name: "合同流程管理详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/contracts-changePricelistdetail",
    component: Layout,
    children: [{
      path: "/contracts-changePricelistdetail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/contracts/contracts-changePricelistdetail"),
      name: "改价流程管理详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/contracts-poentask",
    component: Layout,
    children: [{
      path: "/contracts-opentask",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/contracts/contracts-opentask"),
      name: "改价流程管理详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/contracts-primary",
    component: Layout,
    children: [{
      path: "/contracts-primary",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/contracts/contracts-primary"),
      name: "授权认证流程管理详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/refund-detail",
    component: Layout,
    children: [{
      path: "/refund-detail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/components/refund/refundcheck"),
      name: "退款审批详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/refund-personal",
    component: Layout,
    children: [{
      path: "/refund-personal",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/personal/refund-person"),
      name: "我的退款审批详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/invoicing-person",
    component: Layout,
    children: [{
      path: "/invoicing-person",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/personal/invoicing-person"),
      name: "我的开票审批详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/invoicing-detail",
    component: Layout,
    children: [{
      path: "/invoicing-detail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/components/invoicing/invoicing-detail"),
      name: "开票审批详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/transfer-detail",
    component: Layout,
    children: [{
      path: "/transfer-detail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/components/transfer/transfer-detail"),
      name: "对公转账审批详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/contracts-article",
    component: Layout,
    children: [{
      path: "/contracts-article",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/contracts/contracts-article"),
      name: "流程管理文章审批详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
    // }, {

    //   path: '/contracts-article',
    //   component: Layout,
    //   children: [{
    //     path: '/contracts-article',
    //     component: () =>
    //       import( /* webpackChunkName: "page" */ '@/views/contracts/contracts-article'),
    //     name: '流程管理文章审批详情',
    //     meta: {
    //       keepAlive: false,
    //       isTab: false,
    //       isAuth: true
    //     }
    //   }]
  },
  {
    path: "/contracts-newarticle",
    component: Layout,
    children: [{
      path: "/contracts-newarticle",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/contracts/contracts-newarticle"),
      name: "流程管理新的文章审批详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/capture-edit",
    component: Layout,
    children: [{
      path: "/capture-edit",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/components/capture/capture-edit"),
      name: "编辑发布",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/myuser-detail",
    component: Layout,
    children: [{
      path: "/myuser-detail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/personal/my-users/detail"),
      name: "我的用户 详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/staff-edit",
    component: Layout,
    children: [{
      path: "/staff-edit",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/staff/staffEdit"),
      name: "员工编辑页面",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/pre-column",
    component: () =>
      import( /* webpackChunkName: "page" */ "@/views/column/preColumn"),
    name: "预览栏目",
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: true
    }
  },
  {
    path: "/file-detail",
    component: Layout,
    children: [{
      path: "/file-detail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/policySquare/file/fileDetail"),
      name: "文件详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/preview-detail",
    component: Layout,
    children: [{
      path: "/preview-detail",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/policySquare/file/previewDetail"),
      name: "预览详情详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/order-detail",
    component: Layout,
    redirect: "@/components/order/order-detail",
    children: [{
      path: "/order-detail",
      name: "订单详情",
      component: () => import("@/components/order/order-detail.vue"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/orderonline-detail",
    component: Layout,
    redirect: "@/components/order/online/order-online-detail",
    children: [{
      path: "/orderonline-detail",
      name: "线上订单详情",
      component: () =>
        import("@/components/order/online/order-online-detail"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/document-order-detail",
    component: Layout,
    redirect: "@/components/order/online/document-detail",
    children: [{
      path: "/document-order-detail",
      name: "线上订单详情",
      component: () =>
        import("@/components/order/online/document-detail"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/issue-detail",
    component: Layout,
    children: [{
      path: "/issue-detail",
      component: () => import("@/views/personal/issue-detail"),
      name: "卧涛问答",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/initorder-detail",
    component: Layout,
    redirect: "@/components/order/initorder-detail",
    children: [{
      path: "/initorder-detail",
      name: "待生效订单详情",
      component: () => import("@/components/order/initorder-detail"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/task-detai",
    component: Layout,
    children: [{
      path: "/task-detail",
      component: () => import("@/components/task/task-detail"),
      name: "任务详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/customer-files-detail",
    component: Layout,
    children: [{
      path: "/customer-files-detail",
      component: () => import("@/components/task/customer-files-detail"),
      name: "客户文件库详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/achievement-detail",
    component: Layout,
    children: [{
      path: "/achievement-detail",
      component: () =>
        import("@/views/project/technical-result/achievement-detail"),
      name: "技术成果详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/capture-detail",
    component: Layout,
    children: [{
      path: "/capture-detail",
      component: () => import("@/views/capture-data/detail"),
      name: "预览",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/entering-contract",
    component: Layout,
    name: "录入合同",
    redirect: "@/components/clue/entering-contract",
    children: [{
      path: "/entering-contract",
      name: "录入合同-线下",
      component: () => import("@/components/clue/entering-contract.vue"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/online-entering-contract",
    component: Layout,
    name: "录入合同-线上订单",
    redirect: "@/components/clue/online-entering-contract",
    children: [{
      path: "/online-entering-contract",
      name: "录入合同-线上订单详情",
      component: () =>
        import("@/components/clue/online-entering-contract.vue"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/entry-supplementContract",
    component: Layout,
    name: "录入补充协议-纸质",
    redirect: "@/views/contracts/entry-supplementContract",
    children: [{
      path: "/entry-supplementContract",
      name: "录入补充协议-纸质",
      component: () => import("@/views/contracts/entry-supplementContract"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/add-product",
    component: Layout,
    children: [{
      path: "/add-product",
      component: () => import("@/views/project/ip-service/add-product"),
      name: "新建产品",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/preview-product",
    component: () => import("@/views/project/ip-service/preview"),
    name: "预览产品",
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: true
    }
  },
  {
    path: "/edit-product",
    component: Layout,
    children: [{
      path: "/edit-product",
      component: () => import("@/views/project/ip-service/edit"),
      name: "编辑产品",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/product-list",
    component: () => import("@/views/project/ip-service/index"),
    name: "知识产权",
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: true
    }
  },
  {
    path: "/add-industry",
    component: Layout,
    children: [{
      path: "/add-industry",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/policySquare/industry/add"),
      name: "政策广场-新建行业资讯",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/edit-industry",
    component: Layout,
    children: [{
      path: "/edit-industry",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/policySquare/industry/edit"),
      name: "政策广场-编辑行业资讯",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/preview-industry",
    component: () =>
      import( /* webpackChunkName: "page" */ "@/views/policySquare/industry/preview"),
    name: "政策广场-预览行业资讯",
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: true
    }
  },

  {
    path: "/preview-shopresult",
    component: () =>
      import( /* webpackChunkName: "page" */ "@/views/shop/result"),
    name: "技术成果预览",
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: true
    }
  },
  // 全国站
  {
    path: "/add-nav-qg",
    component: Layout,
    children: [{
      path: "/add-nav-qg",
      component: () => import("@/views/nationalSite/columns/columns-list/add"),
      name: "导航列表-新建导航文章",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/edit-nav-qg",
    component: Layout,
    children: [{
      path: "/edit-nav-qg",
      component: () => import("@/views/nationalSite/columns/columns-list/edit"),
      name: "导航列表-编辑导航文章",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/preview-nav-qg",
    component: () => import("@/views/nationalSite/columns/columns-list/preview"),
    name: "导航列表-预览导航文章",
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: true
    }
  },
  {
    // 成交客户详情新样式页
    path: "/new-client-detail",
    component: Layout,
    children: [{
      path: "/new-client-detail",
      component: () => import("@/views/new-client/client/detail"),
      name: "客户详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    // 线索客户详情新样式页
    path: "/new-clue-detail",
    component: Layout,
    children: [{
      path: "/new-clue-detail",
      component: () => import("@/views/new-client/clue/detail"),
      name: "线索详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/certificationapproval-company",
    component: Layout,
    children: [{
      path: "/certificationapproval-company",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/components/certificationapproval/certificationapproval-company"),
      name: "单位认证审批详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/certificationapproval-person",
    component: Layout,
    children: [{
      path: "/certificationapproval-person",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/components/certificationapproval/certificationapproval-person"),
      name: "个人认证审批详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    // 日志详情
    path: "/work-log-detail",
    component: Layout,
    children: [{
      path: "/work-log-detail",
      component: () => import("@/views/staff/work-log/detail"),
      name: "日志详情",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/common-service-add",
    component: Layout,
    children: [{
      path: "/common-service-add",
      component: () => import("@/views/project/common-service/add"),
      name: "公共服务添加页",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/common-service-detail",
    component: Layout,
    children: [{
      path: "/common-service-detail",
      component: () => import("@/views/project/common-service/edit"),
      name: "公共服务编辑/详情页",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/common-service-preview",
    component: () => import("@/views/project/common-service/preview"),
    name: "公共服务预览页",
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: true
    }
  },
  {
    path: "/wt-classroom-add",
    component: Layout,
    children: [{
      path: "/wt-classroom-add",
      component: () => import("@/views/wt-classroom/course-management/add"),
      name: "卧涛课堂添加页",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/wt-classroom-detail",
    component: Layout,
    children: [{
      path: "/wt-classroom-detail",
      component: () => import("@/views/wt-classroom/course-management/edit"),
      name: "卧涛课堂编辑页",
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/wt-member-detail",
    component: Layout,
    redirect: "@/components/member/member-detail",
    children: [{
      path: "/wt-member-detail",
      name: "卧涛会员订单详情",
      component: () => import("@/components/member/member-detail"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/wt-course-detail",
    component: Layout,
    redirect: "@/components/course/course-detail",
    children: [{
      path: "/wt-course-detail",
      name: "卧涛课程订单详情",
      component: () => import("@/components/course/course-detail"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/position-detail",
    component: Layout,
    redirect: "@/components/staff/manage-job/position-detail",
    children: [{
      path: "/position-detail",
      name: "职位详情",
      component: () => import("@/components/staff/manage-job/position-detail"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/salary-detail",
    component: Layout,
    redirect: "@/components/salary/salary-detail",
    children: [{
      path: "/salary-detail",
      name: "工资表详情",
      component: () => import("@/components/salary/salary-detail"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/accounting-detail",
    component: Layout,
    redirect: "@/components/salary/accounting-detail",
    children: [{
      path: "/accounting-detail",
      name: "工资核算详情",
      component: () => import("@/components/salary/accounting-detail"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/create-examinetask",
    component: Layout,
    redirect: "@/components/salary/create-examinetask",
    children: [{
      path: "/create-examinetask",
      name: "新建考核任务",
      component: () => import("@/components/salary/create-examinetask"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/examine-process",
    component: Layout,
    redirect: "@/components/process-manage/examine-process",
    children: [{
      path: "/examine-process",
      name: "考核流程",
      component: () => import("@/components/process-manage/examine-process"),
      meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal/myPublish",
    component: Layout,
    children: [{
      path: "/personal/myPublish",
      component: () => import("@/views/personal/myPublish"),
      name: "我的发布",
      meta: {
        keepAlive: false,
        isTab: true,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal/my-log/index",
    component: Layout,
    children: [{
      path: "/personal/my-log/index",
      component: () => import("@/views/personal/my-log/index"),
      name: "我的日志",
      meta: {
        keepAlive: false,
        isTab: true,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal/my-users",
    component: Layout,
    children: [{
      path: "/personal/my-users",
      component: () => import("@/views/personal/my-users"),
      name: "我的用户",
      meta: {
        keepAlive: false,
        isTab: true,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal/customer/my-clue",
    component: Layout,
    children: [{
      path: "/personal/customer/my-clue",
      component: () => import("@/views/personal/customer/my-clue"),
      name: "我的线索",
      meta: {
        keepAlive: false,
        isTab: true,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal/customer/my-client",
    component: Layout,
    children: [{
      path: "/personal/customer/my-client",
      component: () => import("@/views/personal/customer/my-client"),
      name: "我的客户",
      meta: {
        keepAlive: false,
        isTab: true,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal/my-contracts",
    component: Layout,
    children: [{
      path: "/personal/my-contracts",
      component: () => import("@/views/personal/my-contracts"),
      name: "我的合同",
      meta: {
        keepAlive: false,
        isTab: true,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal/my-process",
    component: Layout,
    children: [{
      path: "/personal/my-process",
      component: () => import("@/views/personal/my-process"),
      name: "我的流程",
      meta: {
        keepAlive: false,
        isTab: true,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal/personal-order",
    component: Layout,
    children: [{
      path: "/personal/personal-order",
      component: () => import("@/views/personal/personal-order"),
      name: "我的订单",
      meta: {
        keepAlive: false,
        isTab: true,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal/my-task",
    component: Layout,
    children: [{
      path: "/personal/my-task",
      component: () => import("@/views/personal/my-task"),
      name: "我的任务",
      meta: {
        keepAlive: false,
        isTab: true,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal/my-receive",
    component: Layout,
    children: [{
      path: "/personal/my-receive",
      component: () => import("@/views/personal/my-receive"),
      name: "我的回款",
      meta: {
        keepAlive: false,
        isTab: true,
        isAuth: true
      }
    }]
  },
  {
    path: "/personal/my-salary",
    component: Layout,
    children: [{
      path: "/personal/my-salary",
      component: () => import("@/views/personal/my-salary"),
      name: "我的工资条",
      meta: {
        keepAlive: false,
        isTab: true,
        isAuth: true
      }
    }]
  }
];
