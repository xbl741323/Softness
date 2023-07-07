<template>
  <div class="detail-box">

    <div class="first_box">
      <div class="box">
        <div class="left">
          <div class="slideshow">
            <div class="block">
              <Carousel :list="acData.coverUrls" :width="620" :height="360" isTop="1"/>
                 <div class="view_page" style="margin-top:15px">
                  <span class="view_span_main">
                    <i class="el-icon-view" style="margin-right:2px;"></i>
                    <span>123456</span>
                  </span>
                  <span class="view_span_main" style="margin-left:30px">
                    <i class="el-icon-position" style="margin-right:2px;color:#FFB300;"></i>
                    <span style="color:#FFB300;">分享</span>
                  </span>
                </div>
            </div>
            <div class="right_box">
              <img  v-if="acData.status == 3" src="../../assets/images/shop/jiaoyi_bg@2x.png" width="104" height="104" style="position: absolute;top: 0px;right: 0;"/>
              <img  v-if="acData.status == 0" src="../../assets/images/shop/yixiajia_bg@2x.png" width="104" height="104" style="position: absolute;top: 0px;right: 0;"/>
              <p
                style="font-family:Microsoft YaHei;font-weight:bold;line-height:20px;font-size:17px;"
              >{{acData.achievementName}}</p>
              <p class="desc">{{acData.technologyAbstract}}</p>
               <div class="title">
                <span style="color:#666">价格：</span>
                <span v-if="acData.priceType===1" style="color:#FD651C;font-weight:bold;font-size: 20px;">面议</span>
                <a v-else style="color:#000">
                  <span style="color:#FD651C;font-weight:bold;font-size: 20px;">{{acData.tradePrice}}万元</span>
                </a>
              </div>
               <!-- 全程监督 -->
              <div style="margin-top: 18px;">
                    <div class="intro_three_content">
                      <span class="intro_img_icon" v-for="(item,index) in imgList" :key="index">
                        <img :src="item.imgUrl" alt="" />
                        <span>{{ item.title }}</span>
                      </span>
                    </div>
                  <!-- <div style="margin-left: 28px;position: relative;">
                      <p style="text-align: center;"><i class="iconfont" style="color:#36A6FE;">&#xe616;</i></p>
                      <p style="color:#BFBFBF;">全程监督</p>
                      <div style="width: 1px;height: 30px;background: #E2E2E2;opacity: 1;position: absolute;top: 18%;left: 178%;"></div>
                  </div>
                  <div style="margin-left:115px;position: relative;">
                      <p style="text-align: center;"><i class="iconfont" style="color:#36A6FE;">&#xe61c;</i></p>
                      <p style="color:#BFBFBF;">保障权益</p>
                       <div style="width: 1px;height: 30px;background: #E2E2E2;opacity: 1;position: absolute;top: 18%;left: 178%;"></div>
                  </div>
                  <div style="margin-left:115px;position: relative;">
                      <p style="text-align: center;"><i class="iconfont" style="color:#36A6FE;">&#xe619;</i></p>
                      <p style="color:#BFBFBF;">十年行业经验</p>
                  </div> -->
              </div> 
              <!-- <p style="color:#FD651C;margin-top:10px">已获得成果评价认证</p> -->
              <!-- <div v-show="acData.status===2">
                          <span><i style="color:red" class="el-icon-view"></i>浏览量：</span>
                          <span><i style="color:red" class="el-icon-star-off"  ></i>收藏量：</span>
              </div>-->
              <div style="display:flex;margin-top: 8px;">
                <!-- <span v-if="!(acData.status == 0||acData.status == 1||acData.status == 3)">
                  <el-button
                    type="warning"
                    style="margin-top:20px"
                    v-if="acData.memberStatus==1"
                    @click="pay()"
                  >付订金￥{{acData.deposit}}</el-button>
                </span> -->
                <!-- <a  style="color:#fff" @click="doyoo.util.openChat('g=10052326');return false;">立即咨询</a> -->

                <!-- <el-button
                  type="primary"
                  style="margin-top:20px;margin-left:15px;"
                  @click="showQia()"
                >立即咨询</el-button> -->
                  <div class="contactImg">
                     <img src="../../assets/images/shop/zixun_icon@2x.png" width="26" height="22" style="margin-top: 17px;margin-left: 47px;" />
                     <span  class="aaa" style="color: #FFFFFF;">立即咨询</span>
                  </div>
                  <div class="shoucang">
                      <img src="../../assets/images/shop/icon_Collection@2x.png" width="22" height="22" style="margin-top: 7px;margin-left: 7px;" />
                      <span  class="aaa">加入收藏</span>
                       <!-- <img src="~assets/images/shop/add_Collection@2x.png" width="22" height="22" style="margin-top: 7px;margin-left: 17px;" /> -->
                       <!-- <span  class="bbb">已收藏</span> -->
                  </div>
                  
              </div>
              <div
                style="margin-top:70px"
                v-show="this.acData.memberStatus!==1 && this.acData.ownerFlag==true"
              >
                <span
                  style="color:red;line-height:20px;"
                >提示：您还未完成身份认证，发布的技术成果仅能展示，认证后您的成果可以直接交易哦，快去进行身份认证吧！</span>
                <span style="color:blue;cursor:pointer" @click="toApprove()">去认证>></span>
              </div>
            </div>
          </div>
          <div class="under_box">
            <div class="fonts">
              <p>技术编号：{{acData.achievementNo}}</p>
              <p>技术类型：{{acData.technologyTypeTxt}}</p>
              <!-- <p>技术来源：{{acData.sourceUser | source}}</p> -->
            </div>
            <div class="fonts">
              <div style="display:flex;margin-top: 18px;">
                <span class="tipword">交易方式：</span>
                <span style="color: #707070;font-size:14px;">{{acData.tradeTypeTxt}}</span>
                <!-- <span v-for="(item,index) in acData.tradeTypeValues" :key="index"  class="overtip">{{item}}</span> -->
              </div>
              <div style="display:flex;margin-top: 20px;">
                 <span class="tipword">所属行业：</span>
                 <span style="color: #707070;font-size:14px;">{{acData.industryTxt}}</span>
                   <!-- <span v-for="(item,index) in acData.industryValues" :key="index" class="overtip">
                       {{item}}
                  </span> -->
              </div>
            </div>
            <div class="fonts">
              <!-- <p>更新时间：{{acData.createTime}}</p> -->
                 <p>成熟度：{{acData.maturityTxt}}</p>
                 <p>所在地：{{acData.areaTxt}}</p>
            </div>
          </div>
          <div style="margin:0 20px">
             <div style="display: flex;align-items: center;margin-top:16px">
                <img src="../../assets/images/shop/zhuti_bg@2x.png" width="4" height="16" style="margin-right:13px" />
                <span style="color: #36A6FE;font-size:16px">技术详情</span>
             </div>
            <div style="width: 1160px;height: 0px;border: 1px solid rgb(233 233 233 / 29%);opacity: 1;margin-top:15px"></div>
             <technical-details :data="acData"></technical-details>
            <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="技术详情" name="first">
                <technical-details :data="acData"></technical-details>
              </el-tab-pane> -->
              <!-- <el-tab-pane label="成果评价" name="second">成果评价</el-tab-pane>
                      <el-tab-pane label="所有权介绍" name="third">所有权介绍</el-tab-pane>
              <el-tab-pane label="企业技术资讯" name="fourth">企业技术资讯</el-tab-pane>-->
            <!-- </el-tabs> -->
          </div>
        </div>
        <!-- <div class="right_content">
                  <span class="similar">推荐成果</span>
                  <li
                  v-for="item in imgs"
                  :key="item.id"
                  >
                      <div style="margin:20px 0">
                          <div class="header">
                              <img :src="imgSrc+item.imgUrl" style="width:228px;height:130px">
                          </div>
                          <div class="tail"> 
                              <div class="ins">
                                  <p class="instruction">需求说明：现希望寻找应用于树脂</p>
                              </div>
                          </div>
                      </div>
                  </li>
        </div>-->
      </div>
      <!-- 交易安全保障 -->
       <transcurity/>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import { getShopdetail } from '@/api/shop'
