<template>
  <client-only>
    <div
      class="frame"
      v-loading="loading"
      element-loading-text="请点击右上角···选择浏览器打开"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="article">
        <div class="head">
          <i class="iconfont" @click="goBack">&#xe641;</i>
          <p>{{ policyValue }}详情</p>
          <i class="iconfont" @click="homePage()">&#xe617;</i>
        </div>
        <div class="collect_fail" v-if="!collectStatus">
          <img :src="require('~/assets/images/technology/No_content_icon@2x.png')" alt />
          <p>咦，这篇文章不见啦！</p>
        </div>
        <div v-if="collectStatus">
          <div class="content">
            <p class="art-title">{{ dataList.title }}</p>
          </div>
          <div style="margin-left: 20px;padding-bottom:15px;" v-if="options.length > 0">
            <el-tag style="padding:0 15px" v-for="(item, index) in options.slice(0, 2)" :key="index">
              {{
                item.optionName.length > 8
                  ? item.optionName.substring(0, 8)
                  : item.optionName
              }}
            </el-tag>
            <el-dropdown v-if="options.length > 2" trigger="click">
              <el-tag> 共{{ options.length }}个行业 <i class="el-icon-arrow-right"></i></el-tag>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in options.slice(2)"
                  :key="index"
                >
                  <el-tag>
                    {{
                      item.optionName.length > 8
                        ? item.optionName.substring(0, 8)
                        : item.optionName
                    }}
                  </el-tag>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <client-only>
            <div class="releseTime">
              <p class="info-item" v-if="dataList.categoryId">
                <span >{{ dataList.categoryId | filterCate }}</span>
              </p>
              <p class="flex-sty">
                <i class="iconfont greySty" >&#xe618;</i>
                <span>{{ dataList.createTime | filterTime }}</span>
              </p>
              <p class="flex-sty">
                <span class="fix-sty"><i class="iconfont">&#xe640;</i></span>
                <span>{{ this.pageViews }}次</span>
              </p>
              <p class="flex-sty" @click="goWechat">
                <span
                  ><i
                    class="iconfont"
                    style="
                      color: #a8a8a8;
                      font-size: 12px;
                      margin-right: 0.1rem;
                    "
                    >&#xe6c8;</i
                  ></span
                >
                <span>收藏</span>
              </p>
            </div>
            <div class="info-box" v-if="policyType==1">
              <div class="info-item" v-if="dataList.level">{{dataList.level | filterLevel}}</div>
              <div class="info-item" v-if="dataList.areaFullName">{{dataList.areaFullName}}</div>
              <div class="info-item" v-if="dataList.optionName">{{dataList.optionName}}</div>
            </div>
          </client-only>
          <div
            v-if="userInformation.nickname || userInformation.username"
            style="background: #E7E6EB; height: 1px"
          ></div>
          <div class="article-content">
            <div class="data-content font-sty" v-if="dataList.applyStartTime">
              <span>申报起止日期:{{dataList.applyStartTime}}--{{dataList.applyEndTime}}</span>
              <span :class="[dataList.applyType==1?'orange':dataList.applyType==2?'blue':'grey','tag-sty']" v-if="dataList.applyType">
                {{dataList.applyType | filterType}}
              </span>
            </div>
            
            <div class="data-content" v-html="dataList.content"></div>
          </div>
        </div>
      </div>
      <div v-if="collectStatus">
        <div class="file" v-if="this.fileListLength > 0">
          <div class="attachment">
            <p><i class="iconfont">&#xe62d;</i>本文附件</p>
            <div class="item">
              <file-item v-for="(item,index) in dataList.filesList" :key="index" :item="item" :type="0"></file-item>
            </div>
          </div>
        </div>
        <mt-popup
          v-model="popupVisible"
          position="bottom"
          class="share-box"
          v-if="popupVisible"
        >
          <div class="nativeShare">
            <div class="list">
              <span
                class="list-item"
                v-for="(button, index) in shareButtons"
                :key="index"
              >
                <img
                  :src="require('@/assets/images/' + button.src)"
                  class="i"
                  @click="call(button)"
                />
                {{ button.text }}
              </span>
            </div>
          </div>
        </mt-popup>
        <div class="page_change" v-if="proList&&proList.length>0">
          <div>
            <div class="pro_icon"></div>
            <div class="pro_sty">推荐产品</div>
          </div>
          <div class="prod_side">
              <div class="box" v-for="(item, index) in proList" :key="index" @click="goDetail(item.id)">
                <img :src="cdnPath+item.imageUrl" height="103" class="img-sty"/>
                <div class="tit">{{item.spuTitle}}</div>
                <div class="deposit">
                  <template v-if="item.isOnline==true">
                        <span v-if="item.spuMaxAmount==item.spuMinAmount" class="pricesize"><span class="pricemark">¥</span>{{item.spuMinAmount}}</span>
                        <span v-else class="pricesize"><span class="pricemark">¥</span>{{item.spuMinAmount}}<span class="earn">/起</span></span>
                  </template>
                  <template v-if="item.isOnline==false">
                        <span>面议</span>
                  </template>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
