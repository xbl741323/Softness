<template>
  <client-only>
    <div class="frame">
      <div class="breadcrumbSty">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item 
          :to="{path: policyPath}">
            {{policyValue}}
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{policyValue}}详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="details-content">
        <div v-if="collectStatus" :class="[proList&&proList.length>0?'left-details':'left-detaill']">
          <p class="titSty">{{ dataList.title }}</p>
          <div class="mar">
            <div class="boxSty">
              <span class="info-item" v-if="dataList.categoryId">{{dataList.categoryId | filterCate}}</span>
              <i v-if="dataList.policyTypeValue =='政策汇编'" class="iconfont iconSty">&#xe628;</i>
              <span class="iconsty">{{dataList.policyTypeValue}}</span>
              <i class="iconfont greySty" >&#xe618;</i>
              <span class="iconsty">{{ dataList.createTime | filterTime}}</span>
              <i class="iconfont color1">&#xe640;</i>
              <span class="color2">{{ dataList.pageViews }}次</span>
              <i class="iconfont shareSty">&#xe72f;</i>
              <span class="share sharesty">{{ $t('share.TXT1') }}
                <div class="share-box">
                  <div class="mart">
                      <p style="font-size:12px">{{ $t('share.TXT2') }}</p>
                      <img
                        title="本文二维码，手机扫一扫，精彩随身带!"
                        class="share1"
                        :src="'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' +this.href"
                        alt=""
                        width="68"
                        height="68"
                      >
                  </div>
                  <div style="margin-top:0px;">
                    <p class="share2">{{ $t('share.TXT3') }}：</p>
                    <div class="share3">
                      <p class="marlr" @click="qqShare()">
                        <i class="iconfont share4">&#xe666;</i>{{ $t('share.TXT4') }}
                      </p>
                      <p @click="weiboShare()">
                        <i class="iconfont share5">&#xe73c;</i>{{ $t('share.TXT5') }}
                      </p>
                    </div>
                  </div>
                </div>
              </span>
              <template v-if="policyType!=2">
                  <span v-if="collectId<2">
                    <i class="iconfont collectSty1" @click="collect(1)">&#xe6c8;</i>
                    <span class="collectSty2" @click="collect(1)">收藏</span>
                  </span>
                  <span v-else>
                    <i class="iconfont collectSty3" @click="collect(2)">&#xe6c8;</i>
                    <span class="collectSty2" @click="collect(2)">已收藏</span>
                  </span>
              </template>
            </div>
            <div class="info-box" v-if="policyType==0">
              <div :class="[dataList.applyType==1?'orange':dataList.applyType==2?'blue':'grey','info-item']" 
                v-if="id==0&&dataList.applyType">
                {{dataList.applyType | filterType}}
              </div>
              <div class="info-item" v-if="dataList.level">{{dataList.level | filterLevel}}</div>
              <div class="info-item" v-if="dataList.areaFullName">{{dataList.areaFullName}}</div>
              <div class="info-item" v-if="dataList.optionName">{{dataList.optionName}}</div>
            </div>
            <div class="marg">
              <div class="dateSty" v-if="policyType==0&&dataList.applyStartTime">申报起止日期： {{dataList.applyStartTime}}--{{dataList.applyEndTime}}</div>
              <p class="speciallycotent" v-html="dataList.content" />
            </div>
            <!-- 本文附件 -->
            <div v-if="this.fileLength > 0" class="attachment">
              <span class="fontSty">
                <i class="iconfont fontSty">&#xe62d;</i>
                &nbsp;{{ $t('txt.attachment') }}：
              </span>
              <div v-for="(item, index) in dataList.filesList" :key="item.id">
                <el-tooltip
                  :content="policyType==0?(index + 1 + '.' + item.name): (index + 1 + '.' + item.title)"
                  placement="top"
                  effect="light">
                  <p class="tipSty">
                    <span
                      class="spanSty"
                      @click="download(item)"
                    >
                      <span v-if="id==0">{{ index + 1 }}.{{ item.name}}</span>
                      <span v-else>{{ index + 1 }}.{{ item.title }}</span>
                    </span>
                  </p>
                </el-tooltip>
              </div>
            </div>
            <div class="last-next">
              <client-only>
                <p
                  v-if="showLast"
                  class="lastone"
                  @click="toLast(last.preNumber, last.preId)"
                >
                  <span class="col">{{ $t('txt.lastarticle') }} ></span>{{ last.preTitle }}
                </p>
                <p v-if="showNext" @click="toLast(next.nextNumber, next.nextId)">
                  <span class="col">{{ $t('txt.nextarticle') }} ></span>{{ next.nextTitle }}
                </p>
              </client-only>
            </div>
          </div>
        </div>
        <div v-if="!collectStatus" class="collect_fail">
          <img src="@/assets/images/zhengce/collect_fail@2x.png" alt="">
          <p class="noData">
            咦，这篇文章不见啦！
          </p>
        </div>
          <div class="right-details" v-if="policyType==0&&proList.length>0">
          <div class="reco-title">推荐产品</div>
          <div class="right_content">
            <div
              v-for="(item, index) in proList"
              :key="index"
              class="prod_side">
              <div class="box" @click="goDetail(item.id)">
                <img :src="cdnUrl+item.imageUrl" width="200" height="130" class="img-sty"/>
                <div class="tit">{{item.spuTitle}}</div>
                <div class="deposit">
                  <template v-if="item.isOnline==true">
                        <span v-if="item.spuMaxAmount==item.spuMinAmount" class="pricesize"><span class="pricemark">¥</span>{{item.spuMinAmount | filterViewprice}}</span>
                        <span v-else class="pricesize"><span class="pricemark">¥</span>{{item.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
                  </template>
                  <template v-if="item.isOnline==false">
                        <span>面议</span>
                  </template>
                </div>
              </div>
            </div>
          </div>
          </div>
          <div class="right-details" v-if="policyType>0">
            <div class="right_content">
                <div>
                  <right-side :typeId="policyType"></right-side>
                </div>
            </div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import qs from 'qs'
import * as CodeMsg from "@/api/CodeChange"
import RightSide from '@/components/policy/rightSide'
import tools from '@/utils/priceDeal' 
import {
  recommendProducts,
  getPreAndNext,
  getCollectStatus,
  addCollect,
  deleteCollect,
  views,
  esPagePolicy,
  esPageFile
} from '@/api/announcement'
import { getQuestionList } from "@/api/question";
export default {
  props: ['articleNo', 'typeId', 'data', 'view'],
  // components不支持asyncData
  components: {
    RightSide
  },
  data() {
    return {
      collectStatus: true,
      filePathUrl: process.env.baseUrl,
      cdnUrl:process.env.CDN_BASE_URL,
      show: false,
      articleId: '',
      fileLength: '',
      dataList: {},
      proList: [],
      href: '',
      id: '',
      screenType: '',
      last: {},
      next: {},
      collectId: '',
      pageViews: '',
      accountId: null,
      showLast: false,
      showNext: false,
      policyValue: '',
      policyPath:'',
      policyType: null,
      mobileUrl: process.env.MOBILE_URL,
      userId: null,
    }
  },
  filters: {
    filterType(val){
        return val == 1 ? '未开始' : val == 2 ? '申报中' : val == 3 ? '已结束': ''
    },
    filterLevel(val) {
      return val == 1 ? '国家级': val == 2 ? '省级' : val == 3 ? '市级': val == 4 ? '区级': ''
    },
    filterTime(val) {
      if(val){
         return val.slice(0,10);
      }
    },
    filterCate(val){
      return val == 1 ? '项目申报' : val == 2 ? '知识产权' : val == 7 ? '工商财税' : val == 9 ? '融资上市' : val == 10 ? '法律服务':val == 11 ? '软件开发':''
    },
    filterViewprice(val){
        return tools.filterViewprice(val)
    }
  },
  created() {
    // 自定义type: 0-通知公告 1-行业资讯 2-卧涛问答 3-卧涛文档
    if(this.$route.path.indexOf('TZ')>-1 || this.$route.query.draftType == "notice"){
      this.policyValue = '通知公告'
      this.policyPath = '/policy/announcement'
      this.policyType = 0
    }else if(this.$route.path.indexOf('ZC')>-1){
      this.policyValue = '政策汇编'
      this.policyPath = '/policy/assembly'
      this.policyType = 2
    }else if(this.$route.path.indexOf('HY')>-1||this.$route.path.indexOf('ZX')>-1){
      this.policyValue = '行业资讯'
      this.policyPath = '/policy/industryinfo'
      this.policyType = 1
    }
    this.articleId = this.articleNo;
    this.id = this.typeId;
    this.articleId = this.$route.params.policyDetails.substr(
      0,
      this.$route.params.policyDetails.length - 2
    ); // 截取文章编号
    this.id = this.$route.params.policyDetails.substr(
      this.$route.params.policyDetails.length - 2,
      1
    ); // 截取文章类型
    this.screenType = this.$route.params.policyDetails.substr(
      this.$route.params.policyDetails.length - 1,
      1
    ); // 截取筛选类型
    if (this.data&&this.data.detail) {
      this.dataList = this.data.detail;
    };
    if(this.data&&this.data.detail&&this.data.detail.filesList&&this.data.detail.filesList.length>0){
        this.fileLength = this.data.detail.filesList.length
      }
    if(this.data&&this.data.pre){
      this.last = {
        preId: this.data.pre.id,
        preNumber: this.data.pre.industryNo,
        preTitle: this.data.pre.title
      }
      this.showLast = true
    }
    if(this.data&&this.data.next){
      this.next  = {
        nextId: this.data.next.id,
        nextNumber: this.data.next.industryNo,
        nextTitle: this.data.next.title
      }
      this.showNext = true
    }
    if(this.dataList.prods&&this.dataList.prods.length>0){
      this.getProList()
    }
  },
  mounted() {
    this.href = this.mobileUrl + window.location.pathname + window.location.search
    if(this.$route.path.indexOf('TZ')>-1){
      this.getPreAndNext()
    }
    this.getViews()
  },
  methods: {
    // 获取收藏状态
    judgeCollectStatus(){
      let params = {
        collectSource: 1,//收藏来源 1-PC 2-H5 3-小程序
        infoId: this.$route.query.id,
        title: this.dataList.title,
      }
      if(localStorage.getItem('userInfo')) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.userId = userInfo.userId
        params.userId = userInfo.userId
      }
      getCollectStatus(params).then(res=>{
        if(res.data.code == 10002){
          this.collectId = 0
          return false
        }
        if(res.data.code == 0){
          this.collectId = res.data.data==false ? 1 : 2
        }
      })
    },
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
          if(res.data.code == CodeMsg.CODE_0){
            this.proList = res.data.data
          }
        })
      }else{
        this.proList = []
      }
    },
    getViews() {
      views(this.articleId).then((res) => {
        if(res.data.code == 1000){
          this.pageViews = res.data.data
        }
      })
    },
    toLast(number,id) {
      // 上下篇切换
      window.open(number + '0' + 1+'?id='+id, '_self')
    },
    // 跳转到对应列表
    toList(data) {
      this.$router.push({
        name: data
      })
    },
    // 右侧推荐跳转到对应详情
    checkDetail(detailRouter, item, value) {
      if (value == '0' || value == '1') {
        // 通知公告、政策汇编
        window.open(detailRouter + item.number + value + 1+'?id='+item.id)
      } else if (value == '10') {
        // 行业资讯
        window.open(detailRouter + item.number + value + 1)
      } else {
        // 卧涛问答
        window.open(detailRouter + item.number + 2)
      }
    },
    // 文件下载
    download(item){
      let imgs = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
      let img = imgs.indexOf((item.url.substr(item.url.lastIndexOf(".")+1)).toLowerCase()) !== -1
      if(img) return this.dowondImg(this.cdnUrl + item.url,item.name)
      window.open(this.cdnUrl + item.url)
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
    collect(status) {
      if(localStorage.getItem('userInfo')) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.userId = userInfo.userId
      }else{
        location.href = "/login";
        sessionStorage.setItem('collectLink',this.$route.path + '?' + qs.stringify(this.$route.query))
        return false
      }
      const param = {
        collectSource: 1,//收藏来源 1-PC 2-H5 3-小程序
        title: this.dataList.title,
        userId: this.userId,
        type: this.policyType == 0 ? 1 : 2
      }
      if (status == 1) {
        // status 1-添加收藏 2-取消收藏
        param.infoId = this.$route.query.id
        param.infoNo = this.articleId
        addCollect(param).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              type: 'success',
              message: '收藏成功！',
              offset: 300,
              duration: 1500
            })
            this.judgeCollectStatus()
          }
        })
      } else {
        param.infoIds = [this.$route.query.id]
        deleteCollect(param).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              type: 'warning',
              message: '取消收藏成功',
              offset: 300,
              duration: 1500
            })
            this.judgeCollectStatus()
          }
        })
      }
    },
    // qq分享
    qqShare() {
      const urlData =
        'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' +
        window.location.href +
        '&sharesource=qzone&title=政策公告&pics=你的分享图片&summary=你的分享描述信息'
      window.open(urlData, '_blank')
    },
    // 微博分享
    weiboShare() {
      const urlData =
        'http://service.weibo.com/share/share.php?&sharesource=weibo&title=政策公告&url=' +
        window.location.href +
        '&pic=你的分享图片&appkey=1343713053'
      window.open(urlData, '_blank')
    },
    //获取通知公告上一篇下一篇
    getPreAndNext(){
      getPreAndNext(this.$route.query.id).then(res => {
        if(res.data.code == CodeMsg.CODE_0){
          if(res.data.data.preId){
            this.last = {
              preId: res.data.data.preId,
              preNumber: res.data.data.preNumber,
              preTitle: res.data.data.preTitle
            }
            this.showLast = true
          }
          if(res.data.data.nextId){
            this.next  = {
              nextId: res.data.data.nextId,
              nextNumber: res.data.data.nextNumber,
              nextTitle: res.data.data.nextTitle
            }
            this.showNext = true
          }
        }
      })
    },
  }
}
</script>

