<template>
  <div class="article_detail">
    <header-navigation :navList="navList" :shouyeId="shouyeId"></header-navigation>
    <div class="article_detail_contain">
      <!-- 文章区域 -->
      <div :class="['contain_left',introList.length==0?'active_contain_left':'']" v-loading.lock="loading">
        <div class="essay_left_top">
          <h2 :class="['essay_title', noticeInfo.canCopy ? '' : 'noselect']">
            {{ noticeInfo.title }}
          </h2>
          <div class="essay_contant">
            <div class="essay_desc">
              <span>{{ noticeInfo.createUser }}</span>
              <span>/</span>
              <span>{{ noticeInfo.createTime | timeFilter }}</span>
            </div>
            <div v-if="pageViews > 0">
              <span>
                <img :src="viewUrl" alt="浏览" />
                <span>{{ pageViews }}</span>
              </span>
              <span
                @mouseenter="qrStatus = true"
                @mouseleave="qrStatus = false">
                <img :src="shareUrl" alt="分享" />
                <span>分享</span>
              </span>
              <div
                class="share_img_contain"
                v-if="qrStatus"
                @mouseenter="qrStatus = true"
                @mouseleave="qrStatus = false">
                <p>扫描二维码分享网页到微信</p>
                <img title="本文二维码，手机扫一扫，精彩随身带!" :src="shareSrc + this.href" alt="分享"/>
                <div>分享当前网页到：</div>
                <div class="pointer-contain-sty">
                  <span @click="qqShare">QQ空间</span>
                  <span @click="weiboShare">新浪微博</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div :class="['essay_left_bottom', noticeInfo.canCopy ? '' : 'noselect']" v-html="noticeInfo.content"></div>
        <!-- 附件列表 -->
        <div v-if="noticeInfo.files.length>0">
          <h3 class="adjunct-t">相关附件：</h3>
          <div v-for="(item,index) in noticeInfo.files" :key="index"  class="adjunct-i" @click="openFiles(item)">
            <a>附件{{ index+1 }}：{{ item.name }}</a>
            <img src="https://static.wotao.com/icon/head/78f046c9705d45388dbf8fd6439b976d.png" alt="下载">
          </div>
        </div>
        <!-- 上一页-下一页 -->
        <div class="essay_other">
          <a :href="'/article-list/'+noticeInfo.previousNumber+'?oneId='+$route.query.oneId+'&childId='+$route.query.childId" target="_self" v-if="noticeInfo.previousNumber">
            <span>上一篇></span>
            <span>{{ noticeInfo.previousTitle }}</span>
          </a>
          <a :href="'/article-list/'+noticeInfo.nextNumber+'?oneId='+$route.query.oneId+'&childId='+$route.query.childId" target="_self" v-if="noticeInfo.nextNumber">
            <span>下一篇></span>
            <span>{{ noticeInfo.nextTitle }}</span>
          </a>
        </div>
      </div>

      <!-- 推荐区域 -->
      <div class="contain_right" v-if="introList.length>0" v-loading.lock="loading">
        <div class="right_intro_title">推荐资讯</div>
        <div
          class="right_intro_item"
          v-for="(item, index) in introList"
          :key="index"
          @click="toOtherDetail(item, false)">
          <div>{{item.title}}</div>
          <div>{{item.title}}</div>
          <div>
            <span>{{ item.createTime }}</span>
            <span>点击查看</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getNavDetail,addCommonView } from "@/api/template";