var NativeShare, mShare;
import { Toast } from "mint-ui"
import * as CodeMsg from "@/api/CodeMsg";
import policyItem from "@/components/collect/policyItemHot";
import Encrypt from '~/plugins/Encrypt'
import fileItem from "@/components/policySquare/fileDowland/fileItem";
import {
  getArtcleDetail,
  getNoticeDetail,
  getIndustryDetail,
  collection,
  delCollect,
  views,
  downloadFile,
  recommendProducts,
} from "@/api/policySquare";
import {toWx} from '@/utils/toWx'
export default {
  components: {
    policyItem,
    fileItem
  },
  async asyncData({ params }) {
    if(process.server){
    if (params.policyDetails.length == 16) {
      var articleType = params.policyDetails.substr(
        params.policyDetails.length - 3,
        2
      ); //截取文章类型
      var articleNo = params.policyDetails.substr(
        0,
        params.policyDetails.length - 3
      ); //截取文章编号
      var screenType = params.policyDetails.substr(
        params.policyDetails.length - 1,
        1
      ); //截取筛选类型
    } else {
      var articleType = params.policyDetails.substr(
        params.policyDetails.length - 2,
        1
      ); //截取文章类型
      var articleNo = params.policyDetails.substr(
        0,
        params.policyDetails.length - 2
      ); //截取文章编号
      var screenType = params.policyDetails.substr(
        params.policyDetails.length - 1,
        1
      ); //截取筛选类型
    }
    }
  },
  head() {
    return {
      title: this.dataList.metaTitle,
      meta: [
        { name: "keywords", content: this.dataList.metaKeyword },
        {
          hid: "description",
          name: "description",
          content: this.dataList.metaDescription,
        },
      ],
    };
  },
  layout: "nidaye",
  data() {
    return {
      keyWords: "",
      skiFrom: false,
      page: 1,
      loading: false,
      recoList: [],
      collectStatus: true,
      pageViews: "",
      showPre: true,
      showNext: true,
      preInfo: {},
      nextInfo: {},
      sort: 1,
      catch: "false",
      filePathUrl: process.env.baseUrl,
      fileListLength: "",
      fileList: [],
      popupVisible: false,
      dataList: {},
      articleNo: "",
      length: "",
      articleType: "",
      screenType: "",
      collectId: "",
      options: [],
      userInformation: {},
      cdnPath: process.env.CDN_BASE_URL,
      isSex:null,
      proList: [],
      policyValue:'',
      policyType: null
    };
  },
  filters: {
    filterType(val){
        return val == 1 ? '未开始' : val == 2 ? '申报中' : val == 3 ? '已结束': ''
    },
    filterLevel(val) {
       return val == 1 ? '国家级': val == 2 ? '省级' : val == 3 ? '市级': val == 4 ? '区级': ''
    },
    filterTime(val){
      if(val){
        return val.slice(0,10)
      }
    },
    filterCate(val){
      return val == 1 ? '项目申报' : val == 2 ? '知识产权' : val == 7 ? '工商财税' : val == 9 ? '融资上市' : val == 10 ? '法律服务':val == 11 ? '软件开发':''
    }
  },
  created() {
    //通知公告0、政策汇编1、卧涛问答2、政策汇编10
    this.length = this.$route.params.policyDetails.length;
    if (this.length == 16) {
      this.articleType = this.$route.params.policyDetails.substr(
        this.length - 3,
        2
      ); //截取文章类型
      this.articleNo = this.$route.params.policyDetails.substr(
        0,
        this.length - 3
      ); //截取文章编号
      this.screenType = this.$route.params.policyDetails.substr(
        this.$route.params.policyDetails.length - 1,
        1
      ); //截取筛选类型
    } else {
      this.articleType = this.$route.params.policyDetails.substr(
        this.length - 2,
        1
      ); //截取文章类型
      this.articleNo = this.$route.params.policyDetails.substr(
        0,
        this.length - 2
      ); //截取文章编号
      this.screenType = this.$route.params.policyDetails.substr(
        this.$route.params.policyDetails.length - 1,
        1
      ); //截取筛选类型
    }
    if (this.$route.query.catch) {
      this.catch = this.$route.query.catch;
    }
    if (this.$route.query.sort) {
      this.sort = this.$route.query.sort;
    }
    if (this.$route.query.page) {
      this.page = this.$route.query.page;
    }
    if (this.$route.query.keyWords) {
      this.keyWords = this.$route.query.keyWords;
    }
    if (this.$route.query.skiFrom) {
      this.skiFrom = this.$route.query.skiFrom;
    }
    if(this.$route.path.indexOf('TZ')>-1){
      this.policyValue = '通知公告'
      this.policyType = 1
    }else if(this.$route.path.indexOf('ZC')>-1){
      this.policyValue = '政策汇编'
      this.policyType = 2
    }else if(this.$route.path.indexOf('HY')>-1){
      this.policyValue = '行业资讯'
      this.policyType = 3
    }else if(this.$route.path.indexOf('YN')>-1){
      this.policyValue = '卧涛问答'
      this.policyType = 4
    }
  },
  methods: {
    // 跳转产品详情
    goDetail(id){
      const path = this.$router.resolve({
        path:'/productdetails/details',
        query:{
          spuId:id
        }
      })
      window.open(path.href)
    },
    toMore(num) {
      let path = "";
      if (num == 0) {
        path = "/policy/announcement";
      } else if (num == 1) {
        path = "/policy/assembly";
      } else if (num == 2) {
        path = "/policy/troubleList";
      } else if (num == 10) {
        path = "/policy/industryinfo";
      } else {
        path = "/policy/filesDownload";
      }
      this.$router.push({
        path: path,
      });
    },
    //文件下载
    download(item){
      let imgs = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
      let img = imgs.indexOf((item.url.substr(item.url.lastIndexOf(".")+1)).toLowerCase()) !== -1
      if(img) return this.dowondImg(this.cdnPath + item.url,item.name)
      window.open(this.cdnPath + item.url)
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
    getViews() {
      views(this.articleNo).then((res) => {
        if(res.code==1000){
          this.pageViews = res.data;
        }
      });
    },
    collect(status) {
      if (localStorage.getItem("userInfo")) {
        var userInfo = JSON.parse(localStorage.getItem("userInfo"));
        var id = userInfo.userId;
      } else {
        var id = null;
      }
      let param = {
        accountId: id,
        number: this.articleNo,
        resourceTitle: this.dataList.title,
      };
      if (status == 1) {
        //status 1-收藏 2-取消收藏
        collection(param).then((res) => {
          if (res.code == 0) {
             Toast({
                message: "收藏成功！",
                position: "middle",
                duration: 5000,
            });
            this.getDetail();
          }
        });
      } else {
        delCollect(param).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: "warning",
              message: "取消收藏成功",
              offset: 50,
            });
            this.getDetail();
          }
        });
      }
    },
    toDetail(number, id) {
      const newPath = this.$router.resolve({
        path: "/policy/" + number + this.articleType + this.screenType,
        query: {
          id: id
        },
      });
      window.open(newPath.href, "_self");
    },
    goBack() {
      if (this.skiFrom) {
        let listPath = "";
        if (this.articleType == 0) {
          listPath = "/policy/announcement";
        } else if (this.articleType == 1) {
          listPath = "/policy/assembly";
        } else if (this.articleType == 2) {
          listPath = "/policy/troubleList";
        } else if (this.articleType == 10) {
          listPath = "/policy/industryinfo";
        }
        this.$router.push({
          path: listPath,
          query: {
            skiFrom: this.skiFrom,
            page: this.page,
            search: this.keyWords,
          },
        });
      } else {
        this.$router.go(-1);
      }
    },
    homePage() {
      this.$router.push({
        path: "/",
      });
    },
    // 获取推荐产品列表
    getProList() { 
      let params = {
        spuIds: []
      }
      if(this.dataList.prods.length > 0){
        this.dataList.prods.forEach(item => {
            params.spuIds.push(item.spuId)
        })
        recommendProducts(params).then(res => {
          if(res.code == 0){
            this.proList = res.data
          }
        })
      }
    },
    goWechat() {
      toWx()
    },
    getDetail(){
      if(this.policyType==1){
        this.getNoticeDetail()
      }else if(this.policyType==3){
        this.getIndustryDetail()
      }else{
        this.getOtherDetail()
      }
    },
    getNoticeDetail(){
      let param = {
        number: this.articleNo,
        type: this.articleType,
        id: this.$route.query.id,
        app: "app",
      };
      getNoticeDetail(param).then((res) => {
        if(res.code == 1000){
          // this.collectId = res.data.isCollected;
          this.isSex == null
          this.dataList = res.data.detail;
          this.pageViews = this.dataList.pageViews
          let str = Encrypt.aesDecode(res.data.detail.content);
          this.dataList.content = str;
          let date = new Date()
          let y = date.getFullYear()
          let m = (date.getMonth() + 1) < 10 ? '0'+ (date.getMonth() + 1) : date.getMonth() + 1
          let d = date.getDate() < 10 ? '0'+ date.getDate() : date.getDate()
          let currentDate = new Date(y+'-'+m+'-'+d)
          if(this.dataList.applyStartTime){
            let date1 = new Date(this.dataList.applyStartTime)
            let date2 = new Date(this.dataList.applyEndTime)
            if(currentDate > date2){
              this.dataList.applyType = 3
            }else if(currentDate < date1 ){
              this.dataList.applyType = 1
            }else {
              this.dataList.applyType = 2
            }
          }
          if(this.dataList.prods.length > 0){
            this.getProList()
          }
          this.fileListLength = res.data.detail.filesList.length;
        }else{
          this.collectStatus = false;
        }
      });
    },
    getIndustryDetail(){
      getIndustryDetail(this.articleNo).then((res) => {
        if(res.code == CodeMsg.CODE_1000){
          this.dataList = res.data.detail;
          this.pageViews = this.dataList.pageViews
        }else{
          this.collectStatus = false
        }
      });
    },
    getOtherDetail() {
      let param = {
        number: this.articleNo,
        type: this.articleType,
        screen: this.screenType,
        app: "app",
      };
      getArtcleDetail(param).then((res) => {
       if(res.code == CodeMsg.CODE_1000){
         this.isSex == null
        this.dataList = res.data.detail;
        let str = Encrypt.aesDecode(res.data.detail.content);
        this.dataList.content = str;
        this.fileListLength = res.data.detail.filesList.length;
       }else{
          this.collectStatus = false
        }
      });
    },
  },
  mounted() {
    this.getViews();
    this.getDetail();
  },
};
</script>

