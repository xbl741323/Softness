<template>
<client-only>
  <div class="project_apply">
    <!-- 头部搜索栏 -->
    <div class="tab_title">
      <i class="iconfont tab_left" @click="goBack">&#xe641;</i>
      <div class="tab_title_sty"><span>{{this.metaTitle}}</span></div>
      <img class="img_right" :src="require('~/assets/images/technology/home.png')"  @click="toHome" alt=""/>
    </div>
    <template v-if="collectStatus">
     <!-- 证书图片 -->
      <div class="project_img">
      <!-- 轮播 -->
      <div class="wrapper" v-if="projectInfo.coverUrls&&projectInfo.coverUrls.length!==0 && !collectStatus" >
          <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="(item, index) in projectInfo.coverUrls.slice(0,1)" :key="index">
              <div class="cut_img">
                <img   
                    v-if="item.url&&
                    (item.url.split('.')[item.url.split('.').length-1]=='jpeg'||
                    item.url.split('.')[item.url.split('.').length-1]=='png'||
                    item.url.split('.')[item.url.split('.').length-1]=='jpg'||
                    item.url.split('.')[item.url.split('.').length-1]=='gif')" 
                  :src="cdnUrl + item.url" class="swiper-img" alt /> 
                  <div class="cut_img" v-if="item.url&&(item.url.split('.')[item.url.split('.').length-1]=='mp4'||
                    item.url.split('.')[item.url.split('.').length-1]=='avi'||
                    item.url.split('.')[item.url.split('.').length-1]=='mov')">
                    <video
                    v-if="item.spUrl&&(item.spUrl!==''&&item.spUrl!==null)" 
                    :poster="cdnUrl + item.spUrl"
                    :src="cdnUrl + item.url" controls="controls"></video>
                      <video v-else :src="cdnUrl + item.url" controls="controls"></video>
                  </div>
              </div>
            </swiper-slide>
            <div
              v-if="projectInfo.coverUrls.length != 1"
              class="swiper-pagination"
              slot="pagination"
            ></div>
          </swiper>
        </div>
        <div class="wrapper" v-else-if="projectInfo.coverUrls&&projectInfo.coverUrls.length!==0" >
          <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="(item, index) in projectInfo.coverUrls" :key="index">
              <div class="cut_img">
                <img   
                    v-if="item.url&&
                    (item.url.split('.')[item.url.split('.').length-1]=='jpeg'||
                    item.url.split('.')[item.url.split('.').length-1]=='png'||
                    item.url.split('.')[item.url.split('.').length-1]=='jpg'||
                    item.url.split('.')[item.url.split('.').length-1]=='gif')" 
                  :src="cdnUrl + item.url" class="swiper-img" alt /> 
                  <div class="cut_img" v-if="item.url&&(item.url.split('.')[item.url.split('.').length-1]=='mp4'||
                    item.url.split('.')[item.url.split('.').length-1]=='avi'||
                    item.url.split('.')[item.url.split('.').length-1]=='mov')">
                    <video
                    v-if="item.spUrl&&(item.spUrl!==''&&item.spUrl!==null)" 
                    :poster="cdnUrl + item.spUrl"
                    :src="cdnUrl + item.url" controls="controls"></video>
                      <video v-else :src="cdnUrl + item.url" controls="controls"></video>
                  </div>
              </div>
            </swiper-slide>
            <div
              v-if="projectInfo.coverUrls.length != 1"
              class="swiper-pagination"
              slot="pagination"
            ></div>
          </swiper>
        </div>
          <div v-else>
            <img :src="cdnUrl + projectInfo.coverUrl" style="width: 100%;height: 220px;" alt />
          </div> 
        <!-- <div v-if="!collectStatus" class="down" >已下架</div> -->
      </div>
      
     <div class="project_online">
      <div class="price">
        <!-- 定金+尾款+原价 -->
        <template v-if="projectInfo.nowFee && projectInfo.earnestMoney && projectInfo.previousFee">
            <div class="comprehensive">
                <div class="mt"> 
                    <div><span class="word_b" >定金</span ></div>
                    <div><span class="word_a">￥</span ><span class="priceword_a">{{projectInfo.earnestMoney | filterPrice}}</span></div>
                </div>
                <div class="weikuan_b">
                    <div><span class="weikuan">尾款</span></div> 
                    <div><span class="weikuan_a">￥</span><span class="priceword_a">{{handelWeikuan(projectInfo.earnestMoney,projectInfo.nowFee)}}</span></div> 
                </div>
                <div class="del_a" >{{handelWeikuan(projectInfo.earnestMoney,projectInfo.previousFee)}}</div>
            </div>
        </template>
        <!-- 定金+原价 -->
        <template v-else-if="projectInfo.earnestMoney  && projectInfo.previousFee">
            
            <div class="comprehensive">
                <div class="mt"> 
                    <div><span class="word_b" >定金</span ></div>
                    <div><span class="word_a">￥</span ><span class="priceword_a">{{projectInfo.earnestMoney | filterPrice}}</span></div>
                </div>
                <div class="weikuan_b">
                    <div><span class="weikuan">原价</span></div> 
                    <div><span class="weikuan_a">￥</span><span class="priceword_a">{{projectInfo.previousFee | filterPrice}}</span></div> 
                </div>
            </div>
        </template>
        <!-- 定金+尾款 -->
        <template v-else-if="projectInfo.earnestMoney  && projectInfo.nowFee">
              <div class="comprehensive">
                <div class="mt"> 
                    <div><span class="word_b" >定金</span ></div>
                    <div><span class="word_a">￥</span ><span class="priceword_a">{{projectInfo.earnestMoney | filterPrice}}</span></div>
                </div>
                <div class="weikuan_b">
                    <div><span class="weikuan">尾款</span></div> 
                    <div><span class="weikuan_a">￥</span><span class="priceword_a">{{handelWeikuan(projectInfo.earnestMoney,projectInfo.nowFee)}}</span></div> 
                </div>
            </div>
        </template>
        <!-- 现价+原价 -->
        <template v-else-if="projectInfo.nowFee && projectInfo.previousFee">
          <div class="top">
                <span class="weikuan">服务费</span> <span class="weikuan_a">￥</span><span class="priceword">{{projectInfo.nowFee | filterPrice}}</span> 
                  <span class="del_a">{{projectInfo.previousFee | filterPrice}}</span></div>
        </template>
        <!-- 现价 -->
        <template v-else-if="projectInfo.nowFee ">
            <div class="top"><span class="weikuan">服务费</span><span class="weikuan_a">￥</span><span class="mianyi">{{projectInfo.nowFee | filterPrice}}</span></div> 
        </template>
        <!-- 原价 -->
        <template v-else-if="projectInfo.previousFee">
            <div class="top"><span class="weikuan">原价</span><span class="weikuan_a">￥</span><span class="mianyi">{{projectInfo.previousFee | filterPrice}}</span></div>
        </template>
        <!-- 定金 -->
        <template v-else-if="projectInfo.earnestMoney">
            <div class="top"><span class="weikuan">定金</span><span class="weikuan_a">￥</span><span class="mianyi">{{projectInfo.earnestMoney | filterPrice}}</span></div>
        </template>                                             
        <!-- 面议 -->
        <template v-else>                             
            <div class="top_a"><span class="weikuan">服务费</span><span class="weikuan_a">￥</span><span class="mianyi_a">面议</span></div>
        </template>     
      </div>
        <div class="area" v-if="collectStatus && projectInfo.categories && projectInfo.categories.length >= 2">
            <div v-for="item in projectInfo.categories.slice(0,2)" :key="item.name" class="areaitem">
                <span>{{item.name}}</span>
                <span class="under">{{item.optionName}}</span>
            </div>
        </div>
      </div>

    <!-- 标题栏 -->
    <div class="project_title">
        <div>{{ projectInfo.title }}</div>
        <div>{{ projectInfo.slogan }}</div>
       
    </div>
  
      <!-- 全程监督 -->
    <div class="img_shadow" v-if="collectStatus">
        <div class="shadow_item" v-for="(item, index) in imgList" :key="index">
        <img
            style="width: 0.42666666667rem; height: 0.42666666667rem"
            :src="require('@/assets/images/' + item.imgUrl)"
        />
        <p>{{ item.title }}</p>
        </div>
    </div>
      <div v-if="collectStatus">
      <!-- 描述栏 -->
      <div class="project_desc">
          <div class="alltitle" :class="[fixed == true ? 'position-fixed' : '']">
              <span class="desctitle" @click="handleClick('first')" :class="{activeSty:activeId=='first'}">项目详情
                <span :class="{scrollbar:activeId=='first'}"></span>
              </span>
              <span class="desctitle" @click="handleClick('second')" :class="{activeSty:activeId=='second'}">项目参数
                  <span :class="{scrollbar:activeId=='second'}"></span>
              </span>
              <span class="desctitle"  @click="handleClick('third')" :class="{activeSty:activeId=='third'}">售后保障
                  <span :class="{scrollbar:activeId=='third'}"></span>
              </span>
          </div>
          <div id="header" style="width: 91.466666667%;margin-top: 12px;">
            <div style="color: #36A6FE;">项目详情</div>
            <div class="desc_main" v-html="projectInfo.content"></div>
          </div>
          <div id="center" style="width: 91.466666667%;margin-top: 12px;">
            <div style="color: #36A6FE;">项目参数</div>
            <div class="desc_main" v-html="projectInfo.productParam"></div>
          </div>
          <div id="under" style="width: 91.466666667%;margin-top: 12px;">
            <div style="color: #36A6FE;">售后保障</div>
            <div class="desc_main" v-html="projectInfo.saleProtection"></div>
          </div>
      </div>

    <!-- 上一页，下一页 -->
    <div class="page_change">
        <div class="page_last" @click="toDetali(preInfo)" v-if="preInfo">
            <span>上一篇></span>
            <span>{{ preInfo.title }}</span>
        </div>
        <div
            class="page_next"
            @click="toDetali(nextInfo)"
            v-if="nextInfo"
        >
            <span>下一篇></span>
            <span>{{ nextInfo.title }}</span>
        </div>
    </div>
        </div>
   
          <!-- 收藏按钮 -->
    <div class="collect_btn">
      <template v-if="collectStatus">
              <span @click="collect(1)" class="cancel_collect"  v-if="collectId !== 0">+ 加入收藏</span>
              <span class="active_collect" v-else @click="collect(2)">
                <i class="el-icon-check" style="margin-right:4px;"></i>收藏成功
              </span>
      </template>
      <template v-if="projectInfo.isOnline == 1">
          <span  @click="govermentFeeLength > 0 ? showOrder = true : submitOrder()">立即下单</span>
      </template>
      <template v-else>
          <span @click="showMeiqia">立即咨询</span>
      </template>
    </div>

    <div class="pop-order">
      <mt-popup
        v-model="showOrder"
        position="bottom">
        <div class="bottom-order">
          <img class="close-ico" :src="require('~/assets/images/zscq/close_icon@2x.png')" @click="closePop" alt="" />
          <div class="bottom-price">
            <b v-if="projectInfo.feeType == 2">官费价格</b>
            <b v-else>服务价格</b>
            <span class="bottom-symbol">￥</span>
            <b>{{ projectInfo.nowFee | receivePrice }}</b>
            <span v-if="projectInfo.previousFee" class="original-price">￥{{projectInfo.previousFee | receivePrice}}</span>
          </div>
          <div class="choose-fee" @click="feeStandard" v-if="projectInfo.feeType != 2 && projectInfo.hasPublicExpense ==0">
            <h3>官费代缴</h3>
            <div class="circle">?</div>
          </div>
          <div class="fee-type" v-if="projectInfo.policyGovfeeTypeList && projectInfo.policyGovfeeTypeList.length > 0">
            <ul>
              <li :class="['fee-type-item',index == nowIdx ?'choosed-type':'']" v-for="(item, index) in projectInfo.policyGovfeeTypeList" :key="index" @click="changeDefault(index)">
                <div class="type-block">
                  <p>{{ item.typeName }}</p>
                  <p>￥{{ item.typeFee | receivePrice }}</p>
                </div>
                <img v-if="index == nowIdx" class="check-ico" :src="require('~/assets/images/zscq/duihao@2x.png')" />
              </li>
            </ul>
          </div>
          <div class="fee-num">
            <h3>数量</h3>
            <div class="choose-num">
              <span @click="minusNum">
                <img class="alg-sign" :src="require('~/assets/images/zscq/jian_icon@2x.png')" alt="" />
              </span>
              <span>
                <input class="input-fee-num" type="number" @blur="searchValue" maxlength="99" v-model="feeNum"/>
              </span>
              <span @click="addNum">
                <img class="alg-sign" :src="require('~/assets/images/zscq/jia_icon@2x.png')" alt="" />
              </span>
            </div>
          </div>
          <div class="confirm-btn" @click="submitOrder">确定</div>
        </div>
      </mt-popup>
    </div>

    <!-- 推荐栏 -->
      <!-- <div class="intro_project" v-if="!collectStatus">
        <div class="intro_title">推荐项目</div>
        <project-item v-for="(item,index) in recoList" :key="index" :nuticeInfo='item' :sort="3" :showStatus='true'></project-item>
        <div class="intro_more" @click="toProject">
          <span>更多项目</span>
          <span></span>
        </div>
      </div> -->
    </template>
    <template  v-if="!collectStatus">
         <div class="deleted_img_sty">
            <img :src="require('~/assets/images/technology/No_content_icon@2x.png')" alt="" />
            <p>您查看的内容已下架，请看看其他产品吧</p>
        </div>
    </template>
  </div>
