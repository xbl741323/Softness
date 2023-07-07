import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'cn',
  messages: {
    en: require('@/locales/en'),
    cn: require('@/locales/cn')
  }
})
const datalist = {
  "homeIcons": [
    {
      "id": "1",
      "path": "/classification",
      "imgUrl": require('@/assets/images/wotao/wotao_project@2x.png'),
      "desc": '项目申报'
    },{
      "id": "2",
      "path": "/classification",
      "imgUrl": require('@/assets/images/wotao/wotao_zhichan@2x.png'),
      "desc":'知识产权'
    },{
      "id": "7",
      "path": "/classification",
      "imgUrl": require('@/assets/images/wotao/wotao_gongshang@2x.png'),
      "desc": '工商财税'
    },{
      "id": "9",
      "path": "/classification",
      "imgUrl": require('@/assets/images/wotao/wotao_rongzi@2x.png'),
      "desc": '融资上市'
    },{
        "id": "10",
        "path": "/classification",
        "imgUrl": require('@/assets/images/wotao/wotao_falv@2x.png'),
        "desc": '法律服务'
    },{
        "id": "11",
        "path": "/classification",
        "imgUrl": require('@/assets/images/wotao/wotao_ruanjian@2x.png'),
        "desc": '软件开发'
    },{
        "id": "99",
        "path": "/classification",
        "imgUrl": require('@/assets/images/wotao/wotao_gengduo@2x.png'),
        "desc": '更多服务'
    }
  ],
  "homePolicyNav": [
      {
        "id": 1,
        "name": i18n.t("message.announcements"),
        "imgUrl": "home/icon_gonggao@2x.png",
        "path": "/policy/announcement",
        "actived": false
      },
      {
        "id": 2,
        "name": i18n.t("message.industryAnswer"),
        "imgUrl": "home/icon_hangye.png",
        "path": "/policy/industryinfo",
        "actived": false
      },
      {
        "id": 3,
        "name": i18n.t("message.questionAnswer"),
        "imgUrl": "home/icon_jieda@2x.png",
        "path": "/policy/troubleList",
        "actived": false
      },
     {
      "id": 4,
      "name": i18n.t("message.fileDowland"),
      "imgUrl": "home/icon_xiazai@2x.png",
      "path": "/policy/filesDownload",
      "actived": false
    }
  ],
  "homeServiceNav": [
    {
      "id": 1,
      "name": "技术成果",
      "imgUrl": "home/icon_chenguo.png",
      "path": "/result",
      "actived": false
    },
    {
      "id": 1,
      "name": "技术需求",
      "imgUrl": "home/icon_xuqiu.png",
      "path": "/need",
      "actived": false
    },
    {
      "id": 1,
      "name": i18n.t("message.projectApply"),
      "imgUrl": "home/icon_shenbao.png",
      "path": "/project",
      "actived": false
    },
     {
      "id": 2,
      "name": i18n.t("home.propertyService"),
      "imgUrl": "home/icon_zhichan.png",
      "path": "/zhichan",
      "actived": false
    }, {
      "id": 3,
      "name": i18n.t("message.resultEvaluations"),
      "imgUrl": "home/icon_chengguopingjia.png",
      "path": "/evaluation",
      "actived": false
    }
  ],
  "indexNav": [
    {
      "name": i18n.t("message.home"),
      "path": "/",
      "id": "home",
      "img": "home/home_icon_hui@2x.png",
      "imgActive": "home/home_icon@2x.png",
      "actived": false
    },
    {
        "name": '服务',
        "path": "/classification",
        "id": "/service",
        "img": "home/fenlei_icon_hui@2x.png",
        "imgActive": "home/fenlei_icon@2x.png",
        "actived": false
    },
    {
      "name": '',
      "path": "",
      "id": "",
      "img": "home/editask.png",
      "imgActive": "home/editask.png",
      "actived": false
    }, 
    {
        "name":'广场',
        "path": "",
        "id": "/policy",
        "img": "home/zhengce_icon@2x.png",
        "imgActive": "home/zhengcedianji_icon@2x.png",
        "actived": false
    }, 
    {
      "name": i18n.t("message.my"),
      "path": "/member",
      "id": "/member",
      "img": "home/me_icon_hui@2x.png",
      "imgActive": "home/me_icon@2x.png",
      "actived": false
    }
  ],
  "indexBanner": require('@/assets/images/home/banner_home@2x.png')
}
export default {
  datalist
}