<style lang="stylus" scoped>
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: transparent !important;
  color: transparent !important;
}

.el-tag {
  border-radius: 40px !important;
  margin-right: 8px;
}

.frame {
  width: 100%;
  height: 100%;
  background: #E5E5EA;
  font-family: Hiragino Sans GB;

  .article {
    width: 100%;
    background: #FFF;

    .head {
      width: 100%;
      height: 1.17rem;
      border-bottom: 1px solid #E7E6EB;
      display: flex;
      line-height: 1.17rem;
      position: fixed;
      top: 0;
      z-index: 999;
      background: #fff;
    }

    .head i:nth-child(1) {
      font-size: 0.41rem;
      font-weight: normal;
      margin-left: 0.44rem;
    }

    .head p:nth-child(2) {
      width: 100%;
      margin: 0 auto;
      font-size: 0.43rem;
      color: #333333;
      font-weight bold
      text-align: center;
    }

    .head i:nth-child(3) {
      margin-right: 0.44rem;
      font-size: 0.43rem;
    }

    .content {
      width: 100%;
      padding-top: 1.06666666667rem;
      .art-title {
        width: 100%;
        padding: 0.43rem;
        font-size: 0.43rem;
        font-weight: 700;
        text-align: center;
      }
    }

    .releseTime {
      width: 100%;
      color: #999999;
      display: flex;
      height: 0.7rem;
      justify-content: center;
      align-items: center;
    }

    .flex-sty {
      margin-right: 0.35rem;
      margin-top: 0.085rem;
    }

    .fix-sty {
      font-size: 12px;
      margin-right: 0.025rem;
    }

    .article-content {
      // margin: 0.43rem 0px;
      padding-bottom: 0.43rem;
       .article-head{
         margin-left 15px
         display: flex;
         justify-content flex-start
         align-items center
       }
      .data-content {
        // width: 100%;
        overflow: auto;
        margin: 0.43rem;
        margin-top: 16px;
      }
    }
  }

  .file {
    width: 100%;
    background: #FFF;

    .attachment {
      width: 100%;
      font-size: 0.37rem;
      color: #666666;
      p {
        padding-left: 0.34rem;
      }
      .item {
        margin-top: 0.3rem;
        display: flex;
        width: 100%;
        flex-wrap: wrap;
      }
    }

    .attachment i {
      color: #36A6FE;
    }
  }

  .share-box {
    width: 100%;
  }

  .nativeShare {
    width: 100%;
    background: #F8F8F8;
    font-size: 13px;
  }

  .label {
    font-size: 18px;
  }

  .list-item {
    width: 20%;
    display: inline-block;
    text-align: center;
    margin: 15px 0;
  }

  .i {
    width: 32px;
    height: 32px;
    display: block;
    margin: 0 auto;
    margin-bottom: 5px;
    background-size: cover;
  }
}