import headerNavigation from "@/components/common/headerNavigation"
import * as CodeMsg from "@/utils/code";
import axios from "axios";
export default {
  components:{
    headerNavigation,
  },
  head() {
    return {
      title: this.clumnInfo.metaTitle,
      meta: [
        { name: "keywords", content: this.clumnInfo.metaKeyword },
        {
          hid: "description",
          name: "description",
          content: this.clumnInfo.metaDescription,
        },
      ],
    };
  },
  async asyncData({ params, redirect }) {
    let substationId = 20
    try {
      const res = await axios.get(process.env.ASYNC_DATA_API +"/hfxl/jsnavigation/getDetails?number="+params.detail+'&substationId='+substationId);
      const res1 = await axios.get(process.env.ASYNC_DATA_API+'/hfxl/column/listColumn?substationId='+substationId);
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
      let clumnInfo = res.data.data
      const shouyeId = res1.data.data.filter(item => item.name.includes('首页'))[0].id
      if (res&&res.data&&res.data.data) {
        return {
          noticeInfo: res.data.data,
          pageViews: res.data.data.pageViews,
          preInfo: res.data.data.last || {},
          nextInfo: res.data.data.next || {},
          introList: res.data.data.jsNavigationVoList || [],
          clumnInfo: clumnInfo,
          loading: false,
          navList: navList,
          shouyeId
        };
      }
    } catch (error) {
      redirect('/404')
    }
  },
  data() {
    return {
      clumnInfo: {},
      qrStatus: false,
      href: "",
      pageViews: 0,
      loading: true,
      noticeInfo: {},
      nextInfo: {},
      preInfo: {},
      childIndex1: null,
      childIndex: null,
      imgUrl:process.env.CDN_BASE_URL,
      number: "",
      sydq:"", //适用地区
      wtlxNo:"", //问题类型
      hblxNo:"", //汇编类型
      hylxNo:"", //行业类型
      gk:"", //归口
      introList: [],
      shareSrc:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=",
      viewUrl: require("@/assets/images/notice/icon_view.png"),
      shareUrl: require("@/assets/images/notice/icon_share.png"),
      showIndex: null,
      navIndex: null
    };
  },
  filters: {
    timeFilter(val){
      if(val){
        return val.slice(0,10)
      }
    },
  },
  methods: {
    showQr() {
      this.qrStatus = true;
    }, //下载附件
    openFiles(item){
      let imgs = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
      let img = imgs.indexOf((item.url.substr(item.url.lastIndexOf(".")+1)).toLowerCase()) !== -1
      console.log(img);
      if(img) return this.dowondImg(this.imgUrl + item.url,item.name)
      window.open(this.imgUrl + item.url)
    },
    //点击下载图片
    dowondImg(url,name) {
      this.getUrlBase64(url).then((base64) => {
        const link = document.createElement("a");
        link.href = base64;
        link.download = name || 'photo';
        // link.download = this.$route.query.source;
        link.click();
      });
    },
    // 创建一个canvas，把图片转成base64的格式，再赋值给a标签,点击下载
    getUrlBase64(imgUrl) {
      return new Promise((resolve) => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let img = new Image(); //允许进行跨域
        img.crossOrigin = "Anonymous";
        img.src = imgUrl;
        img.onload = function() {
          canvas.height = img.height; //图片的高度
          canvas.width = img.width;//图片的宽度
          ctx.drawImage(img, 0, 0, img.width, img.height);
          let dataURL = canvas.toDataURL("image/png");
          canvas = null;
          resolve(dataURL);
        };
      });
    },
    toOtherDetail(obj, status) {
      const newPath = this.$router.resolve({
        path: "/article-list/" + obj.number,
        query: {
          oneId: obj.columnId,
          childId: this.$route.query.childId
        },
      });
      status == true
        ? window.open(newPath.href, "_self")
        : window.open(newPath.href);
    },
    getDetail() {
      this.loading = true;
      let params = {
        number: this.number,
        sydq: this.sydq, //适用地区
        wtlxNo: this.wtlxNo, //问题类型
        hblxNo: this.hblxNo, //汇编类型
        hylxNo: this.hylxNo, //行业类型
        gk: this.gk //归口
      }
      getNavDetail(params).then((res) => {
        if (res.code == CodeMsg.CODE_1000) {
          this.noticeInfo = res.data;
          this.pageViews = res.data.pageViews;
          if (res.data.last) {
            this.preInfo = res.data.last;
          }
          if (res.data.next) {
            this.nextInfo = res.data.next;
          }
          if(res.data.jsNavigationVoList&&res.data.jsNavigationVoList.length>0){
            this.introList = res.data.jsNavigationVoList
          }
          this.loading = false;
        }
      });
    },
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
    //qq分享
    qqShare() {
      let urlData =
        "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" +
        window.location.href +
        "&sharesource=qzone&title=" +
        this.noticeInfo.metaTitle +
        "&pics=你的分享图片&summary=" +
        this.noticeInfo.metaDescription;
      window.open(urlData, "_self");
    },
    //微博分享
    weiboShare() {
      let urlData =
        "http://service.weibo.com/share/share.php?&sharesource=weibo&title=" +
        this.noticeInfo.metaTitle +
        "&url=" +
        window.location.href +
        "&pic=你的分享图片&appkey=1343713053";
      window.open(urlData, "_self");
    },
  },
  mounted() {
    this.href = window.location.href;
    this.getNavIndex();
    // this.number = this.$route.query.number;
    // this.sydq = this.$route.query.sydq;
    // this.wtlxNo = this.$route.query.wtlxNo;
    // this.hblxNo = this.$route.query.hblxNo;
    // this.hylxNo = this.$route.query.hylxNo;
    // this.gk = this.$route.query.gk;
    // this.addView();
  },
};
</script>