</client-only>
  
</template>

<script>
import { Toast} from "mint-ui";
import { receivePrice } from "@/utils/price"
import {getArtcleDetail,views } from "@/api/policySquare"
import { addColl,cancelCollect } from '@/api/collect'
import projectItem from "@/components/policySquare/project/projectItem";
import { getUserInfo } from '@/api/login'
import axios from 'axios'
import {toWx} from '@/utils/toWx'
export default {
  components:{
    projectItem
  },
    head() {
        return {
            title: this.projectInfo.metaTitle,
            meta: [
                {name: "keywords",content: this.projectInfo.metaKeyword },
                { hid: "description", name: "description", content: this.projectInfo.metaDescription },
            ],
        };
    },
    
    async asyncData({params,query}){
      if(process.server){
        let number = params.projectDetail.substr(0,params.projectDetail.length-1);//项目编号
        let token = params.projectDetail.substr(params.projectDetail.length-1,1);//排序方式
        const res = await axios.get(process.env.ASYNC_DATA_API+'/policy/detail?number='+number+'&type=4'+'&token='+token +'&app=app');
        if(res.data.code == 1000 && res.data.data && res.data.data.detail){
          return {
            projectInfo : res.data.data.detail,
            preInfo : res.data.data.pre,
            collectId: res.data.data.isCollected,
            nextInfo : res.data.data.next,
          }
        }
      }
    },
    filters:{
      filterPrice(val){
          return Number(val)/100
      },
      receivePrice(price){
        return receivePrice(price,1)
      },
    },
    data() {
        return {
        fixed:false,
        activeId:'first',
        showOrder:false,
        showFee:false,
        scrollTop: null,
        nowIdx: 0,
        feeNum:1,
        userInfo:{},
        loginStatus: false,
        swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        loop: false,
        observer: true,
        observeParents: true,
      },
        keyWords:"",
        skiFrom:false,
        page:1,
        recoList:[],
        collectStatus:true,
        showPre: true,
        showNext: true,
        preInfo: {},
        nextInfo: {},
        sort: 3,
        catch: "false",
        cdnUrl: process.env.CDN_BASE_URL,
        projectInfo: {},
        number: "",
        metaTitle: this.$t("message.projectApply") + this.$t("message.detail"),
        content:"通过线下(智能售货机/实体店)购物体验，让顾客先熟悉某一种商品的性能、质量等。若觉得不错，可立即在本地购买，也可以通过网络在线(厂家系统网站或第三方电商平台)购买，且批发零售均可。以达到将线下商品及服务向消费者进行展示及销售，消费者可在线向商家便捷咨询并精准购物的目的，从而拓宽消费者选择商品的余地，也拓宽了商家品牌的展示和销售渠道。使得企业营销成本降低、营销目标更为精确，同时让用户对品牌产生信任度和黏着度。目前市场上还没有同类产品。按智能售货终端设备每台单位成本为12000元，年产量1000台预算，预期可收益191万元左右。",
        imgList: [
            {
                title: "全程监督",
                imgUrl: "project/jiandu_icon@2x.png",
            },
            {
                title: "保障权益",
                imgUrl: "project/jingyan_icon@2x.png",
            },
            {
                title: "十年行业经验",
                imgUrl: "project/quanyi_icon@2x.png",
            },
        ],
        screenType:'',
        govermentFeeLength: 0,
        collectId:''
      };
    },
    created() {
        this.number = this.$route.params.projectDetail.substr(0,this.$route.params.projectDetail.length-1); 
        this.screenType = this.$route.params.projectDetail.substr(this.$route.params.projectDetail.length-1,1); 
        if (this.$route.query.catch) {
            this.catch = this.$route.query.catch;
        }
        if (this.$route.query.page) {
            this.page = this.$route.query.page;
        }
        if (this.$route.params.sort) {
            this.sort = this.$route.params.sort;
        }
        if (this.$route.query.keyWords) {
            this.keyWords = this.$route.query.keyWords;
        }
        if (this.$route.query.skiFrom) {
            this.skiFrom = this.$route.query.skiFrom;
        }
    },
    methods: {
      changeDefault(whichInex){
        this.nowIdx = whichInex;
        this.govermentFeeType = whichInex;
        this.projectInfo.policyGovfeeTypeList.forEach((item,index)=>{
          if(whichInex === index){
            item.isDefault = 1
          }else{
            item.isDefault = 0
          };
        })
      },
      handelWeikuan(before,now){
          return (Number(now)-Number(before))/100
      },
       getViews(){
            views(this.number).then(res=>{})
        },
        closePop(){
      this.showOrder = false;
        },
      submitOrder(){
        if(this.loginStatus == true){
          // if(this.userInfo.certificationStatus ==1){
            this.$router.push({
              path: '/order/order-pay',
              query:{
                productNum: this.feeNum,
                orderType: 1,//0-知识产权 1-项目
                projectNo: this.projectInfo.number,
                screenType: this.screenType,
                govermentFeeType: this.govermentFeeType,
                source: 'product-detail'
              }
            })
          // }else{
          //   this.$router.push('/member/authentication');
          // };
        }else{
          // this.$router.push({
          //   path: '/login'
          // })
          toWx()
        };
      },
      minusNum(){
        this.feeNum--
        if(this.feeNum<1){
          this.feeNum=1;
          Toast({
            message: '数量不能再减少了',
            position: 'bottom',
            duration: 3000
          });
        }
      },
      addNum(){
        this.feeNum++
        if(this.feeNum>99){
          this.feeNum=99;
          Toast({
            message: '输入数量超出库存',
            position: 'bottom',
            duration: 3000
          });
        }
      },
      searchValue(){
        let reg = /^\+?[0-9][0-9]*$/;
        let regex=/^[0]+/;
        if (!reg.test(this.feeNum)) {
          this.feeNum = 1;
        }
        if (regex.test(this.feeNum)) {
          this.feeNum = this.feeNum.replace(regex,"");
        }
        if(this.feeNum>99){
          this.feeNum=99;
          Toast({
            message: '输入数量超出库存',
            position: 'bottom',
            duration: 3000
          });
        }
      },
      handleClick(val){
        if(val==='first'){
          var el = document.getElementById('header');
          if(this.fixed){
            this.$nextTick(()=>{
              window.scrollTo({
                behavior: "smooth",
                top: el.offsetTop-60,
              });
            })
          }else{
            this.$nextTick(()=>{
              window.scrollTo({
                behavior: "smooth",
                top: el.offsetTop-120,
              });
            })
          }
        }else if(val==='second'){
          var el = document.getElementById('center');
          if(this.fixed){
            this.$nextTick(()=>{
              window.scrollTo({
                behavior: "smooth",
                top: el.offsetTop-60,
              });
            })
          }else{
            this.$nextTick(()=>{
              window.scrollTo({
                behavior: "smooth",
                top: el.offsetTop-120,
              });
            })
          }
        }else if(val === 'third'){
          var el = document.getElementById('under');
            if(this.fixed){
              this.$nextTick(()=>{
                window.scrollTo({
                  behavior: "smooth",
                  top: el.offsetTop-60,
                });
              })
            }else{
              this.$nextTick(()=>{
                window.scrollTo({
                  behavior: "smooth",
                  top: el.offsetTop-120,
                });
              })
            }   
          }
          this.activeId = val;
        },
        toProject(){
          this.$router.push({
            path:"/project"
          })
        },
        toList() {
          this.$router.go(-1)
      },
      collect(status){
        if(localStorage.getItem('userInfo')){
          var userInfo = JSON.parse(localStorage.getItem('userInfo'));
          var id = userInfo.userId
        }else{
          //  this.$router.push({
          //       path: '/login'
          //   })
          toWx()
            return
        }
        if(status == 1){//status 1-收藏 2-取消收藏
          let param = {
            accountId: id,
            number:this.number,
            type:0
          }
          addColl(param).then(res=>{
            if(res.code == 0){
               Toast({
                message: "收藏成功！",
                position: "middle",
                duration: 5000,
              });
              this.getDetail();
            }
          })
        }else{
          let newparam = {
              accountId: id,
              numbers:[this.number]
          }
          cancelCollect(newparam).then(res=>{
            if(res.code == 0){
              Toast({
                message: "取消收藏成功！",
                position: "middle",
                duration: 5000,
              });
              this.getDetail();
            }
          })
        }
      },
      toDetali(obj) {
    const newPath = this.$router.resolve({
      path: "/project/" + obj.number+this.sort,
      query: {
          catch: this.catch,
          sort: this.sort
        }
    });
    window.open(newPath.href, "_self");
      },
     goBack() {
        //   if (this.skiFrom) {
        //       this.$router.push({
        //           path: "/project",
        //           query:{
        //             skiFrom:this.skiFrom,
        //             page:this.page,
        //             search:this.keyWords
        //           }
        //       });
        //   } else {
        //       this.$router.go(-1)
        //   }
         this.$router.push({
            path:"/project"
          })
      },
      toHome() {
        this.$router.push({
            path: "/",
        });
      },
      getDetail() {
        let param = {
          number: this.number,
          type: 4,
          screen: this.sort,
          app:'app'
        };
        getArtcleDetail(param).then((res) => {
          if(res.code == 1000){
            this.projectInfo = res.data.detail;
            if(res.data.recommend){
              this.recoList = res.data.recommend
            }
            if (this.projectInfo.deleted == 1||this.projectInfo.showStatus == 2) {
              this.collectStatus = false
              }else{
              this.collectStatus = true
              }
            this.collectId = res.data.isCollected;
            if (res.data.pre) {
              this.preInfo = res.data.pre;
              this.showPre = true;
            } else {
              this.showPre = false;
            }
            if (res.data.next) {
              this.nextInfo = res.data.next;
              this.showNext = true;
            } else {
              this.showNext = false;
            }
            if(this.projectInfo.policyGovfeeTypeList){
              this.govermentFeeLength = this.projectInfo.policyGovfeeTypeList.length;
            }
            this.projectInfo.policyGovfeeTypeList.forEach((item,index)=>{//获取默认官费下标
              if(item.isDefault == 1){
                  this.govermentFeeType = index;
              }else{

              };
            })
          }
        });
        getUserInfo().then(res => {
          if (res.code == 0) {
            this.userInfo = res.data;
            this.loginStatus = true;
          }else{
            this.loginStatus = false;
          }
        });
      },
      showMeiqia() {
          var _53 = $53.createApi(); /*开发者文档1.1 创建SDK资源对象*/
          _53.push("cmd", "mtalk");
          _53.query();
      },
      handleScroll() {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 600) {
            this.fixed = true;
        } else {
            this.fixed = false;
        }
      },
      
      goback(){
        history.pushState(null, null, document.URL);
        this.$router.push({
          path:'/project'
        })
      },
    },
    mounted() {
      if(process.client){
        var ua = navigator.userAgent.toLowerCase();
        this.getDetail();
        this.getViews();
        window.addEventListener("scroll", this.handleScroll,true);
        if(window.history && window.history.pushState){
          history.pushState(null, null, document.URL);
          window.addEventListener('popstate', this.goback, false);
        }
      }
    },
    destroyed() {
    //离开该页面需要移除这个监听的事件
      window.removeEventListener("scroll", this.handleScroll,true);
      window.removeEventListener('popstate', this.goback, false);
    },
};
</script>

