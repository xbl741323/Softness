<template>
  <div class="graphic_content_index">
    <header-navigation :navList="navList"></header-navigation>
    <!-- banner区域 -->
    <banner :bannerList="bannerList" v-if="bannerList.length>0"></banner>
    <!-- 主体内容区域 -->
    <div :class="['graphic_contain',bannerList.length>0?'':'no_banner_sty']">
      <graphic-content v-loading.lock="loading" :noticeInfo="essayInfo" v-if="essayInfo != null"></graphic-content>
      <div class="flex_box" v-else>
        <img src="@/assets/images/notice/no_data.png" alt="暂无数据" width="500">
        <div>暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import graphicContent from "@/components/graphic-content/content"
import { getBnner } from "@/api/notice";
import banner from "@/components/common/banner"
import headerNavigation from "@/components/common/headerNavigation"
import * as CodeMsg from "@/utils/code";
import axios from "axios";
export default {
  components:{
    banner,
    headerNavigation,
    graphicContent
  },
  head() {
    return {
      title: this.essayInfo.title,
      meta: [
        { charset: "utf-8" },
        {
          name: "keywords",
          content: this.essayInfo.metakeyword,
        },
        {
          hid: "description",
          name: "description",
          content: this.essayInfo.meta,
        },
      ],
    };
  },
  async asyncData({ query, redirect }) {
    let data = {
      pageNo: query.page,
      pageSize: 20,
      columnId: query.id,
      substationId: 20
    }
    try {
      const list = await axios.post( process.env.ASYNC_DATA_API+"/hfxl/esJsNavigation/getListByColumnId",data);
      const res = await axios.get(process.env.ASYNC_DATA_API+"/hfxl/jsnavigation/getDetails?number="+list.data.data.list[0].number+'&substationId=20' );//详情接口
      const res1 = await axios.get(process.env.ASYNC_DATA_API+'/hfxl/column/listColumn?substationId='+data.substationId);
      const navList = [];
      res1.data.data.forEach(item => {
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
      let clumnInfoList = []
      res1.data.data.forEach(item => {
        if (item.isTwo == 1) {
          item.childrenColumnVoList.forEach(item1 => {
            clumnInfoList.push(item1)
          })
        } else {
          clumnInfoList.push(item)
        }
      })
      let clumnInfo = clumnInfoList.filter( val => {
        return query.id == val.id
      })[0]
      if (res1.data.code == CodeMsg.CODE_0&&res.data.data) {
        if(res.data.data){
          return {
            clumnInfo: clumnInfo,
            essayInfo: res.data.data,
            loading: false,
            navList: navList
          };
        }else{
          return {
            clumnInfo: clumnInfo,
            essayInfo:  null,
            loading: false,
            navList: navList
          };
        }
      }
    } catch (error) {
      redirect('/404');
    }
  },
  data() {
    return {
      essayInfo:null,
      loading: true,
      childIndex: null,
      childIndex1: null,
      clumnInfo: {},
      graphicInfo: {},
      bannerList: [],
      dataList: [],
      navList: [],
      showIndex: null,
      navIndex: null
    };
  },
  methods: {
    toList(val, index, cindex) {
      let routerObj = {};
      switch (val.type) {
        case 0:
          routerObj = { path: "/graphic-content", query: { id: val.id, name:val.name, type: val.bannerType, index: index } };
          if (cindex > -1) {
            this.childIndex1 = cindex
            routerObj.query.childIndex = cindex
          }
          break;
        case 1:
          if(val.id == 161){
            sessionStorage.removeItem("trouble-filter")
          }
          routerObj = { path: "/article-list", query: { id: val.id, type: val.bannerType, index: index } };
          if (cindex > -1) {
            this.childIndex1 = cindex
            routerObj.query.childIndex = cindex
          }
          break;
        case 2:
          routerObj = { path: "/graphic-list", query: { id: val.id, type: val.bannerType, index: index } };
          if (cindex > -1) {
            this.childIndex1 = cindex
            routerObj.query.childIndex = cindex
          }
          break;
        case 3:
          routerObj = { path: "/picture-list", query: { id: val.id, type: val.bannerType, index: index } };
          if (cindex > -1) {
            this.childIndex1 = cindex
            routerObj.query.childIndex = cindex
          }
          break;
        case 4:
          routerObj = { path: "/" };
          break;
        case 5:
          routerObj = { path: "/notice" };
          break;
        case 6:
          routerObj = { path: "/aboutWT?id=3&type=0" };
          break;
        default:
          routerObj = { path: "/" };
          break;
      }
      const newPath = this.$router.resolve(routerObj);
      window.open(newPath.href,'_self');
    },
    linkTo(val, index) {
      this.navIndex = index;
      if (val.isTwo == 1) {
        return this.toList(val.childrenColumnVoList[0], index, 0)
      }
      this.toList(val,index);
    },
    getNavIndex() {
      if(this.$route.path == '/'){
        this.navIndex = 0
      }else{
        if (this.$route.query.index) {
         this.navIndex = this.$route.query.index;
         if (this.$route.query.childIndex) {
          this.childIndex1 = this.$route.query.childIndex;
         } else {
          this.childIndex1 = null
         }
        } else {
          this.navIndex = 0
        }
      }
    },
    getBnnerList(type){
      getBnner(type).then(res=>{
       if(res.code == CodeMsg.CODE_0){
         this.bannerList = res.data
        }
      })
    },
  },
  mounted() {
    this.getNavIndex();
    this.getBnnerList(this.$route.query.type);
  },
};
</script>

<style scoped>
.graphic_content_index {
  width: 100%;
  background: #f7f8f9;
  overflow: hidden;
}
.graphic_contain {
  width: 1190px;
  background: #ffffff;
  min-height: 1000px;
  margin: 0 auto;
  padding: 10px 20px;
  margin-bottom: 10px;
}
.no_banner_sty{
  margin-top: 120px;
}
.nav_item_contain {
  width: 1190px;
  height: 100%;
  margin: 0 auto;
  padding-top: 70px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.nav_item {
  position: relative;
  flex: 1;
  display: flex;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #1172f3;
  margin-right: 10px;
  border-radius: 5px 5px 0px 0px;
  text-decoration: none;
}
.nav_active_item {
  color: #ffffff;
  background: #1172f3;
  border-radius: 5px 5px 0px 0px;
  text-decoration: none;
}
.nav_item_title {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
  border-radius: 5px 5px 0px 0px;
  text-decoration: none;
}
.two_nav_contain {
  position: absolute;
  top: 40px;
  width: 100%;
  background: #1172f3;
  border-radius: 0px 0px 5px 5px;
  z-index: 10000;
}
.two_nav_contain a {
  display: flex;
  height: 40px;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  border-top: 1px solid #ffffff;
  text-decoration: none;
}
.two_nav_contain > a:last-of-type {
  border-radius: 0px 0px 5px 5px;
}
.item_child_active {
  background: #5094ee;
}
.two_active{
  background: #5094EE;
}
.flex_box {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 250px auto;
  font-size: 16px;
  color: #aca9a9;
}
</style>