<template>
  <client-only>
    <div class="newproduct">
        <div class="header">
            <img :src="require('@/assets/images/classification/lack@2x.png')" @click="prev" class="navimg" alt /> 
            <span class="navtitle">产品详情</span>
        </div>
        <!-- 轮播 -->
        <div class="wrapper" v-if="baseInfo.imageList && baseInfo.imageList.length">
            <swiper :options="swiperOption">
                <swiper-slide v-for="(item,index) in baseInfo.imageList" :key="index">
                    <img class="swiperImg" v-if="filterType(item)" :src="cdnPath + item.imageUrl"  />
                    <video class="swiperImg" v-if="!filterType(item)"  :src="cdnPath + item.imageUrl" controls="controls"></video>
                </swiper-slide>
                <div v-if="baseInfo.imageList.length!=1" class="swiper-pagination" slot="pagination"></div>
            </swiper> 
        </div>
        <div class="infocontent">
            <!-- 价格 -->
            <div class="serviceprice">
              <div class="pricemark">
                <template v-if="baseInfo.isOnline == false">
                  <div class="nat"><p>服务费</p><div class="markprice">面议</div></div>
                </template>
                <template v-if="baseInfo.isOnline == true">
                  <!-- 一口价 -->
                  <template v-if="choiceAttribute.dueTypeOfficialFee || choiceAttribute.dueTypeAgencyFee || choiceAttribute.dueTypeThirdPartyFee">
                      <div class="nat"><p>服务费</p><div class="markprice"><span class="markyuan">￥</span>{{choiceAttribute | filterOnePrice | filterViewprice }}</div></div>
                  </template>
                  <template v-else-if="choiceAttribute.noAttritube">
                      <div class="nat"><p style="position: relative;top: 10px;">该组合产品尚未设置价格</p></div>
                  </template>
                  <!-- 定金+尾款 -->
                  <template v-else>
                    <div class="nat"><p>定金</p><div class="markprice"><span class="markyuan">￥</span>{{choiceAttribute | filterdepositPrice | filterViewprice}}</div></div>
                    <div class="nat special"><p>尾款</p><div class="markprice"><span class="markyuan">￥</span>{{choiceAttribute | filterfinalPrice | filterViewprice}}</div></div>
                  </template>
                </template>
              </div>
              <div class="area" v-if="baseInfo.categoryId==1">
                <div>
                  <p class="mb">地区</p>
                  <p>
                      <template v-if="area!=null&&area.length>=6">{{area.substr(0,5)+'...'}}</template>
                      <template v-else>{{area}}</template>
                  </p>                 
                </div>
                <div>
                  <p class="mb">归口</p>
                  <p>
                    <template v-if="puntGk!=null&&puntGk.length>=6">{{puntGk.substr(0,5)+'...'}}</template>
                    <template v-else>{{puntGk}}</template>
                  </p>
                </div>
              </div>
            </div>
            <div class="info-html">
              <!-- 标题 -->
              <div class="infotitle">
                  <p class="biaoti">{{baseInfo.spuTitle}}</p>
                  <p class="sologan">{{baseInfo.spuSlogan}}</p>
                  <div class="advantage">
                    <div>
                      <img :src="require('@/assets/images/productdetails/quanchengjiandu_icon@2x.png')" /> 
                      <span>全程监督</span>
                    </div>
                    <div>
                      <img :src="require('@/assets/images/productdetails/quanchengjiandu_icon@2x.png')" /> 
                      <span>保障权益</span> 
                    </div>
                    <div>
                      <img :src="require('@/assets/images/productdetails/quanchengjiandu_icon@2x.png')" /> 
                      <span>十年行业经验</span>
                    </div>
                </div>
              </div>
               <!-- 规格 -->
              <div class="guige">
                 <div class="guanfee" v-if="choiceAttribute.depositTypeOfficialFee || choiceAttribute.dueTypeOfficialFee"  @click="popupVisible=true">
                    <span class="fees">官费</span>
                    <span class="nums b" v-if="choiceAttribute.depositTypeOfficialFee">￥{{choiceAttribute.depositTypeOfficialFee | filterViewprice}}</span>
                    <span class="nums b" v-if="choiceAttribute.dueTypeOfficialFee">￥{{choiceAttribute.dueTypeOfficialFee | filterViewprice}}</span>
                    <img :src="require('@/assets/images/productdetails/gengduo_icon@2x.png')" /> 
                 </div>
                  <div class="guanfee" @click="popupVisible=true">
                    <span class="fees">规格</span>
                    <span class="numsact">{{attributeText}}</span>
                    <img :src="require('@/assets/images/productdetails/gengduo_icon@2x.png')" /> 
                 </div>
              </div>
              <div class="fixed-width html-nav" v-if="fixed">
                <div v-for="(item,index) in detailInfoList" :key="index" class="nav-flex" @click="handleTagClick(index)">
                  <div :class="['html-navtitle',index==activeTag?'html-active':'']">{{item.tagName}}
                  </div>
                    <div :class="[index==activeTag?'bottom-line':'']"></div>
                </div>				
              </div>
              <!-- 富文本 -->
              <div class="fuwenben">
                <div v-for="(item,index) in detailInfoList" :key="index" :id="'html-'+index">
                  <p class="tagname">{{item.tagName}}</p>
                  <div v-html="item.text" class="html-body"></div>
                </div>
              </div>
               <div style="height:1px"></div>
            </div>
            <div class="hot-contain" v-if="hotList.length>0">
              <div class="hot-title">
                <div class="title-circle"></div>
                <h3>热门商品</h3>
              </div>
              <items :list="hotList" :categoryId="baseInfo.categoryId" :hot="true"></items>
            </div>
        </div>
        <!-- 弹框 -->
        <mt-popup v-model="popupVisible" position="bottom">
          <div class="attribute">
              <div v-for="item in dialogImgList" :key="item.id" style="display:flex">
                <img class="popImg" v-if="filterType(item)" :src="cdnPath + item.imageUrl" />
                <video class="popImg" v-if="!filterType(item)"  :src="cdnPath + item.imageUrl" controls="controls"></video> 
                <div class="popfee">
                  <p class="first">     
                    <template v-if="baseInfo.isOnline == false">
                        <span class="a">服务费</span><span class="b">面议</span>
                    </template>
                    <template v-if="baseInfo.isOnline == true">
                      <!-- 一口价 -->
                      <template v-if="choiceAttribute.dueTypeOfficialFee || choiceAttribute.dueTypeAgencyFee || choiceAttribute.dueTypeThirdPartyFee">
                          <span class="a">服务费</span><span class="b"><span style="font-size:11px">￥</span>{{choiceAttribute | filterOnePrice | filterViewprice }}</span>
                      </template>
                      <template v-else-if="choiceAttribute.noAttritube">
                          <span class="a">该组合产品尚未设置价格</span><span class="b"></span>
                      </template>
                      <template v-else>
                         <p><span class="a">定金</span><span class="b"><span style="font-size:11px">￥</span>{{choiceAttribute | filterdepositPrice | filterViewprice}}</span></p>
                         <p style="margin-top:6px"><span class="a">尾款</span><span class="b"><span style="font-size:11px">￥</span>{{choiceAttribute | filterfinalPrice | filterViewprice}}</span></p>
                      </template>
                    </template>
                  </p>
                  <p class="second" v-if="choiceAttribute.depositTypeOfficialFee || choiceAttribute.dueTypeOfficialFee">
                    <span>官费</span><span v-if="choiceAttribute.depositTypeOfficialFee" class="b">￥{{choiceAttribute.depositTypeOfficialFee | filterViewprice}}</span>
                    <span v-if="choiceAttribute.dueTypeOfficialFee" class="b">￥{{choiceAttribute.dueTypeOfficialFee | filterViewprice}}</span>
                  </p>
                </div>
              </div>
            <template v-if="transactionList.length==1">
              <p class="attrleft">默认规格</p>
              <div class="attrright">
                  <span class="attributeItem activeTip">默认</span>
              </div>
            </template>
            <template v-if="transactionList.length>1">
                <div v-for="(parentItem,parentIndex) in attributeList" :key="parentIndex">
                  <p class="attrleft">{{parentItem.key}}</p>
                  <div class="attrright">
                    <span v-for="(childItem,childIndex) in parentItem.value" :key="childIndex" :class="[parentIndex==0&&activeKey.substr(0,1)==childIndex?'activeTip':'',parentIndex==1&&activeKey.substr(2)==childIndex?'activeTip':'','attributeItem']" @click="handleClick(parentIndex,childIndex)">
                        {{childItem}}
                    </span>  
                  </div>
                </div>
            </template>            
            <div class="flex">
                <div class="att mt">数量选择</div>
                <div>
                    <span class="min" @click="checkNum(1)">-</span>
                    <span class="buy">{{productNum}}</span>
                    <span class="min" @click="checkNum(0)">+</span>
                </div>
              </div>
          </div>
        </mt-popup> 
        <div class="productdetailsfooter">
            <div class="fotimg">
              <img :src="require('@/assets/images/productdetails/shouye_icon@2x.png')" />
              <p class="text" @click="gohome(0)">首页</p>
            </div>
             <div class="fotimg">
              <img :src="require('@/assets/images/productdetails/kefu_icon@2x.png')" />
              <p class="text"  @click="gohome(1)">客服</p>
            </div>
            <div class="operation">
                <div v-if="collectStatus==false" class="collect" @click="collect(0)">加入收藏</div>
                <div v-if="collectStatus==true" class="collect" @click="collect(1)">取消收藏</div>
                <div :class="['buy',choiceAttribute.noAttritube==true?'notallow':'']" v-if="baseInfo.isOnline == true" @click="popupVisible ? toPay() : popupVisible = true">立即下单</div>
                <div class="buy" v-if="baseInfo.isOnline == false" @click="gohome(1)">立即咨询</div>
            </div>
        </div>
    </div>
 </client-only>
