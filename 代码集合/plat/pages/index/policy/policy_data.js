const textData = [
  { 
    id: 0, 
    title: '如何提问才能更快得到有帮助的答案？',
    content: [
      {
        label: "真实：",
        content: "自己的真实疑惑，希望得到帮助；"
      },
      {
        label: "完整：",
        content: "问句完整，以“？”结束，让别人看得懂；"
      },
      {
        label: "明确：",
        content: "有针对性的提问，描述不模糊，阐明要点；"
      },
      {
        label: "简洁:",
        content: "不赘述，问题一句话，描述1~3句说清楚；"
      }
    ],
    attr: true
  },
  {
    id: 1, 
    title: '一个好提问需要包含如下信息：',
    content: [
      {
        imgSrc: "home/dui.png",
        content: "问题是什么：说出你想得到的帮助，每次只问一件事，以“？”结束",
      },
      {
        imgSrc: "home/dui.png",
        content: "具体情况：目前“你”遇到的问题情况描述，你对遇到现状和问题的理解和观点。",
      },
      {
        imgSrc: "home/dui.png",
        content: "时间信息：你的问题是什么时间出现的，持续多久，希望在什么时间被解决？"
      }
    ],
    attr: false
  },
  {
    id: 2, 
    title: '请避免如下的提问：',
    content: [
      {
        imgSrc: "home/cuo.png",
        content: "违反法律法规，政治敏感的：例如色情、暴力血腥、求盗版资源等违法内容。",
      },
      {
        imgSrc: "home/cuo.png",
        content: "不友善行为：辱骂、人身攻击、地域攻击等引起其他用户不悦等内容。",
      },
      {
        imgSrc: "home/cuo.png",
        content: "含有垃圾广告信息等内容",
      },
      {
        imgSrc: "home/cuo.png",
        content: "表意不明确，别人无从回答的。"
      },
    ],
    attr: false
  },
]

const staticData = [
  { 
    id: 1,
    title: '卧涛问答',
    content: '你来提问，我来回答',
    searchImg: require("~/assets/images/zhengce/icon_search.png"),
    quesImg: require("~/assets/images/zhengce/pic_wenda.png"),
    hotImg: require("~/assets/images/zhengce/icon_hot.png"),
    askImg: require("~/assets/images/zhengce/btn_quiz.png"),
    path: "index-policy-troubleshooting"
  },
  { 
    id: 2,
    title: '通知公告',
    content: '政策信息及时掌握',
    calendarImg: require("~/assets/images/zhengce/icon_calendar.png"),
    leftImg: require("~/assets/images/zhengce/left_icon.png"),
    rightImg: require("~/assets/images/zhengce/right_icon.png"),
    logoImg: require("~/assets/images/zhengce/pic_notice.png"),
    path: "index-policy-announcement"
  },
  { 
    id: 3,
    title: '行业资讯',
    content: '搜索行业热点，掌握最新动态',
    logoImg: require("~/assets/images/zhengce/pic_information.png"),
    infoImg: require("~/assets/images/zhengce/pic_information_banner.png"),
    path: "index-policy-industryinfo"
  },
  { 
    id: 4,
    title: '卧涛文档',
    content: '文档文库',
    excelImg: require("~/assets/images/zhengce/icon_excel.png"),
    pptImg: require("~/assets/images/zhengce/icon_ppt.png"),
    wordImg: require("~/assets/images/zhengce/icon_word.png"),
    pdfImg: require("~/assets/images/zhengce/icon_pdf.png"),
    collectImg: require("~/assets/images/zhengce/icon_star.png"),
    downloadImg: require("~/assets/images/zhengce/icon_download.png"),
    path: "index-policy-filesDownload"
  },
]
const tabList =  [
  {id: 1, name: '项目申报'},
  {id: 2, name: '知识产权'},
  {id: 7, name: '工商财税'},
  {id: 9, name: '融资上市'},
  {id: 10, name: '法律服务'},
  {id: 11, name: '软件开发'},
]

const list = [
  {
      name:'全部',
      value:1
  },
  {
      name:'知识产权',
      value:2
  },
  {
      name:'项目申报',
      value:3
  },
]

const rightList = [
  {
    list: [],
    title: "通知公告",
    type: 0,
    path: 'index-policy-announcement',
    attr: true,
    icon: '&#xe608;'
  },
  {
    list: [],
    title: "行业资讯",
    type: 1,
    path: 'index-policy-industryinfo',
    attr: true,
    icon: '&#xe626;'
  },
  {
    list: [],
    title: "卧涛问答",
    type: 2,
    path: 'index-policy-troubleshooting',
    attr: true,
    icon: '&#xe629;'
  },
  {
    list: [],
    title: "卧涛文档",
    type: 3,
    path: 'index-policy-filesDownload',
    attr: true,
    icon: '&#xe62b;'
  }
]

const most = [{
  title: '发布时间',
  type: 'latest'
},{
  title: '综合排序',
  type: 'hottest'
}]

const newMost = [{
  title: '综合排序',
  type: 'hottest'
},{
  title: '发布时间',
  type: 'latest'
}]

const level = [{
  label: '全部',
  value: null
},{
  label: '国家级',
  value: 1
},{
  label: '省级',
  value: 2
},{
  label: '市级',
  value: 3
},{
  label: '区级',
  value: 4
}]

const optionList = [
  {id: null, name: '全部'},
  {id: 1, name: '项目申报'},
  {id: 2, name: '知识产权'},
  {id: 7, name: '工商财税'},
  {id: 9, name: '融资上市'},
  {id: 10, name: '法律服务'},
  {id: 11, name: '软件开发'},
]

const declarationData = [0,1,2,3,4,5,6,7,8,9,10,11,12]

const iconUrl = {
  doc: require('@/assets/images/zhengce/icon_word.png'),
  docx: require('@/assets/images/zhengce/icon_word.png'),
  ppt: require('@/assets/images/zhengce/icon_ppt.png'),
  pptx: require('@/assets/images/zhengce/icon_ppt.png'),
  pdf: require('@/assets/images/zhengce/icon_pdf.png'),
  xls: require('@/assets/images/zhengce/icon_excel.png'),
  xlsx: require('@/assets/images/zhengce/icon_excel.png'),
}

const fileTypeArr = ['doc', 'docx', 'ppt', 'pptx', 'pdf', 'xls', 'xlsx']

export function orderType(type){
  return type == 0 ? '知识产权' : '项目申报';
}

export default{
  textData,
  staticData,
  tabList,
  rightList,
  most,
  list,
  level,
  newMost,
  optionList,
  declarationData,
  orderType,
  iconUrl,
  fileTypeArr
}