<style lang="stylus" scoped>
.circle{
  background:url('~@/assets/images/industry/yuanquan_gray@2x.png') no-repeat;
  background-size:4px 4px;
  background-position: left;
}
.circle:hover{
  color: #36A6FE;
  url('~@/assets/images/industry/yuanquan_blue@2x.png') no-repeat;
  background-size:4px 4px;
  background-position: left;
}
.frame{
    width:100%;
    user-select: none;
    min-height:630px;
    background:#F1F1F1;
    font-family:Microsoft YaHei UI;
    font-size:14px;
    .details-content{
        width:1200px;
        margin:0 auto;
        padding-bottom:20px;
        display:flex;
        .collect_fail{
        width:75%;
        min-height:600px;
        background:#FFF;
        display flex
        justify-content center
        align-items center
        flex-direction column
        img{
            width 170px
            height 170px
            margin-top -160px
        }
        }
        .left-details{
            width:75%;
            min-height:590px;
            background:#FFF;
            border-radius: 10px;
            position: relative;
            .last-next{
                padding:30px;
                cursor:pointer;
                color:#656565;
                line-height:25px;
                .lastone{
                    margin-bottom:5px;
                }
            }
            .share-box{
                width:200px;
                border:1px solid #EEE;
                color:#000;
                background:#FFF;
                display:none;
                position:absolute;
                padding-bottom:10px;
            }
            .share:hover .share-box{
                display:inline-block;
            }
        }
        .left-detaill{
            width:100%;
            min-height:590px;
            background:#FFF;
            border-radius: 10px;
            position: relative;
            .last-next{
                padding:30px;
                cursor:pointer;
                color:#656565;
                line-height:25px;
                .lastone{
                    margin-bottom:5px;
                }
            }
            .share-box{
                width:200px;
                border:1px solid #EEE;
                color:#000;
                background:#FFF;
                display:none;
                position:absolute;
                padding-bottom:10px;
            }
            .share:hover .share-box{
                display:inline-block;
            }
        }
        .right-details{
            width:24%;
            margin-left:1%;
            background:#FFF;
            .right_content{
                width:99%;
                margin-left:1%;
                margin-bottom:10px;
                margin-top:10px;
                background:#FFF;
                .policy_side{
                    width:100%;
                    padding:10px 10px;
                    .policy_content{
                        margin:14px 0;
                        .art_list{
                            color:#86898B;
                            font-size:14px;
                            overflow:hidden;
                            cursor:pointer;
                            text-overflow:ellipsis;
                            display:-webkit-box;
                            -webkit-box-orient:vertical;
                            -webkit-line-clamp:1;
                        }
                        .file_download{
                            text-decoration:none;
                            color:#36A6FE;
                            font-size:14px;
                            overflow:hidden;
                            cursor:pointer;
                            text-overflow:ellipsis;
                            display:-webkit-box;
                            -webkit-box-orient:vertical;
                            -webkit-line-clamp:1;
                        }
                    }

                }
            }
        }
    }
}

