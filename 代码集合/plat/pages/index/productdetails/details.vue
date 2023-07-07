<template>
    <div class="details">
      <div class="navbar">
        <div class="navcontent">
          <span class="cur-pointer" @click="goNav(0,0)">首页</span><span class="arrow-right"></span>
          <span class="cur-pointer" @click="goNav(1,baseInfo.categoryId)">{{baseInfo.categoryId | filterProjectType}}</span><span class="arrow-right"></span>
          <span>{{baseInfo.categoryId | filterProjectType}}详情</span>
        </div>
      </div>
      <div class="content" v-if="!isDeleted">
        <div class="content-box">
           <!-- 知产类  -->
            <div class="zhichantree" v-if="[2,3,4,5,6].includes(baseInfo.categoryId)">
              <!-- 父亲 -->
              <div v-for="parentItem in treeList" :key="parentItem.categoryCode" class="treeItem" @click="handletreeClick(parentItem)">
                  <p :class="['treechild',parentItem.id==baseInfo.categoryId?'treeactive':'']">
                    {{parentItem.categoryName}}
                    <span v-if="parentItem.child.length && parentItem.show==false " class="el-icon-arrow-right" />
                    <span v-if="parentItem.child.length && parentItem.show==true " class="el-icon-arrow-down" />
                  </p> 
                  <!-- 孩子 -->
                  <template v-if="parentItem.child.length && parentItem.show==true">
                    <div v-for="childItem in parentItem.child" :key="childItem.id">
                       <p :class="['treechild',childItem.id==$route.query.spuId?'treeactive':'']" @click="godetail(childItem.id)">{{childItem.spuTitle}}</p> 
                    </div>
                  </template>
              </div>
          </div>
          <div :class="['left',[2,3,4,5,6].includes(baseInfo.categoryId)?'specaileft':'']">
            <div class="leftfirst">
                <!-- 轮播 -->
                <carousel :baseInfo="baseInfo" :imageList="baseInfo.imageList" v-if="baseInfo.imageList && baseInfo.imageList.length>0" />
                <div class="division"></div>   
                <div class="info">
                    <p class="title">{{baseInfo.spuTitle}}</p>
                    <p class="sologan">{{baseInfo.spuSlogan}}</p>
                    <!-- 地区归口 -->
                    <div class="generateattribute" v-if="baseInfo.generateAttributeList && baseInfo.generateAttributeList.length">
                        <span v-if="areas">地区：{{areas}}</span>
                        <span v-for="(item,index) in baseInfo.generateAttributeList" :key="index">
                          <span class="span-sty" v-if="item.attributeId == 2">归口：</span>
                          <span v-if="item.attributeId == 2">{{item.attributeValueDesc}}</span>
                        </span>
                    </div>
                    <!-- 价格 -->
                    <template v-if="baseInfo.isOnline == false">
                        <div class="priceshow">
                          <span class="pricetext">服务费&nbsp;&nbsp;</span>
                          <span class="pricenum mr">面议</span>
                        </div>
                    </template>
                    <template v-if="baseInfo.isOnline == true">
                      <div class="priceshow">
                          <!-- 一口价 -->
                          <template v-if="choiceAttribute.dueTypeOfficialFee || choiceAttribute.dueTypeAgencyFee || choiceAttribute.dueTypeThirdPartyFee">
                              <span class="pricetext">服务费&nbsp;&nbsp;</span><span class="pricemark">￥</span>
                              <span class="pricenum mr">{{choiceAttribute | filterOnePrice | filterViewprice }}</span>
                               <template v-if="choiceAttribute.dueTypeOfficialFee">
                                    <span class="pricetext">官费&nbsp;&nbsp;</span><span class="pricemark blue">￥</span>
                                    <span class="bluenum mr">{{choiceAttribute.dueTypeOfficialFee | filterViewprice}}</span> 
                              </template>
                          </template>
                          <template v-else-if="choiceAttribute.noAttritube==true">
                              <span class="pricetext">服务费&nbsp;&nbsp;</span>
                              <span class="bright-fee">该组合产品尚未设置价格</span>
                          </template>
                          <!-- 定金+尾款 -->
                          <template v-else>
                              <span class="pricetext">定金&nbsp;&nbsp;</span><span class="pricemark">￥</span>
                              <span class="pricenum mr">{{choiceAttribute | filterdepositPrice | filterViewprice}}</span>
                              <span class="pricetext">尾款&nbsp;&nbsp;</span><span class="pricemark">￥</span>
                              <span class="pricenum mr">{{choiceAttribute | filterfinalPrice | filterViewprice}}</span>
                              <template v-if="choiceAttribute.depositTypeOfficialFee">
                                <span class="pricetext">官费&nbsp;&nbsp;</span><span class="pricemark blue">￥</span>
                                <span class="bluenum mr">{{choiceAttribute.depositTypeOfficialFee | filterViewprice}}</span> 
                              </template>
                          </template>
                      </div>
                    </template>
                    <!-- 服务承诺 -->
                    <div style="display:flex">
                        <div class="serverinfo" v-for="(item,index) in serverinfo" :key="index">
                            <img :src="item.img" v-if="item.img" />
                            <span>{{item.title}}</span>
                        </div>
                    </div>
                    <!-- 规格 -->
                    <template v-if="transactionList.length==1">
                        <div class="attribute">
                          <p class="attrleft">默认规格</p>
                          <div class="attrright">
                              <span class="attributeItem activeTip">
                                  默认&nbsp;&nbsp;<img src="@/assets/images/productdetails/yixuan_icon@2x.png" class="check"  />
                              </span>
                          </div>
                        </div>
                    </template>
                    <template v-if="transactionList.length>1">
                        <div v-for="(parentItem,parentIndex) in attributeList" :key="parentIndex" class="attribute">
                          <p class="attrleft">{{parentItem.key}}</p>
                          <div class="attrright">
                              <span v-for="(childItem,childIndex) in parentItem.value" :key="childIndex"  :class="[parentIndex==0&&activeKey.substr(0,1)==childIndex?'activeTip':'',parentIndex==1&&activeKey.substr(2)==childIndex?'activeTip':'','attributeItem']"  @click="handleClick(attributeList,parentIndex,childIndex)">
                                  {{childItem}}&nbsp;&nbsp;
                                  <img src="@/assets/images/productdetails/yixuan_icon@2x.png" class="check" v-if="parentIndex==0 && activeKey.substr(0,1)==childIndex || parentIndex==1 && activeKey.substr(2)==childIndex" />
                              </span>  
                          </div>
                      </div>
                    </template>
                    <!-- 购买 -->
                    <div class="buy">
                      <template v-if="baseInfo.isOnline == true">
                        <p>购买数量</p>
                        <div class="buybtn">
                            <div class="buynum">{{productNum}}</div>
                            <div><div class="dobtn" @click="checkNum(0)">+</div><div class="dobtn" @click="checkNum(1)">-</div></div>
                        </div>
                        <div :class="['gobuy',choiceAttribute.noAttritube==true?'notallow':'']" @click="toPay()">立即下单</div>
                      </template>
                      <template v-if="baseInfo.isOnline == false">
                            <div class="gobuy" @click="showQia">立即咨询</div>
                      </template>
                    </div>
                </div>
            </div>
            <div class="html-content">
              <!-- 固定头部tab -->
              <div :class="[isZC == true ? 'prod_left' : '','prod_tab_fixed']" v-if="fixed==true">
                <div class="fixed-width html-nav">
                  <div v-for="(item,index) in detailInfoList" :key="index" class="nav-flex" @click="handleTagClick(index)">
                    <div :class="['html-navtitle',index==activeTag?'html-active':'']">{{item.tagName}}
                      <div :class="[index==activeTag?'trangle':'']"></div>
                    </div>
                  </div>						
                  <div :class="[isZC == true ? 'prod_right' : '','prod_tab_btn']" @click.stop="showQia()">
                    <img src="~assets/images/shop/zixun_icon@2x.png" width="20" height="20"/>
                    <span  class="fixed-asknow">立即咨询</span>
                  </div>
                </div>
              </div>

              <div>
                <div :class="[fixed == true ? 'fixed-width' : '','html-nav']">
                  <div v-for="(item,index) in detailInfoList" :key="index" class="nav-flex" @click="handleTagClick(index)">
                    <div :class="['html-navtitle',index==activeTag?'html-active':'']">{{item.tagName}}
                      <div :class="[index==activeTag?'trangle':'']"></div>
                    </div>
                  </div>						
                  <div v-if="fixed == true" class="fixcontactImg" @click.stop="showQia()">
                    <img src="~assets/images/shop/zixun_icon@2x.png" width="20" height="20"/>
                    <span  class="fixed-asknow">立即咨询</span>
                  </div>
                </div>
                </div>
                <div class="fwlc">
                  <p>服务流程</p>
                  <img src="~/assets/images/order/pic_service_process.png" alt="">
                </div>
                <div v-for="(item,index) in detailInfoList" :key="index" class="html-content-foo" :id="'html-'+index">
                   <p id="index" class="tagname">{{item.tagName}}</p>
                   <div v-html="item.text"></div>
                </div>
            </div>
          </div>
           <!-- 项目类 -->
          <div class="right" v-if="![2,3,4,5,6].includes(baseInfo.categoryId)">
            <p class="recommandtit">推荐项目</p>
            <div class="recomitem" v-for="(item,index) in recommendList" :key="index">
              <img :src="cdnPath+item.imageUrl" @click="godetail(item.id)" />
              <p @click="godetail(item.id)">{{item.spuTitle}}</p>
              <div class="ask" @click="showQia">立即咨询</div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="property_no_data">
        <img src="@/assets/images/removed@2x.png" alt="" />
        <p class="remove">抱歉，该产品已下架！</p>
      </div>
      
    <!-- 认证提示 -->
    <el-dialog :visible.sync="AuthenticationDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
    <div v-if="AuthenticationDialog" class="del-box">
      <p class="del-title">认证提醒</p>
      <img v-if="mouseOver" @mouseover="mouseOver = false" src="~/assets/images/order/guanbi_icon_dark@2x.png" />
      <img v-else @mouseleave="mouseOver = true" src="~/assets/images/order/guanbi_icon@2x.png" @click="AuthenticationDialog = false" />
      <p class="cancel-content">由于您的身份未认证，暂时无法进行签约操作</p>
      <p class="cancel-tip">为了给您提供更好的服务，请尽快完成认证</p>
      <p></p>
      <div class="del-btn">
        <div class="cancel-del-btn confirm-del-btn" @click="AuthenticationDialog = false">放弃认证</div>
        <div class="cancel-del-btn" @click="goAuthentication">去认证</div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import carousel from '@/components/productdetails/carousel'
