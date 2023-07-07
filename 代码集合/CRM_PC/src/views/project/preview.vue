<template>
<!-- 排查完成 -->
  <div class="project_main">
    <div class="project_preview_top">
      <swiper :coverUrls="form.coverUrls"></swiper>
      <div>
        <h3 class="over_sty_title">
          {{ form.title }}
        </h3>
        <div>{{form.slogan}}</div>
        <span
          class="chen_sty_span"
          v-for="(item, index) in titleList"
          :key="index">
          {{ item }}
          </span>
          <div class="project_online">
            <div class="price">
                <div class="pricedetail">
                        <!-- 定金+尾款+原价 -->
                        <template v-if="form.nowFee && form.earnestMoney && form.previousFee">
                            <div style="display:flex;margin-top:3px;line-height:19px;">
                                <div style="margin-top: 3px;"> 
                                    <div><span class="word" >定金</span ></div>
                                    <div><span class="word_a">￥</span ><span class="priceword">{{Number(form.earnestMoney/100)}}</span></div>
                                </div>
                                <div style="margin-top: 3px;margin-left: 12px;">
                                    <div><span class="weikuan">尾款</span></div> 
                                    <div><span class="weikuan_a">￥</span><span class="priceword">{{Number((form.nowFee/100)-(form.earnestMoney/100))}}</span></div> 
                                </div>
                                <div style="margin-top: 26px;margin-top: 24px; margin-left: 7px;"> <span class="del">￥{{Number(form.previousFee/100)}}</span></div>
                            </div>
                        </template>
                        <!-- 定金+原价 -->
                        <template v-else-if="form.earnestMoney  && form.previousFee">
                                <div style="margin-top: 3px;"> 
                                    <span class="weikuan">定金</span> <span class="weikuan_a">￥</span><span class="priceword">{{Number((form.earnestMoney/100))}}</span> 
                                    <span class="weikuan">原价</span> <span class="weikuan_a">￥</span><span class="priceword">{{Number((form.previousFee/100))}}</span> 
                               </div>
                        </template>
                        <!-- 定金+尾款 -->
                        <template v-else-if="form.earnestMoney  && form.nowFee">
                                    <span class="weikuan">定金</span> <span class="weikuan_a">￥</span><span class="priceword">{{Number((form.earnestMoney/100))}}</span> 
                                    <span class="weikuan">尾款</span> <span class="weikuan_a">￥</span><span class="priceword">{{Number((form.nowFee/100)-(form.earnestMoney/100))}}</span> 
                        </template>
                        <!-- 现价+原价 -->
                        <template v-else-if="form.nowFee && form.previousFee">
                                <span class="weikuan">服务费</span> <span class="weikuan_a">￥</span><span class="priceword">{{Number((form.nowFee/100))}}</span> 
                                    <span class="del">￥{{Number(form.previousFee/100)}}</span>
                        </template>
                        <!-- 现价 -->
                        <template v-else-if="form.nowFee ">
                                <span class="weikuan">服务费</span><span class="weikuan_a">￥</span><span class="mianyi"></span><span class="priceword">{{Number(form.nowFee/100)}}</span>
                        </template>
                        <!-- 原价 -->
                        <template v-else-if="form.previousFee">
                            <span class="weikuan">原价</span><span class="weikuan_a">￥</span><span class="mianyi"></span><span class="priceword">{{Number(form.previousFee/100)}}</span>
                        </template>
                        <!-- 定金 -->
                        <template v-else-if="form.earnestMoney">
                            <span class="weikuan">定金</span><span class="weikuan_a">￥</span><span class="mianyi"></span><span class="priceword">{{Number(form.earnestMoney/100)}}</span>
                        </template>
                        <!-- 面议 -->
                        <template v-else>
                            <span class="weikuan">服务费</span><span class="weikuan_a">￥</span><span class="mianyi">面议</span>
                        </template>        
                </div>
            </div>
        </div>
         <p>
            <span>
              <span style="font-weight: bold">地区：</span>
              <span>{{ areaName.parent }}/{{ areaName.child }}</span>
            </span>
            <span style="margin-left: 45px">
              <span style="font-weight: bold">归口：</span>
              <span>{{ className }}</span>
            </span>
          </p>
         <!-- 官费代缴 -->
        <div class="guan" v-if="governmentFeeTypeList && governmentFeeTypeList.length>0">
            <div class="guanwidth"><span>官费代缴</span><span class="ask" @click="dialogVisible=true">?</span></div>
            <div :class="['item',element.isDefault == 1?'activeborder':'']" v-for="(element,index) in governmentFeeTypeList" :key="index"  @click="changeDefault(index)">
                <div class="duo">{{element.typeName}}<span class="yellow">{{'￥'+element.typeFee/100}}</span></div>
                <img v-if="element.isDefault == 1" :src="require('@/assets/images/ip-servers/dui_icon@2x.png')" class="gou" alt="">
            </div>
       </div>
         <p v-else>
          <span style="font-weight: bold; font-size: 12px">增值服务：</span>
          <span style="font-size: 12px">免费规划、相关专业培训课程</span>
        </p>
        <div class="intro_three_content">
          <span class="intro_img_icon" v-for="(item,index) in imgList" :key="index">
            <img :src="item.imgUrl" alt="" />
            <span>{{ item.title }}</span>
          </span>
        </div>
        <div class="intro_btn_content">
          <span class="btn_sty_item">
            <i class="el-icon-service"></i>
            <span>{{isOnline==1?'立即下单':'立即咨询'}}</span>
          </span>
          <span class="btn_sty_item">
            <i class="el-icon-star-off"></i>
            <span>加入收藏</span>
          </span>
        </div>
      </div>
    </div>
    <div class="project_preview_bottom">
      <div class="bottom_left_content">
        <div :class="['left_content_title',fixed == true?'fixed_sty':'']">
          <span 
            :class="['normal_tab_sty',showIndex == index?'choose_tab_sty':'']"
            v-for="(item,index) in paramList" :key="index" 
            @click="changeTab(index)">
            <span>{{ item }}</span>
            <span :class="['bottom_border',showIndex == index?'bottom_border_choosed':'']"></span>
          </span>
        </div>
        <div class="left_content_main" ref="content" v-for="(item,index) in paramList" :key="index">
           <span class="side_title">
             <span></span>
             <span>{{ item }}</span>
             </span>
             <div class="side_content" v-html="index == 0? form.content:index == 1?form.productParam:form.saleProtection"></div>
        </div>
      </div>
      <div class="bottom_right_content">
        <div class="right_list_title">
          <span>推荐项目</span>
          <span>更多></span>
        </div>
        <div
          class="right_item_main"
          v-for="(item, index) in sideList"
          :key="index">
          <img :src="imgUrl" alt="" />
          <div class="item_main_bottom">
            <div class="item_desc_title">项目名称项目名称</div>
            <div class="btn_item_sty">
            <span>科技厅</span>
            <span>立即咨询</span>
          </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 官费代缴说明 -->
    <el-dialog  :visible.sync="dialogVisible">
        <div style="padding:10px 40px 40px 30px">
            <p style="text-align: center;color:#36a6fe;font-size:18px">官费收费标准</p>
            <br/>
            <p>官费是国家商标局或知识产权局收取的办理相关商标或专利的费用。下面以专利申请为例，具体见各产品详情中的收费标准</p>
            <br/>
            <img src="https://static.yagu.cn/assets/plat/static/imgs/img/bgm.png" width="674px" height="420px" />  
            <br/>
            <p>减缓说明:</p>
            <p>可减缴费用</p>
            <p>根据《专利收费减缴办法》的规定，专利申请人或者专利权人可以请求减缴下列专利收费︰</p>
            <p>(一）申请费(不包括优先权要求费、申请附加费);</p>
            <p>(二）发明专利申请实质审查费;  </p>
            <p>(三)年费（自授予专利权当年起十年内的年费）;</p>
            <p>(四)复审费。</p>
            <br/>
            <p>专利申请人或专利权人符合下列条件之一的:</p>
            <p>(一)上年度月均收入低于5000元(年6万元)的个人;</p>
            <p>(二)上年度企业应纳税所得额低于100万元的企业;</p>
            <p>(三)事业单位、社会团体、非营利性科研机构;</p>
            <p>两个或者两个以上的个人或者单位为共同专利申请人或者共有专利权人的，应当分别符合前款规定。</p>
            <br/>
            <p>减缴比例</p>
            <p>专利申请人或者专利权人为单个个人或者单个单位的，减缴前述收费的85%。</p>
            <p>两个或者两个以上的个人或者单位为共同专利申请人或者共有专利权人的，减缴前述收费的70%。</p>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import swiper from "@/components/project/swiper";
export default {
  components: {
    swiper,
  },
  data() {
    return {
      fixed:false,
      areaName:"",
      className:"",
      lastIndex:0,
      showIndex:0,
      paramList:["项目详情","项目参数","售后保障"],
      sideList: ["", "", "", "", "", ""],
      imgList:[
        {
          title:"全程监督",
          imgUrl:require('@/assets/images/project/icon01.png')
        },
        {
          title:"保障权益",
          imgUrl:require('@/assets/images/project/icon02.png')
        },
        {
          title:"十年行业经验",
          imgUrl:require('@/assets/images/project/icon03.png')
        },
      ],
      titleList: ["快速响应", "专业代理", "品质服务", "无忧售后"],
      imgUrl:
        "//static-tst.wotao.com/icon/head/d78cea96a6aa4c0d88c6711fff8f8a69.jpg",
        governmentFeeTypeList:[],
        isOnline:1,
        dialogVisible:false,
        weiprice:0
    };
  },
  methods:{
    changeTab(index){
      this.showIndex = index
      let el = this.$refs.content[index];
      window.scrollTo({
        behavior: "smooth",
        block: "center",
        top: this.showIndex == 0?0:this.lastIndex == 0?el.offsetTop-130:el.offsetTop - 80,
      })
      this.lastIndex = index
    },
    handleScroll(){
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      this.fixed = scrollTop > 519?true:false;
      console.log(scrollTop)
      
    },
      changeDefault(whichInex){
        this.governmentFeeTypeList.forEach((item,index)=>{
            if(whichInex === index){
                item.isDefault = 1
            }else{
                item.isDefault = 0
            }
        })
      },
  },
  created() {
    this.form = JSON.parse(this.$route.query.form);
    this.isOnline = this.form.isOnline==0 || this.form.isOnline==1? this.form.isOnline:JSON.parse(this.$route.query.isOnline)
    this.governmentFeeTypeList = this.form.policyGovfeeTypeList
    this.className = this.$route.query.className
    this.areaName = JSON.parse(this.$route.query.areaName)
  },
  mounted(){
    window.addEventListener('scroll',this.handleScroll,true)
  },
};
</script>

<style lang="scss" scoped>
.project_main {
  background: #eff2f3;
  overflow: hidden;
}
.project_preview_top {
  display: flex;
  width: 1200px;
  margin: 20px auto;
  background: #ffffff;
  padding: 20px;
  margin-bottom: 10px;
}
.chen_sty_span {
  display: inline-block;
  text-align: center;
  width: 70px;
  height: 28px;
  background: #fbe5d4;
  opacity: 1;
  border-radius: 5px;
  font-size: 12px;
  line-height: 28px;
  color: #ff6900;
  margin-right: 10px;
}
.desc_sty_content {
  margin-top: 14px;
  width: 599px;
  height: 80px;
  background: #eff2f3;
  color: #333333;
  opacity: 1;
  border-radius: 10px;
  font-size: 12px;
  padding: 5px;
  padding-left: 10px;
}
.intro_three_content {
  height: 60px;
  display: flex;
  font-size: 12px;
  justify-content: center;
  align-items: center;
  margin: 10px 0 10px 0;
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
.intro_btn_content {
  display: flex;
}
.btn_sty_item {
  width: 246px;
  height: 56px;
  background: linear-gradient(123deg, #75c2ff 0%, #3d7eff 100%);
  opacity: 1;
  border-radius: 10px;
  margin-left: 108px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 18px;
}
.btn_sty_item:nth-of-type(1) {
  margin-left: 0;
}
.btn_sty_item:nth-of-type(2) {
  background: #ecf3ff;
  color: #4284ff;
}
.btn_sty_item i {
  font-size: 22px;
  margin-right: 5px;
}
.project_preview_bottom {
  display: flex;
  width: 1200px;
  margin: 0px auto;
  margin-bottom: 10px;
  /* padding: 20px; */
  padding-top: 0;
  background: #EFF2F3 !important;
}
.bottom_left_content {
  background: #FFFFFF !important;
  width: 949px;
  /* height: 500px; */
  margin-right: 11px;
}
.bottom_right_content {
  background: #FFFFFF !important;
  width: 240px;
  /* height: 500px; */
}
.left_content_title {
  display: flex;
  background: #ffffff;
  height: 55px;
}
.fixed_sty{
  width: 949px;
  top: 0;
  position: fixed;
}
.normal_tab_sty{
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  width: 160px;
  height: 55px;
  /* background: #f6f6f6; */
  color: #666666;
  opacity: 1;
  cursor: pointer;
}
.choose_tab_sty {
  background: #ffffff;
  color: #36a6fe;
}
.bottom_right_content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.right_item_main {
  margin-bottom: 20px;
}
.right_item_main img {
  width: 200px;
  height: 93px;
}
.item_main_bottom {
  border: 1px solid #d8d8d8;
  border-top: none;
  margin-top: -10px;
}
.btn_item_sty {
  padding: 5px 8px 8px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn_item_sty span {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  width: 56px;
  height: 20px;
  background: #f8f3f3;
  border-radius: 5px;
}
.btn_item_sty > span:nth-of-type(1) {
  color: #a8a8a8;
}
.btn_item_sty > span:nth-of-type(2) {
  color: #36a6fe;
  background: #ffffff;
}
.item_desc_title {
  font-size: 14px !important;
  padding: 14px 0 8px 8px;
  border-bottom: 1px solid #d8d8d8;
}
.right_list_title {
  width: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
}
.right_list_title span {
  display: flex;
  font-size: 12px;
}
.right_list_title > span:nth-of-type(1) {
  font-size: 16px;
  font-weight: bold;
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
.side_title{
  font-size: 16px;
  padding-left: 25px;
  color: #36A6FE;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.side_title>span:nth-of-type(1){
  display: inline-block;
  border-radius: 2px;
  width: 4px;
  height: 14px;
  background: #36A6FE;
  border-radius: 4px;
  margin-right: 10px;
}
.left_content_main{
  margin-top: 25px;
}
.side_content{
  min-height: 300px;
  padding:20px 25px 30px 35px;
}
.side_content >>> video{
 width: 100%;
 height: 400px;
}
.side_content >>> img{
 width: 100%;
 height: 400px;
}
.over_sty_title{
  width: 599px;
  display: -webkit-box;   
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
.bottom_border{
  width: 20px;
  height: 4px;
  /* background: #F6F6F6; */
  opacity: 1;
  border-radius: 4px;
  margin-top: 12px;
}
.bottom_border_choosed{
  background: #36A6FE;
}
 .guan{
        font-size :14px;
        display :flex;
        align-items:center;
        margin-top :5px;
       .guanwidth{
           width :72px;
           margin-right :6px;
        }
        .item{
            width: 134px;
            height: 24px;
            opacity: 1;
            border: 1px solid #999999;
            border-radius: 5px;
            position: relative;
            text-align: center;
            line-height: 24px;
            margin-right: 10px;
            cursor :pointer;
            .duo{
              font-size: 12px;
            }
            .gou{
                width: 18px;
                height :18px;
                position :absolute;
                top: 5px;
                right: 0;
            }
        }
        .activeborder{
            border: 1px solid #36a6fe !important;
         }
        .ask{
            width: 14px;
            height: 14px;
            display :inline-block;
            opacity: 1;
            font-size: 10px;
            border-radius: 50%;
            background: #36A6FE;
            color :#fff;
            text-align: center;
            position: relative;
            top: -9px;
            left: 2px;
            line-height: 14px;
            cursor: pointer;
        }
    }
  .project_online{
        display : flex;
        margin-top:  10px;
        .price{
            width: 331px;
            height: 50px;
            background:linear-gradient(134deg,#ff792f, #ffb054 100%);
            padding-left: 10px;
            line-height: 50px;
            .pricedetail{
                .word{
                    font-size: 12px;
                    color: #FFFFFF;
                    font-weight: 400;
                }
                .weikuan{
                    margin-left:5px;
                    font-size: 12px;
                    color: #FFFFFF;
                    font-weight: 400;
                }
                .word_a{
                    font-size: 12px;
                    color: #FFFFFF;
                    font-weight: 400;
                }
                .weikuan_a{
                    margin-left:5px;
                    font-size: 12px;
                    color: #FFFFFF;
                    font-weight: 400;
                }
                .priceword{
                    font-size: 18px;
                    font-weight:bold;
                    color: #FFFFFF;
                }
                 .del{
                    text-decoration:  line-through;  
                    font-size: 12px;
                    color: #FFFFFF;
                    }
                    .mianyi{
                        font-size: 20px;
                        font-weight:bold;
                        color: #FFFFFF;
                 }
            }
        }  
        .area{
            width: 169px;
            height: 50px;
            background: #eff2f3;
            padding:  8px 0 8px 0;
            display : flex;
            .areaitem{
                display:flex;
                flex-direction: column;
                text-align: center;
                color: #999999;
                font-size: 12px;
                .under{
                    display:  inline-block;
                    margin-top : 3px;
                }
            }
            .areaitem:first-child{
                border-right: 1px solid #e2e2e2;
                width: 80px;
            }
            .areaitem:last-child{
                width: 88px;
            }
        }             
      }
.yellow{
    color:#ff792f;
    margin-left: 6px;
}
</style>