import TechnicalDetails from "@/components/shop/technicalDetails";
import transcurity from "@/components/shop/index";
import Carousel from "@/components/shop/Carousel";
export default {
  components: {
    TechnicalDetails,
    transcurity,
    Carousel
  },
  data() {
    return {
       imgList:[
        {
          title:"全程监督",
          imgUrl:require('./imgs/icon01.png')
        },
        {
          title:"保障权益",
          imgUrl:require('./imgs/icon02.png')
        },
        {
          title:"十年行业经验",
          imgUrl:require('./imgs/icon03.png')
        },
      ],
      isCollected: false,
      cdnUrl:process.env.SHOP_BASE_URL,
      acData: {},
      activeName: "first",
      imgs: [],
      achievementNo: "",
      checkStatus: "",
      List: [
        {
          id: 1,
          imgUrl: "cgpj/icon_cgpj01.png",
          title: "专业多对一服务",
          desc: "多对一即时咨询服务，专业领域顾问，至少两年以上从业经验"
        },
        {
          id: 2,
          imgUrl: "cgpj/icon_cgpj02.png",
          title: "全程透明化操作",
          desc: "服务产品化定制规范，全程可监控，可追溯，业务进度实时跟进"
        },
        {
          id: 3,
          imgUrl: "cgpj/icon_cgpj03.png",
          title: "严控风险 安全保障",
          desc: "严格把控业务办理风险，保障业务办理过程安全顺利、平稳进行"
        },
        {
          id: 4,
          imgUrl: "cgpj/icon_cgpj04.png",
          title: "一站式企业服务",
          desc: "涵盖企业初创期、成长期、成熟期，满足各类不同业务办理需求"
        }
      ],
      demandList: [],
      memberStatus: "",
      userId: "",
      salerId: ""
    };
  },
  filters: {
    source(value) {
      if (value === 0) {
        var source = "用户";
      } else if (value === 1) {
        var source = "后台";
      } else {
        var source = "未知";
      }
      return source;
    },
    numFilter(value) {
      if (value == "" || value == 0 || value == null) {
        return "";
      } else {
        return value / 1000000 ;
      }
    },
    maturity(value) {
      if (value === "0") {
        var maturity = "正在研发";
      } else if (value === "1") {
        var maturity = "已有样品";
      } else if (value === "2") {
        var maturity = "通过小试";
      } else if (value === "3") {
        var maturity = "通过中试";
      } else if (value === "4") {
        var maturity = "可以量产";
      } else {
        var maturity = "未知";
      }
      return maturity;
    },
    turnAdd(value) {
      let caList = value;
      if (caList == null) {
        return "暂无数据";
      }
      let areas = [];
      if (!Array.isArray(caList)) {
        caList = caList.split(",");
      }
      for (var i = 0; i < caList.length; i++) {
        var value = CodeToText[caList[i]];
        if (value != null) {
          areas.push(value);
        }
      }
      return areas.join("-");
    },
    status(value) {
      if (value === 0) {
        var statusChange = "已下架";
      } else if (value === 1) {
        var statusChange = "已交易";
      } else if (value === 2) {
        var statusChange = "展示中";
      } else if (value === 3) {
        var statusChange = "交易中";
      } else if (value === 4) {
        var statusChange = "待审核";
      } else if (value === 5) {
        var statusChange = "审核未通过";
      } else if (value === 6) {
        var statusChange = "草稿";
      } else if (value === 7) {
        var statusChange = "已删除";
      }
      return statusChange;
    }
  },
  methods: {
     //qq分享
        qqShare(){
            let urlData = "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+window.location.href+"&sharesource=qzone&title="+this.detailData.metaTitle+"&pics=你的分享图片&summary="+this.detailData.metaDescription+""
            window.open(urlData, '_blank')
        },
        //微博分享
        weiboShare(){
            let urlData = "http://service.weibo.com/share/share.php?&sharesource=weibo&title="+this.detailData.metaTitle+"&url="+window.location.href+"&pic=你的分享图片&appkey=1343713053"
            window.open(urlData, '_blank')
        },
      toApprove() {
        window.open("/user/approve");
      },
    showQia() {
      window.open('https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2','','height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no')
    },   

    getData() {
      if(sessionStorage.getItem('previewDetai')){
        this.acData = JSON.parse(sessionStorage.getItem('previewDetai'))
        console.log(this.acData)
      }
      // let param = new FormData()
      // param.append('id',this.achievementNo)
      // getShopdetail(param).then(res => {
      //     this.imgs = [];
      //     this.acData = res.data.data;
      //     this.userId = res.data.data.userId;
      //     // console.log(this.acData.deposit)
      //     let first = parseFloat(this.acData.deposit / 100).toFixed(3);
      //     let second = first.substring(0, first.length - 1);
      //     this.acData.deposit = second;
      //     //封面图片是默认推荐图片且无展示图片
      //     if (res.data.data.achievementImgs.length == 0) {
      //       this.imgs.push({ imgUrl: res.data.data.coverUrl });
      //     } else {
      //       //封面图片是默认推荐图片且有展示图片
      //       if (res.data.data.coverId === -1) {
      //         this.imgs = res.data.data.achievementImgs;
      //         this.imgs.unshift({ imgUrl: res.data.data.coverUrl });
      //       } else {
      //         //封面图片不是默认图片
      //         for (var i = 0; i < res.data.data.achievementImgs.length; i++) {
      //           if (i === res.data.data.coverId) {
      //             //封面图片放到首位
      //             this.imgs.unshift(res.data.data.achievementImgs[i]);
      //           } else {
      //             this.imgs.push(res.data.data.achievementImgs[i]);
      //           }
      //         }
      //       }
      //     }
      //   })
      //   .catch(err => {

      //   });
    },
    getUserInfo() {
      getUser().then(res => {
        if (res == null || res.data == null) {
          return;
        }
        this.memberStatus = res.data.memberStatus;
        this.salerId = res.data.userId;
      });
    }
  },
  mounted() {
    // this.getUserInfo();
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
.intro_three_content {
  height: 60px;
  display: flex;
  font-size: 12px;
  justify-content: center;
  align-items: center;
  margin: 20px 0 25px 0;
  border-top: 1px dashed #ccc;
  border-bottom: 1px dashed #ccc;
}
.intro_three_content span {
  height: 25px;
  border-right: 1px solid #e2e2e2;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
.intro_three_content > span:nth-of-type(3) {
  border-right: none;
}
.intro_img_icon {
  display: flex;
  flex-direction: column;
}
.intro_img_icon img {
  width: 18px;
  margin-bottom: 2px;
}
.intro_img_icon span {
  border-right: none;
}
 .browse{
      font-size:16px;
      color:#A8A8A8;
      margin-left:64px;
  }
    .project_share{
          width:200px;
          border:1px solid #EEE;
          color:#000;
          text-align:center;
          background:#FFF;
          display:none;
          position:absolute;
          top:-190px;
          margin-left:55px;
      }
                        
    .share:hover .project_share{
        display:block;
    }  
  .share{
      font-size:16px;
      color:#A8A8A8;
      margin-left:50px;
      padding:1px 5px;
      cursor:pointer;
      position:relative;
  }
.aaa{
    color: #4284FF;
    font-size: 18px;
    display: inline-block;
    position: relative;
    top: -4px;
}
.bbb{
    color: #4284FF;
    font-size: 12px;
    display: inline-block;
    position: relative;
    top: -4px;
}
.shoucang{
  width: 195px;
  height: 56px;
  background: #ECF3FF;
  border: 1px solid #4284FF;
  opacity: 1;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  line-height: 62px;
}
.contactImg{
   width: 195px;
   height: 56px;
   line-height: 56px;
   background: linear-gradient(123deg, #75C2FF 0%, #3D7EFF 100%);
   border-radius: 10px;
   cursor: pointer;
   margin-right: 35px;
}
.overtip{
  width:330px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  color: #707070;
  font-size: 14px;
  cursor: pointer;
}
.tipword{
  display: inline-block;
  color: #707070;
  font-size: 14px;
  white-space: nowrap;
}
.first_box {
  width: 1200px;
  min-height: 650px;
  margin: 20px auto;
  padding-top: 20px;

  .box {
    display: flex;

    .left {
      width: 100%;
      background: #fff;
      position: relative;
      overflow: hidden;
      border-radius: 5px;

      .header {
        width: 100%;
        height: 40px;

        .spa {
          margin-left: 30px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 21px;
          color: rgba(51, 51, 51, 1);
          opacity: 1;
        }
      }

      .under_btn {
        height: 20px;
        color: #FFFFFF;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 2px;
        opacity: 1;
      }

      .slideshow {
        width: 100%;
        display: flex;
        position: relative;
        overflow-y: hidden;

        .status_p {
          position: absolute;
          text-align: center;
          line-height: 36px;
          width: 90px;
          height: 36px;
          background: #E22740FF;
          opacity: 1;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          border-radius: 0px 90px 90px 0px;
          text-align: center;
          margin-bottom: 6px;
          z-index: 3;
        }

        .block {
          margin: 20px 20px;
          // width: 425px;
          // height: 250px !important;
          position: relative;
        }

        .right_box {
          width: 700px;
          // height 250px
          // margin: 20px;
          // padding-top: 20px;

        }

        .title {
          margin: 30px 0;
          font-size: 16px;
          font-family: Microsoft YaHei;
          line-height: 25px;
          opacity: 1;
        }

        .desc {
          height: 118px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 23px;
          color: #666;
          opacity: 1;
          position: relative;
          top: 15px;
          padding-right: 40px;
        }
      }

      .under_box {
        width: 100%;
        display: flex;
        background: #F3F8FF;
        margin-top: 38px;
        .fonts {
          width: 30%;
          // padding: 15px 0;
          margin-left: 30px;
        }

        .fonts p {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 28px;
          color: rgba(112, 112, 112, 1);
          opacity: 1;
        }
      }
    }

    .right_content {
      width: 20%;
      margin: 10px 20px;
    }

    .similar {
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 24px;
      color: rgba(51, 51, 51, 1);
    }

    .header {
      width: 95%;
    }

    .tail {
      width: 95%;
      background: #fff;

      .ins {
        width: 90%;
        margin: 0 auto;
        padding: 10px 0;
      }

      .instruction {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 23px;
        color: rgba(153, 153, 153, 1);
      }
    }
  }

  .left_bottom {
    width: 100%;
    height: 400px;
    margin-top: 30px;
    background: #fff;

    .internal_box {
      width: 100%;
      margin: 20px auto;

      .header_font {
        padding-top: 20px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 26px;
        color: #3d85dc;

        .left_btn {
          width: 100%;
          border-radius: 0px;
        }

        .module-con {
          width: 85%;
          margin: 1px auto;
          display: flex;

          .consult-img {
            margin: 20px auto;
          }

          .member-wrapper {
            margin-top: 30px;
            // margin-left:48px
            // margin :0 auto
            width: 100%;
            display: inline-block;

            .member-last {
              margin-right: 0 !important;
              box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);
            }

            .member-list {
              text-align: center;
              background: rgba(255, 255, 255, 1);
              width: 208px;
              height: 236px;
              float: left;
              list-style: none;
              margin-right: 5%;
              margin-bottom: 40px;
              box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);

              .photo {
                width: 50%;

                img {
                  // width: 100%
                  margin: 10px 60px;
                  // margin-left :60%
                  width: 84px;
                  height: 84px;
                  background: rgba(255, 255, 255, 1);
                  opacity: 1;
                }
              }

              .member-info {
                color: #666666;
                margin-top: 8px;

                h3 {
                  text-align: center;
                  line-height: 40px;
                  color: #3d85dc;
                  font-size: 16px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }

                p {
                  margin: 10px 18px;
                  font-size: 12px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  line-height: 20px;
                  color: rgba(153, 153, 153, 1);
                  opacity: 1;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style>
.el-carousel--horizontal {
  overflow-y: hidden !important;
}
.detail-box{
  background: #f1f1f1;
  padding-bottom: 30px;
}
</style>