import { getInfo,getRightProduct,productList,getProductList,getClassifyList } from '@/api/productdetails'
import { getUserInfo } from '@/api/login'
import tools from '@/utils/priceDeal' 
import qs from 'qs'
export default {
    components:{ 
      carousel,
    },
    head(){
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
    async asyncData ({ query }){
      if(process.server){
        try {
          const res = await axios.get(process.env.ASYNC_DATA_API+'/product/spu/getInfo?spuId='+query.spuId)
        if(res){
          return {
            metatitle: res.data.data.baseInfo.seoTitle,
            metacontent: res.data.data.baseInfo.metaKey,
            metadescription: res.data.data.baseInfo.metaDetail
          }
        }else{
          return {
            hotProjectList: {},
            last: {},
            next: {},
            metaTitle: "",
            metaKeyword: "",
            metaDescription: "",
          };
        }
        }catch(error){
          console.log(error)
        }
      }
    },
    data() {
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
          productNum:1,
          recommendList:[],
          xunlu:process.env.SOFTWARE_URL,
          zhichan: process.env.PROPERTY_URL,
          activeTag: 0,
          treeList:[],
          loginStatus: false,
          AuthenticationDialog: false,
          fixed:false,
          areas:null,
          isDeleted:false,
          isZC: false
       }
    },
    filters:{
        filterViewprice(val){
            return tools.filterViewprice(val)
        },
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
        };
      }
    },
	  destroyed() {
      //离开该页面需要移除这个监听的事件
      window.removeEventListener("scroll", this.handleScroll,true);
    },
    mounted() {
      let spu = this.$route.query;
      localStorage.setItem('proInvite', spu.code)
      this.getDetails();
      if (this.$route.query.link) {
        sessionStorage.setItem('productLink',this.$route.path + '?' + qs.stringify(this.$route.query))
        console.log(this.$route.path + '?' + qs.stringify(this.$route.query))
      }
      this.getUserInfo();
      window.addEventListener("scroll", this.handleScroll,true);            
    },
    methods:{
      goAuthentication(){
        this.$router.push('/member/authentication');
      },
      toPay(){
        //没有规格属性
        if(this.choiceAttribute.noAttritube==true){
          return
        }
        if(this.loginStatus == true){
          if(this.$store.state.userInfo.userType != 0){
            let codeList = JSON.parse(sessionStorage.getItem('spuCode')) || [];
            let staffIdlist = codeList.filter( item =>{
              return item.spuId == this.$route.query.spuId
            })
            console.log(staffIdlist);
            this.$router.push({
              path:'/order/order-pay',
              query: Object.assign({
                spuId: this.$route.query.spuId,
                activeKey:this.activeKey,
                skuNum: this.productNum
              }, staffIdlist.length > 0 ? {
                code: staffIdlist[0].code
              }: {})
            })
          }else{
            this.AuthenticationDialog = true;
          };
        }else{
          this.$router.push({
            path: '/login'
          })
        };
      },
      getUserInfo() {
        getUserInfo().then((res) => {
          if (res.data.code == 0) {
            this.loginStatus = true;
          }else{
            this.loginStatus = false;
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
       //产品详情
       getDetails(){
         getInfo({spuId:this.$route.query.spuId}).then(res=>{
          if(res.data.code==0){
            let data = res.data.data
            this.baseInfo = data.baseInfo
            let arr = [1,7,8,9,10,11]
            this.isZC = arr.indexOf(this.baseInfo.categoryId) < 0 ? true : false
            console.log(this.isZC)
            this.isDeleted = this.baseInfo.status == 2
            this.detailInfoList = data.detailInfoList
            this.transactionList = data.tradeInfo.skuList
            this.activeKey = data.tradeInfo.skuList[0].skuIndex
            this.flag = data.tradeInfo.skuList.some(item=>item.skuIndex.indexOf('_')>-1) 
            let filterattributeList = data.tradeInfo.dynamicAttributeList.map(item=>({key:Object.keys(item)[0],value:Object.values(item)[0]})) 
            console.log(filterattributeList,'++++++++++++++++++++++++++');
            let recordArr = []
            let doublerecordArr = []
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
            //项目申报
            if(this.baseInfo.categoryId==1){
                this.filterShowArea();
                let para = this.fixFiler()
                this.getRightList(this.baseInfo.categoryId,para)
            }else if([7,8,9,10,11].includes(this.baseInfo.categoryId)){ //其他几类项目（除了知产）
               this.getRightList(this.baseInfo.categoryId,[])
            }
            //知产树
            if([2,3,4,5,6].includes(this.baseInfo.categoryId)){
              let param = {
                categoryId:2,
                generateAttributeList:[],
                pageSize:-1,
                status: '1'
              }
              //列表
              getProductList(param).then(res=>{
                let data = res.data.data.records
                let a  = data.filter(item=>item.categoryId==3)
                let b  = data.filter(item=>item.categoryId==4)
                let c  = data.filter(item=>item.categoryId==5)
                let d  = data.filter(item=>item.categoryId==6)
                // 类目
                productList({parentId:2}).then(res=>{
                    res.data.data.forEach(item=>{
                        if(item.id==3){
                            item.child = a
                        }
                        if(item.id==4){
                            item.child = b
                        }
                        if(item.id==5){
                            item.child = c
                        }
                          if(item.id==6){
                            item.child = d
                        }
                    })
                     res.data.data.forEach(element=>{
                        if(element.child.length){
                            element.child.forEach(child=>{
                                this.$set(element,'show',false)
                            })
                        }
                    })
                    res.data.data.forEach(element=>{
                        if(element.child.length){
                            element.child.forEach(child=>{
                                if(child.id==this.$route.query.spuId){
                                    this.$set(element,'show',true)
                                }
                            })
                        }
                    })
                    this.treeList = res.data.data
                    console.log(this.treeList)
               })
              })
            }
          }else{
              this.$message({
                  message:res.data.msg,
                  type:'error',
                  offset:300
              })
          }
        })
       },
      //过滤地区
      filterShowArea(){
          // this.areas = '';
          // let areas = [];
          let aItem = this.baseInfo.generateAttributeList.find(item=>item.attributeName == '地区');
          this.areas = aItem.attributeValueDesc
          // areas[0] = Number(aItem.attributeValueDesc)
          // areas[1] = Number(aItem.attributeValue)
          // tools.filterArea(areas).then(res => {
          //     this.areas = res;
          // })
      },
       //右侧推荐
       getRightList(categoryId,list){
        let url = categoryId == 1? getRightProduct : getProductList
           let param = {
              categoryId,
              id: Number(this.$route.query.spuId),
              generateAttributeList: list
           }
          if(categoryId != 1){
            this.$set(param,'pageNo',1);
            this.$set(param,'pageSize',6);
          }
          url(param).then(res=>{
              if(res.data.code==0){
                this.recommendList = res.data.data.records
              }
          })
       },
       //切换规格
       handleClick(attributeList,parentIndex,childIndex){
            if(parentIndex==0){
              if(this.flag){
                this.activeKey =  childIndex +'_'+ this.activeKey.substr(2) 
              }else{
                this.activeKey =  String(childIndex) 
              }
            }else{
              this.activeKey =  this.activeKey.substr(0,1) +'_'+ childIndex
            }
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
       //导航
       goNav(first,second){
           if(first==0){
               this.$router.push('/')
           }else{
              let url 
              switch(second){
                  case 1:
                      url = '/project'
                      break
                  case 7:
                      url = '/businessService'
                      break
                  case 8:
                      url = '/fiscalTax'
                      break
                  case 9:
                      url = '/financingListing'
                      break
                  case 10:
                      url = '/legalService'
                      break
                  case 11:
                      url = this.xunlu
                      break
                  default:
                      url = this.zhichan 
                      break
              }
              window.open(url)
           }
       },
       //跳转详情
		godetail(spuId){
			const path = this.$router.resolve({
			path:'/productdetails/details',
			query:{
				spuId:spuId
			}
			})
			window.open(path.href)
		},
       //树操作
		handletreeClick(item){
			if(item.child.length==0){
				return
			}
			this.treeList.forEach(element=>{
				if(element.categoryCode==item.categoryCode){
				if(element.show){
					this.$set(element,'show',false)
				}else{
					this.$set(element,'show',true)
				}
				}
			})
			console.log(this.treeList)
		},
       //滚动定位
		handleTagClick(index){
			this.activeTag = index
			this.$nextTick(()=>{
				window.scrollTo({
					behavior: "smooth",
					top: document.getElementById('html-'+index).offsetTop-130
				})
			})
		},
		showQia() {
			window.open('https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2','','height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no') 
		},
    handleScroll() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 640) {
          this.fixed = true;
      } else {
          this.fixed = false;
      }
    },
  }

}
</script>
<style lang="stylus" scoped>
@import './details.stylus'
.span-sty{
  margin-right: 0px !important;
}
</style>