.page_change {
  background: #ffffff;
  padding-top: 10px;
  padding-bottom: 20px;
}

.page_last {
  margin: 20px 0px 0px 10px;
  padding-top: 10px;
}

.page_last > span:nth-of-type(1) {
  color: #999999;
  font-size: 14px;
}

.page_last > span:nth-of-type(2) {
  color: #656565;
  font-size: 14px;
}

.page_next {
  margin: 10px 0px 0px 10px;
  padding-top: 10px;
}

.page_next > span:nth-of-type(1) {
  color: #999999;
  font-size: 14px;
}

.page_next > span:nth-of-type(2) {
  color: #656565;
  font-size: 14px;
}

.collect_fail {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 1.3333333333rem;
}

.collect_fail img {
  width: 2.986666666667rem;
  height: 2.986666666667rem;
}

.collect_fail p {
  color: #999999;
  font-size: 14px;
  margin-top: 0.23666666667rem;
}

.intro_essay {
  background: #fff;
  padding-top: 50px;
}

.essay_title {
  color: #333333;
  font-size: 16px;
  margin-left: 16px;
  margin-bottom: -10px;
}

.essay_title_two {
  color: #666666;
  font-size: 14px;
  margin-left: 16px;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}

.essay_title_two>span:nth-of-type(2) {
  margin-right: 20px;
}
.font-sty {
  color: #69A1FF;
}
.tag-sty {
  display: inline-block;
  width: 50px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 15px;
  font-size: var(--size-12);
}
.prod_side {
  display: flex;
  flex-wrap: wrap;
  padding: 0 0.32rem 1.28rem 0.32rem;
  justify-content: space-between;
}
.box {
  width: 48.5%;
  margin-bottom: 5px;
}
.box:hover {
  cursor: pointer;
}
.tit {
  width: 100%;
  font-weight: bold;
  font-size: 14px;
  margin: 4px 0 4px 0;
	overflow: hidden;			
	text-overflow: ellipsis;		
	display: -webkit-box;		
	-webkit-line-clamp: 2;			
	line-clamp: 2;					
	-webkit-box-orient: vertical;	
}
.deposit{
  font-size: 18px;
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 700;
  color:#FC8A2A;
  // position: absolute;
  // left: 22px;
  // bottom:8px;
}
.img-sty {
  border-radius: 20px;
  width: 90%;
}
.reco-title {
  margin: 20px 0 0px 20px;
  font-weight: bold;
  font-size: 14px;
}
.pro_sty {
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  padding-left: 15px;
  padding-bottom: 15px;
}
.pro_icon {
  display: inline-block;
  width: 5px;
  height: 19px;
  background: linear-gradient(0deg,#33a7ff, #3a81fd);
}
.blue {
  background: #0989E8;
  color: #fff;
}
.grey {
  background: #B4B4B4;
  color: #fff;
}
.orange {
  background: #FA7F49;
  color: #fff;
}
.info-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.info-item {
  background: #d2ebff;
  border-radius: 5px;
  font-size: var(--size-12);
  font-family: Source Han Sans CN, Source Han Sans CN-Light;
  font-weight: 300;
  color: #36a6fe;
  margin: 0.266666666667rem;
  padding: 0.02rem 0.266666666667rem 0.02rem 0.266666666667rem;
}
</style>
