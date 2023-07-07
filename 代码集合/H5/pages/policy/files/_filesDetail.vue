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
          <p>卧涛文档详情</p>
          <i class="iconfont" @click="homePage()">&#xe617;</i>
        </div>
        <div class="collect_fail" v-if="!collectStatus">
          <img :src="require('~/assets/images/policySquare/no_data@2x.png')" alt />
          <p>暂无数据</p>
        </div>
        <div v-if="collectStatus">
          <div class="content">
            <p class="art-title">{{ fileInfo.fileName }}</p>
          </div>
          <client-only>
            <div class="releseTime">
              <p class="info-item" v-if="fileInfo.level">
                <span >{{ fileInfo.level | filterLevel }}</span>
              </p>
              <p class="info-item" v-if="fileInfo.areaName">
                <span >{{ fileInfo.areaName }}</span>
              </p>
              <p class="flex-sty">
                <img src="@/assets/images/policySquare/icon_calendar@2x.png" alt>
                <span>{{ fileInfo.createTime | filterTime }}</span>
              </p>
              <p class="flex-sty" @click="goWechat()">
                <span><i class="iconfont collect">&#xe6c8;</i></span>
                <span>收藏</span>
              </p>
              <p class="flex-sty" @click="goWechat()">
                <img src="@/assets/images/policySquare/icon_downloads@2x.png" alt>
                <span>下载</span>
              </p>
            </div>
            <div class="file_content">
              <div v-if="fileInfo.pages==0" class="file_tip">
                <img src="@/assets/images/policySquare/bg_tip@2x.png" alt>
                <div>文件暂不支持预览，请直接下载查看详情</div>
              </div>
              <div v-else class="file_img">
                <div v-for="(item,index) in fileList" :key="index" >
                  <img :src="item" alt>
                </div>
                <div class="pay_box"  v-if="fileInfo.isPay==1" @click="goWechat()">
                  <template v-if="total-viewPage==0">
                    试读已结束，付费{{fileInfo.amount}}元，查看信息
                  </template>
                  <template v-else>
                    试读已结束，付费{{fileInfo.amount}}元，查看剩余{{total-viewPage}}页信息
                  </template>
                </div>
              </div>
            </div>
          </client-only>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import * as CodeMsg from "@/api/CodeMsg";
import {
  getDocDetail,
  previewDoc
} from "@/api/file";
import {toWx} from '@/utils/toWx'
export default {
  components: {
  },
  head() {
    return {
      title: this.fileInfo.fileName,
      meta: [
        { name: "keywords", content: this.fileInfo.fileName},
        {
          hid: "description",
          name: "description",
          content: this.fileInfo.fileName,
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
      collectStatus: true,
      showPre: true,
      showNext: true,
      preInfo: {},
      nextInfo: {},
      articleType: "",
      cdnPath: process.env.CDN_BASE_URL,
      fileId: null,//文件ID
      collectId: null,//0-未登录 1-未收藏 2 已收藏,
      fileInfo: {},//文件详情信息
      userId: null,//用户id
      fileList: [],//文件列表
      viewPage: 0,//可看页数
      remain: 0,//剩余页数
      pageNo: 1,
      total: 0,
      isScroll: false,//是否滚动到底
      isBuy: false,//是否购买过,
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
    this.fileId = this.$route.params.filesDetail
  },
  methods: {
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
    goWechat() {
      toWx()
    },
    // 卧涛文档详情
    getDetail(){
      getDocDetail(this.fileId).then(res => {
        if(res.code != CodeMsg.CODE_0){
          this.$message({
              message: res.msg,
              type: 'warning',
              offset: 500,
              duration: 1500
          });
          this.$nextTick(()=>{
            this.collectStatus = false
          })
          return false
        }
        res.data.amount = res.data.amount.toFixed(2)
        this.fileInfo = res.data
      })
    },
    // 卧涛文档文档预览
    getPreview(){
      let params = {
        id: this.fileId,
        userId: null,
        pageNo: this.pageNo,
        pageSize: 5
      }
      previewDoc(params).then(res => {
        if(res.code == CodeMsg.CODE_0){
          let list = this.fileList
          this.fileList = this.isScroll ? list.concat(res.data.urls) : res.data.urls
          this.total = res.data.total
          this.viewPage = res.data.viewPage
          this.isBuy = res.data.payed
        }
      })
    },
    // 滚动加载更多
    handleScroll(){
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      // 变量 windowHeight 是可视区的高度
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      // 变量scrollTop为当前页面的滚动条纵坐标位置
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // 滚动条到底部得距离 = 滚动条的总高度 - 可视区的高度 - 当前页面的滚动条纵坐标位置      
      var scrollBottom = scrollHeight - windowHeight - scrollTop   
      if(scrollBottom <= 200){
        if(this.fileInfo.isPay==0){
          this.isScroll = true
          if(Math.ceil((this.total)/5) > this.pageNo){
            this.pageNo+=1
            this.getPreview()
          }
          return false
        }
      }
    },
  },
  mounted() {
    this.getDetail()
    this.getPreview()
    this.$nextTick(()=>{
      window.addEventListener('scroll', this.handleScroll, true)
    })
  },
};
</script>

<style lang="stylus" scoped>
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
        font-size: var(--size-18);
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: 700;
        color: #555555;
        letter-spacing: 1.08px;
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
      margin: 0.085rem 0.085rem 0.2rem 0;
      height: var(--size-18);
      img {
        width: var(--size-14);
        height: var(--size-14);
        vertical-align: middle;
      }
      span {
        display: inline-block;
        font-size: var(--size-12);
        font-family: Source Han Sans CN, Source Han Sans CN-Regular;
        font-weight: 400;
        text-align: center;
        color: rgba(0,0,0,0.3);
        vertical-align: middle;
      }
      .collect {
        color: #B2B2B2;
        font-size: var(--size-12);
        margin-right: 0.1rem;
      }
    }
  }
  .file_content {
    margin-top: var(--size-20);
    width: 100%;
    display: flex;
    .file_tip {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 5.5733333333333rem;
        height: 5.8133333333333rem;
      }
      div {
        text-align: center;
        font-size: var(--size-14);
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: 700;
        color: #36a6fe;
        letter-spacing: 0.84px;
      }
    }
    .file_img {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      background: #ffffff;
      padding: 0 var(--size-20);
      img {
        width: 100%;
      }
      .pay_box {
        width: 100%;
        height: 3.733333333333333rem;
        background: url("~@/assets/images/policySquare/bg.png") center no-repeat;
        background-size: 100% auto;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 0;
        font-size: var(--size-14);
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: 700;
        color: #36a6fe;
        letter-spacing: 0.84px;
      }
    }
  }
}
.collect_fail {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  img {
    width: 4rem;
    height: 4rem;
    margin-left: var(--size-14);
  }
  p {
    color: #999999;
    font-size: var(--size-14);
    margin-top: 0.23666666667rem;
  }
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
  margin: 0.266666666667rem 0.05rem 0.266666666667rem 0.05rem;
  padding: 0.03rem 0.08rem 0.03rem 0.08rem;
  span {
    font-size: var(--size-12);
  }
}
</style>
