<template>
  <div class="container">
    <header-navigation :navList="navList" :shouyeId="shouyeId"></header-navigation>
    <!-- 大背景图内容 -->
    <header-com :zixunList="zixunList"/>
    <!-- 政策信息板块 -->
    <policy-info :hyzxList="hyzxList" :zcjbList="zcjbList"/>
    <!-- 项目方案设计板块 -->
    <project-plan :listFriendLink="FriendLink" />
  </div>
</template>

<script>
import headerCom from "@/components/index/header";
import policyInfo from "@/components/index/policy-info";
import projectPlan from "@/components/index/project-plan";
import headerNavigation from "@/components/common/headerNavigation"
import axios from 'axios'
import moment from 'moment'
export default {
  components:{
    policyInfo,
    projectPlan,
    headerCom,
    headerNavigation
  },
  head() {
    return {
      title: this.clumnInfo.title,
      meta: [
        { charset: "utf-8" },
        {
          name: "keywords",
          content: this.clumnInfo.metakeyword,
        },
        {
          hid: "description",
          name: "description",
          content: this.clumnInfo.meta,
        },
      ],
    };
  },
  async asyncData(){
    let substationId = 20
    if(process.server){
      try {
        const FriendLink = await axios.get(process.env.ASYNC_DATA_API+'/hfxl/tmFriendLink/listFriendLink?substationId='+substationId);
        const res = await axios.get(process.env.ASYNC_DATA_API+'/hfxl/column/innerList?substationId='+substationId);
        const navList = [];
        res.data.data.forEach(item => {
          if (item.status == 0) {
            switch (item.type) {
              case 0:
                item.pathUrl = "/graphic-content";
                break;
              case 1:
                item.pathUrl = "/article-list";
                break;
              case 2:
                item.pathUrl = "/graphic-list";
                break;
              case 3:
                item.pathUrl = "/picture-list";
                break;
              default:
                item.pathUrl = "/";
                break;
            }
            if (item.childrenColumnVoList) {
              item.childrenColumnVoList.forEach(child => {
                switch (child.type) {
                  case 0:
                    child.pathUrl = "/graphic-content";
                    break;
                  case 1:
                    child.pathUrl = "/article-list";
                    break;
                  case 2:
                    child.pathUrl = "/graphic-list";
                    break;
                  case 3:
                    child.pathUrl = "/picture-list";
                    break;
                  case 4:
                    child.pathUrl = "/";
                    break;
                  default:
                    child.pathUrl = "/";
                    break;
                }
              })
            }
            navList.push(item);
          }
        });
        // 如果二级导航数组有值先取二级导航数组第一条数据的id，负责取一级导航id
        let result = res.data.data
        const clumnInfo = result[0]
        const shouyeId = result[0].id
        const zixun = result[1]
        const tzgg = result[2]
        const rzdl = result[3]
        const zjtx = result[4]
        const gscs = result[5]
        const zcjb = result[6]
        let zixunData = {
          columnId: zixun.childrenColumnVoList.length>0? zixun.childrenColumnVoList[0].id : zixun.id,
          pageNo: 1,
          pageSize: 10,
          substationId: substationId
        }
        let tzggData = {
          columnId: tzgg.childrenColumnVoList.length>0? tzgg.childrenColumnVoList[0].id : tzgg.id,
          pageNo: 1,
          pageSize: 8,
          substationId: substationId
        }
        let rzdlData = {
          columnId: rzdl.childrenColumnVoList.length>0? rzdl.childrenColumnVoList[0].id : rzdl.id,
          pageNo: 1,
          pageSize: 8,
          substationId: substationId
        }
        let zjtxData = {
          columnId: zjtx.childrenColumnVoList.length>0? zjtx.childrenColumnVoList[0].id : zjtx.id,
          pageNo: 1,
          pageSize: 8,
          substationId: substationId
        }
        let gscsData = {
          columnId: gscs.childrenColumnVoList.length>0? gscs.childrenColumnVoList[0].id : gscs.id,
          pageNo: 1,
          pageSize: 8,
          substationId: substationId
        }
        let zcjbData = {
          columnId: zcjb.childrenColumnVoList.length>0? zcjb.childrenColumnVoList[0].id : zcjb.id,
          pageNo: 1,
          pageSize: 12,
          substationId: substationId
        }
        // 湖南政策解读数据（取后台分站站点->导航设置序号2的数据）
        const zixunRes = await axios.post(process.env.ASYNC_DATA_API+'/hfxl/esJsNavigation/getListByColumnId', zixunData);
        // 首页样式显示（取后台分站站点->导航设置序号3到6的数据）
        const tzggRes = await axios.post(process.env.ASYNC_DATA_API+'/hfxl/esJsNavigation/getListByColumnId', tzggData);
        const rzdlRes = await axios.post(process.env.ASYNC_DATA_API+'/hfxl/esJsNavigation/getListByColumnId', rzdlData);
        const zjtxRes = await axios.post(process.env.ASYNC_DATA_API+'/hfxl/esJsNavigation/getListByColumnId', zjtxData);
        const gscsRes = await axios.post(process.env.ASYNC_DATA_API+'/hfxl/esJsNavigation/getListByColumnId', gscsData);
        // 政策奖补数据（取后台分站站点->导航设置序号7的数据）
        const zcjbRes = await axios.post(process.env.ASYNC_DATA_API+'/hfxl/esJsNavigation/getListByColumnId', zcjbData);
        if(zixunRes.data.code == 0 && tzggRes.data.code == 0 && rzdlRes.data.code ==0 && zjtxRes.data.code ==0 && gscsRes.data.code ==0 && zcjbRes.data.code ==0){
          let zixunList = zixunRes.data.data.list;
          let tzggList = tzggRes.data.data.list;
          let rzdlList = rzdlRes.data.data.list;
          let zjtxList = zjtxRes.data.data.list;
          let gscsList = gscsRes.data.data.list;
          let zcjbList = zcjbRes.data.data.list;
          zixunList.forEach(item => {
            delete item.content
            item.id = zixun.id
            item.bannerType = zixun.childrenColumnVoList.length>0? zixun.childrenColumnVoList[0].bannerType: zixun.bannerType
            item.childId = zixun.childrenColumnVoList.length>0? zixun.childrenColumnVoList[0].id: ''
            item.type = zixun.childrenColumnVoList.length>0? zixun.childrenColumnVoList[0].type: zixun.type
          });
          tzggList.forEach(item => {
            delete item.content
          });
          rzdlList.forEach(item => {
            delete item.content
          });
          zjtxList.forEach(item => {
            delete item.content
          });
          gscsList.forEach(item => {
            delete item.content
          });
          zcjbList.forEach(item => {
            delete item.content
          });
          let hyzxList = [
            {
              id: tzgg.id,
              childId: tzgg.childrenColumnVoList.length>0? tzgg.childrenColumnVoList[0].id: '',
              bannerType: tzgg.childrenColumnVoList.length>0? tzgg.childrenColumnVoList[0].bannerType: tzgg.bannerType,
              type: tzgg.childrenColumnVoList.length>0? tzgg.childrenColumnVoList[0].type: tzgg.type,
              title: res.data.data[2].name,
              imgUrl: require('@/assets/images/banner/pic_announcement@2x.png'),
              list: tzggList,
            },
            {
              id: rzdl.id,
              childId: rzdl.childrenColumnVoList.length>0? rzdl.childrenColumnVoList[0].id: '',
              bannerType: rzdl.childrenColumnVoList.length>0? rzdl.childrenColumnVoList[0].bannerType:rzdl.bannerType,
              type: rzdl.childrenColumnVoList.length>0? rzdl.childrenColumnVoList[0].type: rzdl.type,
              title: res.data.data[3].name,
              imgUrl: require('@/assets/images/banner/pic_patent@2x.png'),
              list: rzdlList,
            },
            {
              id: zjtx.id,
              childId: zjtx.childrenColumnVoList.length>0? zjtx.childrenColumnVoList[0].id: '',
              bannerType: zjtx.childrenColumnVoList.length>0? zjtx.childrenColumnVoList[0].bannerType: zjtx.bannerType,
              type: zjtx.childrenColumnVoList.length>0? zjtx.childrenColumnVoList[0].type: zjtx.type,
              title: res.data.data[4].name,
              imgUrl: require('@/assets/images/banner/pic_enterprise@2x.png'),
              list: zjtxList,
            },
            {
              id: gscs.id,
              childId: gscs.childrenColumnVoList.length>0? gscs.childrenColumnVoList[0].id: '',
              bannerType: gscs.childrenColumnVoList.length>0? gscs.childrenColumnVoList[0].bannerType: gscs.bannerType,
              type: gscs.childrenColumnVoList.length>0? gscs.childrenColumnVoList[0].type: gscs.type,
              title: res.data.data[5].name,
              imgUrl: require('@/assets/images/banner/pic_finance@2x.png'),
              list: gscsList,
            },
          ]
          zcjbList = [
            {
              id: zcjb.id,
              childId: zcjb.childrenColumnVoList.length>0? zcjb.childrenColumnVoList[0].id: '',
              bannerType: zcjb.childrenColumnVoList.length>0? zcjb.childrenColumnVoList[0].bannerType: zcjb.bannerType,
              type: zcjb.childrenColumnVoList.length>0? zcjb.childrenColumnVoList[0].type: zcjb.type,
              list: zcjbList.slice(0,5)
            },
            {
              id: zcjb.id,
              childId: zcjb.childrenColumnVoList.length>0? zcjb.childrenColumnVoList[0].id: '',
              bannerType: zcjb.childrenColumnVoList.length>0? zcjb.childrenColumnVoList[0].bannerType: zcjb.bannerType,
              type: zcjb.childrenColumnVoList.length>0? zcjb.childrenColumnVoList[0].type: zcjb.type,
              list: zcjbList.slice(5,10)
            },
          ]
          zcjbList[0].list.forEach(item => {
            item.create_time = moment(item.create_time).format("YYYY-MM-DD")
          })
          zcjbList[1].list.forEach(item => {
            item.create_time = moment(item.create_time).format("YYYY-MM-DD")
          })

          return {
            FriendLink:FriendLink.data.data,
            clumnInfo:clumnInfo,
            zixunList,
            hyzxList,
            zcjbList,
            navList,
            shouyeId,
          }
        }else{
          return {};
        };
     } catch (error) {
      redirect('/404')
     }
    }
  },
  data(){
    return {
      clumnInfo: {},
      zixunList:[],
      hyzxList:[],
      zcjbList: [],
    }
  },
}
</script>

<style scoped>
.container{
  width: 100%;
}
</style>