<style scoped>
.down{
  width: 80px;
  height: 40px;
  line-height: 40px;
  background: #8D8D8D;
  opacity: 1;
  border-radius: 5px;
  text-align: center;
  position: absolute;
  left: 40%;
  top: 40%;
  z-index: 999999;
}
.deleted_img_sty{
  padding-top: 1.546666666666667rem;
  padding-bottom: 1.546666666666667rem;
  width: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #F4F6F8;
}
.deleted_img_sty img{
  width: 3.253333333333333rem;
  height: 2.986666666666667rem;
}
.deleted_img_sty p{
  font-size: 0.3733333333333333rem;
  color: #8D8D8D;
}
.position-fixed{
    position:fixed;
    top: 0px;
    z-index:999;
    cursor: pointer;
    background: #f5f5f5;
}
.scrollbar{
  display: inline-block;
  width: 20px;
  height: 4px;
  background: #36A6FE;
  opacity: 1;
  border-radius: 4px;
  position: absolute;
  top: 22px;
  left: 20px;
}
.alltitle{
  width: 100%;
  padding-top: 0.42666666667rem;
  padding-left:26px;
  padding-right:26px;
  display: flex;
  justify-content: space-between;
  height: 50px;
}
.activeSty{
  color:#36A6FE;
  font-weight:bold;
}
.desctitle{
  display: inline-block;
  font-size: 14px;
  position: relative;
}
.wrapper {
  width: 100%;
  height: 5.866666666666666rem;
  position: relative;
  overflow: hidden;
}
.cut_img {
  width: 100%;
  height: 5.866666666666666rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.swiper-img {
  width: 100%;
  height: 100%;
}
.wrapper >>> .swiper-pagination-bullets {
  bottom: 0.3rem;
}

.wrapper >>> .swiper-container {
  width: 100%;
  height: 100%;
}

.wrapper >>> .swiper-pagination-bullet-active {
  background: rgb(0, 122, 255);
}
.collect_btn {
  width: 100%;
  position: fixed;
  height: 1.653333333333333rem;
  margin-top: 0.1333333333333333rem;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  /* height: 62px;
  margin-top: 5px;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center; */
}
.collect_btn span {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4.453333333333333rem;
  height: 0.9066666666666666rem;
  color: #333333;
  background: #ffffff;
  border: 1px solid #999999;
  opacity: 1;
  border-radius: 0.9066666666666666rem;
  font-size: 0.37333333333333335rem;
}
.collect_btn > span:nth-of-type(2) {
  margin-left: 0.29333333333333333rem;
  background: #36a6fe;
  border: 0.02666666666666667rem solid #36a6fe;
  color: #ffffff;
}
.collectionBtn{
    width:2rem;
    line-height:1rem;
    margin-left:80%;
}
.project_apply {
  background: #eff2f3;
  width: 100%;
  /*padding-bottom: 1.70666666667rem*/
}
.project_header_title {
  height: 44px;
  background: #ffffff;
  color: #36a6fe;
  font-size: 0.42666666667rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.project_header_left {
  margin-left: 0.42666666667rem;
}
.project_header_right {
  margin-right: 0.42666666667rem;
}
.project_img {
  width: 100%;
  position: relative;
}
.img_shadow {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: #ffffff;
  margin-top: 4px;
  height: 60px;
}
.img_shadow .shadow_item {
  text-align: center;
  flex: 1;
  justify-content: center;
  border-left: 1px solid #ccc;
  opacity: 1;
}
.img_shadow > .shadow_item:nth-of-type(1) {
  border-left: none;
}
.shadow_item img {
  width:18px;
  height:18px;
}
.shadow_item span {
  margin-top: 0.42666666667rem;
  color: #656565;
  opacity: 1;
  font-size: 0.32rem;
}
.project_img img {
  width: 100%;
  height: 100%;
  position: absolute;
}
.project_img video {
  width: 100%;
  height: 100%;
  position: absolute;
}
.project_title {
  background: #ffffff;
  /* height: 3.38666666667rem; */
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.project_title div:nth-of-type(1) {
  width: 91.466666667%;
  margin-top: 0.37333333333333335rem;
  margin-left: 0.37333333333333335rem;
  margin-bottom: 0.13333333333333333rem;
  color: #333333;
  font-size: 0.48rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-weight: bold;
}
.project_title div:nth-of-type(2) {
  width: 91.466666667%;
  margin-bottom: 0.37333333333333335rem;
  margin-left: 0.37333333333333335rem;
  color: #666666;
  font-size: 0.37333333333rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.project_ask {
  /* margin-top: 0.26666666667rem; */
  width: 100%;
  /* height: 3.106667rem; */
  /* height: 4.10666666667rem; */
  /* background: #ffffff;
  opacity: 1;
  display: flex;
  justify-content: center;
  flex-wrap: wrap; */
  height: 50px;
  background: #eff2f3;
  padding:8px 0 8px 0;
  display:flex;
}
 
    
 
.ask_classify {
  /* height: 60%; */
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-left: 0.4rem;
  flex-wrap: wrap;
}
.project_ask .desc_item {
  width: 2.66666666667rem;
  height: 0.8rem;
  background: #eff8ff;
  border-radius: 0.05333333333rem;
  color: #36a6fe;
  margin-top: 0.22666666667rem;
  /* margin-left: 0.21333333333rem; */
  margin-right: 0.21333333333rem;
  text-align: left;
  line-height: 0.8rem;
  margin-bottom: 4.5px;
}
.project_ask > .desc_item:nth-of-type(4) {
  margin-top: 0.26666666667rem;
}
.project_ask > .desc_item:nth-of-type(5) {
  margin-top: 0.26666666667rem;
}
.project_ask > .desc_item:nth-of-type(6) {
  margin-top: 0.26666666667rem;
}
.project_ask .desc_btn {
  width: 91.466666667%;
  height: 1.06666666667rem;
  background: #36a6fe;
  opacity: 1;
  border-radius: 0.53333333333rem;
  font-size: 0.42666666667rem;
  line-height: 1.06666666667rem;
  text-align: center;
  color: #ffffff;
  margin-top: 0.32rem;
  margin-bottom: 0.42666666667rem;
}
.project_desc {
  width: 100%;
  background: #ffffff;
  margin-top: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.desc_top {
  display: flex;
  justify-content: center;
  align-items: center;
}
.desc_top span {
  display: flex;
  font-size: 0.42666666667rem;
  font-weight: bold;
}
.desc_top > span:nth-of-type(1) {
  width: 0.8rem;
  height: 0.05333333333rem;
  background: linear-gradient(270deg, #36a6fe 0%, rgba(187, 218, 242, 0) 100%);
  opacity: 1;
  margin-right: 0.10666666667rem;
}
.desc_top > span:nth-of-type(3) {
  width: 0.8rem;
  height: 0.05333333333rem;
  background: linear-gradient(90deg, #36a6fe 0%, rgba(187, 218, 242, 0) 100%);
  opacity: 1;
  margin-left: 0.10666666667rem;
}
.desc_main {
  /* width: 91.466666667%; */
  width: 100%;
  margin-top: 0.32rem;
  font-size: 0.37333333333rem;
  line-height: 0.56rem;
  color: #666;
  padding-bottom: 0.5rem;
  overflow-x: scroll;
}
.desc_main >>> img {
  max-width: 100%;
  height: auto !important;
}
.desc_main >>> video {
  width: 100%;
  height: 160px;
}
.desc_main >>> iframe {
  width: 100%;
  height: 160px !important;
}
.project_process {
  width: 100%;
  height: 12.3733333333rem;
  margin-top: 0.53333333333rem;
}
.process_main {
  display: flex;
}
.main_left {
  width: 14.4%;
  margin-top: 1.06666666667rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}
.process_pointer_top {
  position: absolute;
  top: -0.69333333333rem;
  left: 0.56rem;
  color: #36a6fe;
  transform: rotate(90deg);
  font-size: 0.42666666667rem;
}
.process_pointer_bottom {
  position: absolute;
  bottom: 0.37333333333rem;
  left: 0.64rem;
  color: #36a6fe;
  transform: rotate(90deg);
  font-size: 0.42666666667rem;
}
.left_item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.left_item > span:nth-of-type(1) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0.48rem;
  height: 0.48rem;
  background: #36a6fe;
  border-radius: 50%;
  opacity: 1;
  color: #ffffff;
  font-size: 0.32rem;
}
.left_item > span:nth-of-type(2) {
  display: flex;
  margin-top: 0.10666666667rem;
  margin-bottom: 0.10666666667rem;
  width: 0px;
  height: 1.06666666667rem;
  border: 1px solid #36a6fe;
  opacity: 1;
}
.main_right {
  width: 81.333333333%;
  margin-top: 0.69333333333rem;
}
.right_item {
  width: 100%;
  height: 1.28rem;
  background: #ffffff;
  box-shadow: 0px 3px 0.16rem rgba(56, 94, 110, 0.16);
  opacity: 1;
  margin-bottom: 0.48rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}
.right_item > span:nth-of-type(1) {
  color: #333333;
  font-size: 0.37333333333rem;
  font-weight: bold;
  margin-left: 0.53333333333rem;
}
.right_item > span:nth-of-type(2) {
  color: #999999;
  font-size: 0.32rem;
  margin-left: 0.53333333333rem;
}
.process_angle {
  position: absolute;
  width: 0;
  height: 0;
  margin-bottom: 0.05333333333rem;
  border: 0.3rem solid;
  border-color: transparent transparent #ffffff #ffffff;
  transform: rotate(-80deg);
  top: 0;
  left: -0.18666666667rem;
}
.project_advantage {
  width: 100%;
  height: 10.0266666667rem;
  background: #ffffff;
  margin-top: 0.53333333333rem;
}
.advantage_main {
  margin-top: 0.42666666667rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.advantage_item {
  display: flex;
  width: 4.37333333333rem;
  height: 3.84rem;
  background: #ffffff;
  box-shadow: 0px 3px 0.16rem rgba(56, 94, 110, 0.16);
  opacity: 1;
  border-radius: 0.10666666667rem;
  margin-left: 0.21333333333rem;
  margin-right: 0.21333333333rem;
  margin-bottom: 0.42666666667rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.advantage_item img {
  width: 1.06666666667rem;
  height: 1.06666666667rem;
}
.advantage_item > span:nth-of-type(1) {
  font-size: 0.42666666667rem;
  color: #666666;
  margin-top: 0.16rem;
  margin-bottom: 0.10666666667rem;
}
.advantage_item > span:nth-of-type(2) {
  font-size: 0.37333333333rem;
  color: #999999;
}
.over_flowe {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis !important;
  white-space: nowrap;
  padding-left: 0.2rem;
}

.page_change {
  background: #ffffff;
  margin-top: 0.26666666667rem;
  padding-bottom: 0.53333333333rem;
  margin-bottom: 50px;
}
.page_last {
  margin: 0px 0px 0px 0.26666666667rem;
  padding-top: 0.26666666667rem;
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
  margin: 0.26666666667rem 0px 0px 0.26666666667rem;
  padding-top: 0.26666666667rem;
}
.page_next > span:nth-of-type(1) {
  color: #999999;
  font-size: 14px;
}
.page_next > span:nth-of-type(2) {
  color: #656565;
  font-size: 14px;
}
.shadow_down{
  color:#fff;
  font-size: 14px;
}
.intro_project{
  background: #fff;
  border-top: 0.26666666667rem solid #eff2f3;
}
.intro_title{
  color: #333333;
  font-size: 0.42666666667rem;
  margin-top: 0.42666666667rem;
  margin-left: 0.42666666667rem;
}
.intro_more{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #666666;
  padding-top: 0.66666666667rem;
  padding-bottom: 0.66666666667rem;
}
.intro_more>span:nth-of-type(2){
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0.16rem;
  height: 0.16rem;
  border-top: 1px solid#666666;
  border-right: 1px solid#666666;
  transform: rotate(45deg);
}
.tab_title {
  height: 1.173333333333333rem;
  background: #ffffff;
  color: #36a6fe;
  font-size: 0.42666666667rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f4f6f8;
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.03);
}
.tab_title_sty {
  height: 100%;
  position: relative;
  color: #363636;
  font-size: 0.4266666666666667rem;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.tab_left {
  margin-left: 0.42666666667rem;
  color: #363636;
}
.img_right {
  width: 0.4266666666666667rem;
  color: #363636;
  margin-right: 0.4rem;
}
.active_collect{
  background: linear-gradient(126deg, #FFC426 0%, #FFAE26 100%) !important;
  color: #FFFFFF !important;
  border: none !important;
  opacity: 1;
}
.cancel_collect{
  color: #FFC426 !important;
  border-color: #FFC426 !important;
}
.project_online{
  display: flex;
}
.area{
        height: 1.4133333333333333rem;
        background: #EFF8FF;
        display:flex;
        flex: 1;
    }  
.areaitem{
            display:flex;
            flex-direction: column;
            text-align: center;
            color: #999999;
            font-size: 0.32rem;
            background: #EFF8FF;
            height: 0.9333333333333333rem;
        }
.under{
      display:inline-block;
      margin-top:0.08rem;
      }   
.areaitem:first-child{
            border-right: 1px solid #e2e2e2;
            width: 50%;
            margin-top: 0.21333333333333335rem;
        }
.areaitem:last-child{
            width: 50%;
            margin-top: 0.21333333333333335rem;
        }
.price{
    width: 5.546666666666667rem;
    height:1.44rem;
    background: linear-gradient(126deg,#ff762d 7%, #ffb759 100%);
    border-radius: 0.26666666666666666rem;
  }
.comprehensive{
    display:flex;
    margin-top:0.13333333333333333rem;
    line-height:0.5066666666666667rem;
    }
.mt{
    margin-top: 0.08rem;
    margin-left: 0.32rem;
    }
  .word{
        font-size: 0.32rem;
        color: #FFFFFF;
        font-weight: 400;
    }
  .word_b{
        font-size: 0.32rem;
        color: #FFFFFF;
        font-weight: 400;
  }
    .weikuan_b{
        margin-top: 3px;
        margin-left: 10px;
        }
    .weikuan{
        /* margin-left:12px; */
        font-size: 0.32rem;
        color: #FFFFFF;
        font-weight: 400;
    }
    .word_a{
        font-size: 0.32rem;
        color: #FFFFFF;
        font-weight: 400;
    }
    .weikuan_a{
        font-size: 0.32rem;
        color: #FFFFFF;
        font-weight: 400;
    }
    .priceword{
        font-size: 0.6933333333333334rem;
        font-weight:bold;
        color: #FFFFFF;
    }
  .priceword_a{
        font-size: 0.37333333333333335rem;
        font-weight:bold;
        color: #FFFFFF;
    }
    .del_a{
        margin-top: 26px;
        margin-top: 24px;
        margin-left: 4px;
        text-decoration:  line-through;  
        font-size: 10px;
        color: #FFFFFF;
        }
    .mt_a{
        margin-top: 3px;
        }
    .mianyi{
        font-size: 26px;
        font-weight:bold;
        color: #FFFFFF;
        }  
    .mianyi_a{
        font-size: 20px;
        font-weight:bold;
        color: #FFFFFF;
        } 
.top{
  margin-top: 10px;
  margin-left: 12px;
}
.top_a{
      margin-top: 14px;
      margin-left: 12px;
    } 
.bottom-order{
  margin: .32rem;
  border-radius: 10px 10px 0px 0px;
  position: relative;
  height: 230px;
}
.close-ico{
  position: absolute;
  width: .53333333rem;
  height: .53333333rem;
  top: 0;
  right: 0;
}
.bottom-price{
  display:flex;
  height: .64rem;
  align-items:baseline;  
}
.bottom-price b, .choose-fee h3, .fee-num h3{
  font-size: .373333333rem;
  font-family: Source Han Sans CN;
}
.choose-fee{
  display: flex;
  align-items: center;
  margin-top: .32rem;
}
.choose-fee h3, .fee-num h3{
  color: #333;
}
.circle{
  width: .37333333333rem;
  height: .3733333333rem;
  font-size: .2rem;
  line-height: .32rem;
  border: 1px solid #36A6FE;
  color: #36A6FE;
  text-align: center;
  border-radius: 50%;
  margin-left: .2rem;
}
.bottom-price>:first-child{
  color: #333;
}
.bottom-price>:nth-child(3){
  color: #FF6D27;
}
.bottom-symbol{
  margin-left: .4rem;
  color: #FF6D27;
}
.confirm-btn{
  width: 100%;
  height: 1.066666667rem;
  line-height: 1.066666667rem;
  margin: .32rem 0;
  text-align: center;
  color: #fff;
  background: #36A6FE;
  border-radius: .5333333rem;
  font-size: .4266666666667rem;
  margin-top: 20px;
  margin-bottom: 20px;
}
.alg-sign{
  width: .533333333rem;
  height: .533333333rem;
}
.input-fee-num{
  height: .533333333rem;
  line-height: .5333333333rem;
  width: 1.2rem;
  font-size: .426666667rem;
  color: #333;
  border: 0;
  text-align: center;
}
.fee-num{
  display: flex;
  margin-top: 114px;
}
.choose-num{
  display: flex;
  align-items:center;
  margin-left: 237px;
  
}
.guan{
  font-size :14px
  display flex;
  align-items:center;
  margin-top:5px;
}
.guanwidth{
  width:72px;
  margin-right:6px;
}
.guan,
item{
  width: 134px;
  height: 24px;
  opacity: 1;
  border: 1px solid #999999;
  border-radius: 5px;
  position:relative;
  text-align: center;
  line-height: 24px;
  margin-right:10px;
  cursor:pointer;
  color: #999;
}
.duo{
  font-size: 12px;
  top: 88px;
  left: 92px;
  width: 110px;
  height: 58px;
  background: #ECF5FF;
}
.duo:last-child{
  margin-left: 10px;
}
.typeFee_price{
      font-size: 12px;
      color: #FD4A1C;
      margin-left: 6px;
      color:#999;
      }
.activeprice{
      color: #36a6fe
  }
.gou{
        width:18px;
        height :18px;
        position :absolute;
        top: 97px;
        left: 94px;
    }
.activeborder{
    border: 1px solid #36a6fe !important;
    color: #36a6fe;
    background: #fff ;
  }
.ask{
      width: 14px;
      height: 14px;
      display :inline-block;
      opacity: 1;
      font-size :10px;
      border-radius: 50%;
      background :#36A6FE;
      color :#fff;
      text-align: center;
      position: relative;
      left: 6px;
      line-height: 14px;
      cursor: pointer;
  }
.last-next{
    margin-top: 32px;
    position: relative;
    top: -13.5px;
    cursor:pointer;
    color:#656565;
    line-height:25px;
}
.lastone{
        margin-bottom:5px;
    }
.guan_a{
  display: flex;
  margin-top: 7px;
}
</style>
<style>
.m-html p {
  width: 100%;
  /* padding: 0 16px; */
}
.m-html p img {
  width: 100% !important;
  height: auto !important;
}
.fee-type-item{
  width: 32%;
  float: left;
  display:table;
  text-align: center;
  color: #333;
  font-family: Source Han Sans CN;
  margin:0 2% .32rem 0;
  height: 1.44rem;
  background: #ECF5FF;
  border-radius: 5px;
  position: relative;
}
.fee-type-item:nth-child(3n+3){
  margin-right: 0 !important;
}
.choosed-type{
  border: 1px solid #36a6fe;  
  color: #36a6fe;
  background: #fff;
  box-sizing: border-box; 
  -webkit-box-sizing: border-box; 
  -moz-box-sizing: border-box; 
}
.check-ico{
  position: absolute;
  width: .64rem;
  height: .586666667rem;
  bottom: 0;
  right: -1px;
}
.type-block{
  display:table-cell; 
  vertical-align:middle;
}
.type-block p{
  max-width: 2.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right:.1rem;
}
.original-price{
  text-decoration:line-through;
  font-size: .266667rem;
  color: #999;
  margin-left: .1rem;
}
</style>>