</template>
<script>
import { Toast,Popup } from "mint-ui"
import { pageGlobalSpu } from "@/api/search";
import axios from "axios"
import { addcollect,cancelcollect,isCollect } from '@/api/productdetails'
import { getProductInfo,getRightProduct,getProductList } from '@/api/productdetails'
import tools from './details' 
import changePhoNum from '../member/account/changePhoNum.vue'
import items from '@/components/product/itemList'
import { getUserInfo } from '@/api/login'
import Encrypt from '~/plugins/Encrypt'
import {toWx} from '@/utils/toWx'
export default {
  components: { changePhoNum,items },
  layout: "top",
 head() {
    return{
         title: this.metatitle,
            meta: [
                { name: "keywords", content: this.metacontent },
                {
                    hid: "description",
                    name: "description",
                    content: this.metadescription
                },
            ]
        }
  },
  async asyncData ({ query, env }){
    if(process.server){
      const res = await axios.get(env.ASYNC_DATA_API+'/product/spu/getInfo?spuId='+query.spuId)
      if(res.data.code == 0){
        return {
          metatitle:res.data.data.baseInfo.seoTitle,
          metacontent:res.data.data.baseInfo.metaKey,
          metadescription:res.data.data.baseInfo.metaDetail
        }
      }
    }
   },
  filters:{
        filterOnePrice(val){
            return tools.filterOnePrice(val)
        },
        filterdepositPrice(val){
            return tools.filterdepositPrice(val)
        },
        filterfinalPrice(val){
            return tools.filterfinalPrice(val)
        },
        filterProjectType(val){
            return tools.filterProjectType(val)
        },
        filterViewprice(val){
            return tools.filterViewprice(val)
        }
    },
  computed:{
      choiceAttribute(){
        if(this.activeKey && this.transactionList.length>0){
            if(this.transactionList.filter(item=>item.skuIndex == this.activeKey).length){
              return this.transactionList.filter(item=>item.skuIndex == this.activeKey)[0].skuPayTypeList
            }else{
                return { noAttritube:true }
            }
          }else{
              return {}
          }
      },
      attributeText(){
            console.log(this.activeKey,'attributeText');
          if(this.activeKey){
            if(this.activeKey.length==1){
              return this.attributeList[0].value[Number(this.activeKey)] //filterattributeList
            }else{
              return (this.attributeList[0].value[Number(this.activeKey.substr(0,1))] +','+ this.attributeList[1].value[Number(this.activeKey.substr(2,3))])
            }
          }else{
            return ''
          }
      }
    },
  data(){
    return {
      cdnPath:process.env.CDN_BASE_URL,
      baseInfo:{},
      attributeList:[],    //属性规格
      transactionList:[],  //后台配置可交易选项
      activeKey:null,  // 默认选中规格
      flag:null, //是否为单层属性,
      detailInfoList:[], //富文本
      serverinfo:[
        {title:'服务承诺'},
        {title:'全程监督',img:require('@/assets/images/productdetails/quanchengjiandu_icon@2x.png')},
        {title:'保障权益',img:require('@/assets/images/productdetails/baozhangquanyi_icon@2x.png')},
        {title:'十年行业经验',img:require('@/assets/images/productdetails/shinianjingyan_icon@2x.png')}
      ],
      activeTag: 0,
      fixed:false,
      productNum:1,
      recommendList:[],
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        loop: false,
        observer: true,
        observeParents: true,
      },
      popupVisible:false,
      dialogImgList:[],
      userId:null,
      collectStatus:false,
      loginStatus: false,
      hotList:[],
      area:null,
      puntGk:null,
    }
  },
  destroyed() {
    //离开该页面需要移除这个监听的事件
    window.removeEventListener("scroll", this.handleScroll,true);
  },
  mounted(){
    this.getDetails();
    let userInfo = localStorage.getItem('userInfo');
    if(userInfo && userInfo != 'undefined' && JSON.parse(userInfo).userId){
      this.userId = JSON.parse(userInfo).userId
      this.judgeCollectStatus()
    };  
    window.addEventListener("scroll", this.handleScroll,true);            
  },
  methods:{
    goAuthentication(){
      this.$router.push('/member/authentication');
    },
    async toPay(){
      console.log(this.choiceAttribute);
      // var encrypt = Encrypt.encrypt(JSON.stringify(row),'Y2FsdGVkX184Asts');//密钥自定义 加密解密
      //没有规格属性
      if(this.choiceAttribute.noAttritube==true){
          return
      }
      this.popupVisible = true
      await getUserInfo().then((res) => {
        if (res.code == 0) {
          this.loginStatus = true;
        }else{
          this.loginStatus = false;
        }
      });
      if(this.loginStatus == true){
        if(this.$store.state.userInfo.userType != 0){
        let goodsId = this.transactionList.filter(item=>item.skuIndex == this.activeKey)[0].id
        let params = {
          spuId: this.$route.query.spuId, // 产品id
          attributeText: this.attributeText,
          goodsId: goodsId,//商品id
          categoryName: tools.filterProjectType(this.baseInfo.categoryId),//产品类型
          type: this.proType,
          number: this.baseInfo.spuCode, // 产品number
          choiceAttribute: this.choiceAttribute,
          url: this.dialogImgList[0]?this.dialogImgList[0].imageUrl:null, // 封面对象
          spuName: this.baseInfo.spuTitle, // 产品名称
          productCount: this.productNum, // 选择的产品数量
          spec: this.baseInfo.spec,
          pageFrom: 1, // 1 代表从产品页面进
          // tailstatusPayFlag: false // 是否支付尾款
        }
        console.log(this.baseInfo);
        var encrypt = Encrypt.encrypt(JSON.stringify(params),'Y2FsdGVkX184Asts');//密钥自定义 加密解密时保持一致即可
          this.$router.push({
            path:'/order/order-pay',
            query:{//旧版 订单重构时自行调整
              // orderType: 1,//0-知识产权 1-项目
              // projectNo: this.projectNo,
              // screenType: this.screenType,
              // govermentFeeType: this.govermentFeeType,
              // spuId: this.$route.query.spuId,
              pageFrom: 1, // 1 代表从产品页面进
              activeKey: this.activeKey,
              productNum: this.productNum,
              data: encrypt,
              tailstatusPayFlag: false // 是否支付尾款
            }
          })
        }else{
          this.$store.state.authDialog = true;
        };
      }else{
        // this.
        localStorage.setItem("spuId", this.$route.query.spuId);
        // this.$router.push({
        //   path: '/login'
        // })
        toWx()
      };
    },
    handleScroll() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 588) {
          this.fixed = true;
      } else {
          this.fixed = false;
      }
    },
    //滚动定位
		handleTagClick(index){
			this.activeTag = index
			this.$nextTick(()=>{
				window.scrollTo({
					behavior: "smooth",
					top: document.getElementById('html-'+index).offsetTop-50
				})
			})
		},
    //是否收藏  
    judgeCollectStatus(){
        isCollect({userId:this.userId,spuId:this.$route.query.spuId}).then(res=>{
            if(res.code==0){
              this.collectStatus = res.data
            }
        })
    },
    //收藏
    collect(type){
      if(this.userId){
        if(type==0){
          addcollect({spuId:this.$route.query.spuId,userId:this.userId}).then(res=>{
            if(res.code==0){
                this.judgeCollectStatus()
            }
          })
        }else{
          cancelcollect({spuIds:[this.$route.query.spuId],userId:this.userId}).then(res=>{
            if(res.code==0){
                this.judgeCollectStatus()
            }
          }) 
        }
      }else{
        localStorage.setItem("spuId", this.$route.query.spuId);
        // this.$router.push('/login')
        toWx()
      }
    },   
    //产品详情
    getDetails(){
      console.log(this.$route.query.spuId,'this.$route.query.spuId-------');
      getProductInfo({spuId:this.$route.query.spuId}).then(res=>{
      console.log(res,'-------res');
        if(res.code==0){
          let data = res.data
          console.log(res.data,852963);
          this.dialogImgList = data.baseInfo.imageList.filter(item=>item.isDefault==true)
          this.baseInfo = data.baseInfo
          this.detailInfoList = data.detailInfoList
          let filterattributeList = data.tradeInfo.dynamicAttributeList.map(item=>({key:Object.keys(item)[0],value:Object.values(item)[0]}));
          console.log(filterattributeList,'filterattributeList');
          this.transactionList = data.tradeInfo.skuList
          this.activeKey = data.tradeInfo.skuList[0].skuIndex
          this.flag = data.tradeInfo.skuList.some(item=>item.skuIndex.indexOf('_')>-1)
          let recordArr = []
          let doublerecordArr = [];
          // 获取归口数据
          if(data.baseInfo.generateAttributeList.length > 0){
            this.puntGk = data.baseInfo.generateAttributeList.filter(item => item.attributeName == '归口')[0].attributeValueDesc;
          };
          this.transactionList.forEach(element => {
          if(element.skuIndex.length==1){
              recordArr.push(Number(element.skuIndex))
          }else{
              recordArr.push(Number(element.skuIndex.substr(0,1)))
              doublerecordArr.push(Number(element.skuIndex.substr(2)))
          }
          })
          // 删除没有配置的规格
          // Array.from(filterattributeList)[0].value = Array.from(filterattributeList)[0].value.filter((item,index)=>Array.from(new Set(recordArr)).includes(index))
          if(this.flag){
              Array.from(filterattributeList)[1].value = Array.from(filterattributeList)[1].value.filter((item,index)=>Array.from(new Set(doublerecordArr)).includes(index))
          }
          this.attributeList = filterattributeList
          if(this.baseInfo.categoryId == 1){ //项目申报获取热门产品
              //获取地区数据
              if(data.baseInfo.generateAttributeList.length > 0){
                this.area = data.baseInfo.generateAttributeList.filter(item => item.attributeName == '地区')[0].attributeValueDesc
              };
              let para = this.fixFiler()
              this.getHotList(this.baseInfo.categoryId,para)
          }else {
              this.getHotList(this.baseInfo.categoryId,[])
          }
        }else{
            this.$message({
                message:res.data.msg,
                type:'error',
                offset:300
            })
        }
      });
    },
    // 传参修改
    fixFiler(){
      let list = []
      this.baseInfo.generateAttributeList.forEach(item=>{
        list.push({
            attributeId: item.attributeId,
            attributeValueList: [item.attributeValue]
        })
      })
      return list
    },
    // 获取热门商品
    getHotList(categoryId,list){
      let params = {
        pageNo: 1,
        pageSize: 8,
        categoryId,
        generateAttributeList: list,
        id: Number(this.$route.query.spuId),
      }
        let url = categoryId == 1 ? getRightProduct : getProductList
        url(params).then(res => {
        if (res.code == 0) {
            this.hotList = res.data.records;
        }
      })
    },
    //切换规格
    handleClick(parentIndex,childIndex){
        if(parentIndex==0){
            if(this.flag){
              this.activeKey =  childIndex +'_'+ this.activeKey.substr(2) 
            }else{
              this.activeKey =  String(childIndex) 
            }
        }else{
            this.activeKey =  this.activeKey.substr(0,1) +'_'+ childIndex
        }
        console.log(this.activeKey);
    },
    //数量选择
    checkNum(type){
      if(type==0){
        if(this.productNum==99){
          return
        }
        this.productNum++
      }else{
        if(this.productNum==1){
          return
        }
        this.productNum--
      }
    },
     // 判断是图片还是视频
    filterType(item){
      if(item.imageUrl.match(/(jpeg|png|jpg|gif)/)){
          return true
      }else{
          return false
      }
    },
    prev(){
        this.$router.go(-1)
    },
    gohome(type){
       if(type==0){
          this.$router.push('/') 
       }else{
          this.showMeiqia()
       }
    },
    showMeiqia() {
        var _53 = $53.createApi(); /*开发者文档1.1 创建SDK资源对象*/
        _53.push("cmd", "mtalk");
        _53.query();
    }, 
  }
}
</script>
<style lang="stylus" scoped>
@import './details.stylus'
</style>