<style scoped>
.article_detail {
  background: #f7f8f9;
  width: 100%;
  padding: 10px 0px;
  overflow: hidden;
}
.article_detail_contain {
  width: 970px;
  display: flex;
  margin: 0 auto;
  align-items: flex-start;
  margin-top: 120px;
}
.contain_left {
  width: 970px;
  min-height: 600px;
  margin-right: 10px;
  background: #ffffff;
  border-radius: 5px;
  padding: 19px 15px;
}
.active_contain_left {
  width: 62.5% !important;
}
.essay_left_top {
  min-height: 68px;
  border-bottom: 1px solid #eceaea;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
}
.essay_title {
  font-size: 18px;
  color: #3d3e3e;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
}
.essay_contant {
  display: flex;
  justify-content: space-between;
  color: #bbbbbb;
  font-size: 12px;
  position: relative;
}
.essay_contant > div:nth-of-type(2) {
  display: flex;
  justify-content: space-between;
}
.essay_contant > div:nth-of-type(2) > span {
  display: flex;
  justify-content: center;
  align-items: center;
}
.essay_contant > div:nth-of-type(2) > span > img {
  margin-right: 5px;
}
.essay_contant > div:nth-of-type(2) > span:nth-of-type(1) {
  margin-right: 30px;
}
.essay_contant > div:nth-of-type(2) > span:nth-of-type(2) {
  cursor: pointer;
}
.essay_contant img {
  widows: 14px;
  height: 12px;
}
.share_img_contain {
  position: absolute;
  right: -25px;
  top: 15px;
  width: 180px;
  min-height: 180px;
  background: #ffffff;
  border: 1px solid rgb(235, 231, 231);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0 15px 0;
  color: #474646;
}
.share_img_contain > p:nth-of-type(1) {
  margin-bottom: 10px;
}
.share_img_contain > p:nth-of-type(2) {
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}
.share_img_contain > div {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.share_img_contain > div > span {
  cursor: pointer;
  transition: 0.3s;
}
.share_img_contain > div > span:hover {
  color: #36a6fe;
}
.share_img_contain > div > span:nth-of-type(2) {
  margin-left: 20px;
}
.share_img_contain img {
  margin-bottom: 15px;
  width: 110px;
  height: 110px;
}
.contain_right {
  width: 220px;
  background: #ffffff;
  border-radius: 5px;
  padding-bottom: 10px;
}
.essay_left_bottom {
  padding: 16px 0;
  color: #333333;
  font-size: 12px;
  min-height: 300px;
}
.right_intro_title {
  width: 220px;
  height: 50px;
  background: #93B874;
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  border-radius: 5px 5px 0px 0px;
}
.right_intro_item {
  width: 220px;
  height: 106px;
  padding: 14px 17px;
  border-top: 1px solid #e7e5e5;
  cursor: pointer;
}
.right_intro_item > div:nth-of-type(1) {
  font-size: 14px;
  color: #333333;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 8px;
}
.right_intro_item > div:nth-of-type(2) {
  width: 100%;
  height: 34px;
  color: #666666;
  font-size: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px;
}
.right_intro_item > div:nth-of-type(3) {
  font-size: 12px;
  display: flex;
  justify-content: space-between;
}
.right_intro_item > div:nth-of-type(3) > span:nth-of-type(1) {
  color: #666666;
}
.right_intro_item > div:nth-of-type(3) > span:nth-of-type(2) {
  color: #93B874;
  cursor: pointer;
}
.essay_other {
  width: 100%;
  font-size: 14px;
  margin-top: 50px;
  border-top: 1px solid #eeeaea;
  padding-top: 21px;
  display: grid;
  grid-template-columns: repeat(2,1fr);
  grid-gap: 30px;
}
.essay_other a{
  text-decoration: none;
}
.essay_other > a:nth-of-type(1) {
  margin-bottom: 9px;
}
.essay_other > a > span:nth-of-type(1) {
  color: #000000;
  opacity: 0.5;
  cursor: pointer;
}
.essay_other > a > span:nth-of-type(2) {
  color: #3d3e3e;
  cursor: pointer;
}
.essay_desc>span:nth-of-type(3){
  display: inline-block;
  width: 90px;
  height: 14px;
  overflow: hidden;
}
.nav_item_contain {
  width: 1190px;
  z-index: 1000;
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

.adjunct-t{
  font-size: 16px;
  font-weight: 500;
  color: #36A6FE;
  margin-bottom: 8px;
}
.adjunct-i{
  display: flex;
  align-items: center;
}
.adjunct-i a{
  font-size: 14px;
  color: #36A6FE;
  line-height: 28px;
  cursor: pointer;
}
.adjunct-i img{
   width: 20px;
   margin-left: 12px;
}

.pointer-contain-sty{
  margin-top: 10px;
}
.noselect {
  -webkit-user-select: none;
  /* iOS Safari */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* IE/Edge */
  user-select: none;
  /* 通用属性 */
  -webkit-touch-callout: none;
  /* iOS Safari */
}
</style>