.speciallycotent{
      >>> img {
          max-width: 100%;
          height: auto !important;
        }
}
.dateSty {
  color: #3DA7F8;
  margin-bottom: 15px;
  margin-left: 6px;
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #36a6fe;
}
.divSty {
  width: 75px;
  height: 30px;
  line-height: 30px;
  background: #36a6fe;
  position: absolute;
  right: 0;
  border-radius:0 10px 0 10px;
  color: #fff;
  font-size: 14px;
  text-align: center;
}
.titSty {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  padding: 40px 30px 0 30px;;
}
.mar {
  margin: 10px 0;
}
.boxSty {
  text-align: center;
  font-size: 12px;
}
.iconSty {
  color: gray;
  margin-right: 5px;
}
.iconsty {
  color:#A8A8A8; 
  margin-right: 20px;
}
.greySty {
  color: gray;
}
.color1 {
  color: gray;
  margin-right: 5px;
}
.color2 {
  color: gray;
  margin-right: 20px;
}
.shareSty {
  color: gray;
  margin-right: 5px;
  position: relative;
}
.sharesty {
  color: #A8A8A8;
  margin-right: 17px;
  cursor: pointer;
}
.mart {
  text-align: center;
  margin-top: 15px;
}
.share1 {
  width: 100px; 
  height: 100px;
  margin: 0px auto;
  margin-top: 10px;
}
.share2 {
  font-size: 12px;
  margin: 0px 0 10px 0;
  padding-top: 10px;
}
.share3 {
  display: flex;
  width: 170px;
  margin: 0 auto;
  padding-bottom: 10px;
  font-size: 12px;
}
.share4 {
  color: #FFBF31;
  font-size: 16px;
  margin-right: 3px;
}
.share5 {
  color: #D62D2F;
  font-size: 16px;
  margin-right: 3px;
}
.marlr {
  margin-left: 10px;
  margin-right: 15px;
}
.collectSty1 {
  color: #A8A8A8;
  margin-right: 5px;
  cursor: pointer;
}
.collectSty2 {
  color: #A8A8A8;
  margin-right: 20px;
  cursor: pointer;
}
.marg {
  margin: 50px 40px;
}
.col {
  color: #A8A8A8;
}
.noData {
  color: #BFBFBF;
  font-size: 16px;
  margin-top: 14px;
}
.tipSty {
  color: #36A6FE;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.spanSty {
  text-decoration: none;
  color: #36A6FE;
}
.labSty {
  color: #233558; 
  font-size: 14px; 
  font-weight: bold;
}
.moreSty {
  float: right;
  color: #656565;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.mar4 {
  margin-right: 4px;
  color: #A8A8A8;
  font-weight: bold;
  font-size: 12px;
}
.mar10 {
  margin-left: 10px;
}
.fontSty {
  font-size:16px;
  margin-bottom: 5px;
  display: inline-block;
}
.attachment{
  margin:20px 10px;
  line-height:25px;
  padding-left: 15px;
}
.breadcrumbSty {
  display: flex;
  width: 1200px;
  margin: 0 auto;
  margin-bottom: 20px;
}
.box {
  display: flex;
  flex-direction: column;
  width: 220px;
  margin-bottom: 15px;
}
.box:hover {
  cursor: pointer;
}
.img-sty {
  border-radius: 10px;
}
.reco-title {
  margin: 20px 0 0px 20px;
  font-weight: bold;
  font-size: 14px;
}
.prod_side {
  width: 100%;
  display: flex;
  justify-content: center;
}
.tit {
  width: 200px;
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
  font-weight: 400;
  color:#FD4A1C;
  // position: absolute;
  // left: 22px;
  // bottom:8px;
}
.pricesize{
  font-size: 18px;
}
.pricemark{
  font-size: 12px;
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
  border-radius: 4px;
  font-size: 12px;
  font-family: Source Han Sans CN, Source Han Sans CN-Light;
  font-weight: 300;
  color: #36a6fe;
  margin: 10px;
  padding: 5px 10px 5px 10px;
}
</style>
