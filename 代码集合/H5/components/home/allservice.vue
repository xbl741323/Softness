<template>
    <div class="allservice" :style="{minHeight:`${clientHeight}px`}">
        <!-- tab头部 -->
        <div :class="['flex',fixed==true?'fixedtop':'']">
          <div :class="['servicetitle',activeIndex==index?'activeword':'']" v-for="(ele,index) in titleList" :key="index" @click="handleTab(ele,index)">
              {{ele.categoryName}} <span :class="['active',fixed==true?'mt':'']" v-if="activeIndex==index"></span>
           </div>  
        </div>
        <!-- 主体部分 -->
        <div class="maincontent" v-infinite-scroll="load" infinite-scroll-distance="10"  infinite-scroll-disabled="disabled">
            <!-- 知识产权 -->
            <!-- <template v-if="activeIndex==0">
                <div class="product-left">
                    <item :list="listLeft" :type="1" />
                </div>
                <div class="product-right">
                    <item :list="listRight" :type="1" />
                </div>
            </template> -->
            <!-- 项目申报 -->
            <template>
               <div :class="['element',(index+1)%2==0?'':'']" v-for="(ele,index) in listAll" :key="index" @click="godetail(ele)">
                
                <template>
                        <img class="productImg" :src='imgPath+ele.imageUrl' v-if="ele.imageUrl&&(ele.imageUrl.split('.')[1]=='jpeg' || ele.imageUrl.split('.')[1]=='png' ||ele.imageUrl.split('.')[1]=='jpg' ||ele.imageUrl.split('.')[1]=='gif')" />
                        <video class="productImg" :src='imgPath+ele.imageUrl' v-if="ele.imageUrl &&(ele.imageUrl.split('.')[1]=='mp4' || ele.imageUrl.split('.')[1]=='avi' ||ele.imageUrl.split('.')[1]=='mov')" />
                </template>
                <div class="des">
                    <div class="producttitle">{{ele.spuTitle}}</div>
                    <div class="productinfo">{{ele.spuSlogan}}</div>
                    <div class="price">
                        <template v-if="ele.isOnline">
                            <div v-if="ele.spuMinAmount==ele.spuMaxAmount"><span class="maxproject">￥{{ele.spuMinAmount | filterPrice}}</span></div>
                            <div v-if="ele.spuMinAmount!=ele.spuMaxAmount">
                                <span class="maxproject" v-if="ele.spuMinAmount/1!=0">￥{{ele.spuMinAmount | filterPrice}}</span>
                                <span class="maxproject" v-else>￥{{ele.spuMaxAmount | filterPrice}}</span>
                                <span class="since-txt" v-if="ele.spuMinAmount/1!=0">起</span>
                            </div>
                        </template> 
                        <template v-else>
                            <span class="maxproject">面议</span>  
                        </template>
                     </div>
                </div>
              </div>
            </template>
            <!-- 新产品 -->
            <!-- <template v-if="[2,3,4,5,6].includes(activeIndex)">
               <div :class="['element',(index+1)%2==0?'':'mr']" v-for="(ele,index) in list" :key="index" @click="godetail(ele,2)">
                <img class="productImg" v-if="!ele.spUrl" :src="imgPath+ele.url" alt />
                <img class="productImg" v-else :src="imgPath+ele.spUrl" alt />
                <div class="des">
                    <div class="producttitle">{{ele.name}}</div>
                     <div class="productinfo">{{ele.slogan}}</div>
                      <div class="price">
                          <span>面议</span>
                      </div>
                </div>
              </div>
            </template> -->
             <p v-if="loading" class="tip">加载中...</p>
             <p v-if="noMore" class="tip">没有更多了</p>
        </div>
    </div>
</template>
<script>
import { getListPage,getOtherList,getNewProject } from "~/api/allserver"
import { getTree } from "@/api/allserver"
import { pageGlobalSpu } from "@/api/search";
import item from "./product/propertyItem"
export default {
    components:{
        item
    },
  data(){
    return {
        imgPath: process.env.CDN_BASE_URL,
        titleList:['知识产权','项目申报','工商注册','财税服务','融资上市','法律服务','软件开发'],        
        activeIndex:0,
        list:[],
        categoryIdList:[],
        listAll:[],
        listLeft:[],
        listRight:[],
        listTotal:0,
        moreflag:false,
        loading:false,
        localAreaNo:'',
        fixed:false,
        clientHeight:0,
        pageNo: 1,
        pageSize: 20,
    };
  },
  filters:{
      filterPrice(val){
        if((val/1).toString().length<=5){
            return (val/1)
        }else{
            return (((val/1)/10000)+'万')
        }
      }
  },
  computed: {
    noMore () {
        return this.moreflag
    },
    disabled () {
        return this.loading || this.noMore
    },
    getLocationState () {
        return this.$store.state.areaNo
    }
  },
  watch: {
      getLocationState(val) {
          if(this.activeIndex==1&&this.categoryIdList.length>0){
             this.getList();
          }
      }
   },
  mounted(){
    this.clientHeight = document.documentElement.clientHeight  
    if (sessionStorage.getItem("localAreaNo")) {
        this.localAreaNo = sessionStorage.getItem("localAreaNo")
    }
    this.getSlide()
    window.addEventListener("scroll", this.handleScroll,true)
  },
  methods:{  
    handleScroll() {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        this.fixed = scrollTop>800?true:false
    },
    // 触底加载
    load() {
        if(this.categoryIdList.length>0&&this.pageNo*this.pageSize<this.listTotal){
            this.pageNo++
            this.getList()
        }
    },
    splitArray(data){
        data.forEach((x,i)=>{
            if(i % 2 == 0) {
                this.listLeft.push(x)
            } else {
                this.listRight.push(x)
            } ;
        });
    },
    getSlide(){
        getTree({'parentId':0}).then(res=>{
            if(res.code==0){
              this.titleList = res.data;
              this.categoryIdList = res.data[0].child.length>0?res.data[0].child.map(obj => {return obj.id}):[res.data[0].id]
                this.getList()
            }
        })
        
    },
    handleTab(item,index){
        this.activeIndex = index
        this.loading = false
        this.moreflag = false
        this.pageNo = 1
        this.listAll = [];
        if(item.child.length>0){
            this.categoryIdList = item.child.map(obj => {return obj.id})
            this.getList()
        } else {
            this.categoryIdList = [item.id]
            this.getList()
        }
        this.$emit('scrollView')
    },
    getList(){
        // this.loading = true        
        let param = {
            categoryIdList: this.categoryIdList,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
        }
        pageGlobalSpu(param).then(res=>{
          if(res.code==0){
              this.listAll = [...this.listAll, ...res.data.records];
              this.listTotal = res.data.total;
          } else {
            console.log(res);
          }
        })  
    },
    godetail(item) {
        this.$router.push({
            path: "/productdetails/details",
            query: {spuId:item.id}
        })
    },
    showMeiqia() {
      var _53 = $53.createApi();
      _53.push("cmd", "mtalk"); 
      _53.query();
    },
  },
   destroyed(){
       window.removeEventListener("scroll", this.handleScroll,true)
  }
}
</script>
<style  scoped>
.fixedtop{
    width: 100%;
    height: 44px;
    background: var(--color-white);
    position: fixed;
    top: 1.6rem;
    left: 0;
    right: 0;
    z-index: 998;
    line-height: 35px;
    margin: 0 !important;
}
.flex{
    display:  flex;
    overflow-x: scroll;
    padding:  0 var(--size-12);
    margin: var(--size-12) 0;
}
.servicetitle{
    font-size: var(--size-14);
    font-weight: 400;
    color: #999;
    white-space: nowrap;
    margin-right: var(--size-16);
    position: relative;
    line-height: 1.173333333rem;
}
.active{
    display: inline-block;
    position: absolute;
    left: 40%;
    bottom: 0;
    width: var(--size-14);
    height: 5px;
    opacity: 0.9;
    background: #2065F4;
    border-radius: 3px;
}
.mt{
    bottom: 0;
}
.maincontent{
    padding:0 0.32rem 1.28rem .32rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.product-left, .product-right{
    width: 48%;
}
.element{
    width: 48.5%;
    height: 210px;
    margin-bottom: 12px;
    border-radius: 10px;
    background: #ffffff;
}
.mr{
    margin-right: 0.26666666666666666rem;
}
.productImg{
    width: 100%;
    height: 121px;
    border-top-left-radius: var(--size-12);
    border-top-right-radius: var(--size-12);
}
.des{
    padding:8px 12px 12px 12px;
}
.producttitle{
    font-size: 14px;
    font-weight: 700;
    color: #333333;
    max-width: 145px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.productinfo{
    font-size: 12px;
    color: #999999;
    margin: 7px 0 7px 0;
    max-width: 145px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.price{
    color: #FA7A42;
    font-weight: 700;
    font-size: 17px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.small{
    font-size: 12px;
}
.tip{
    text-align: center;
    width: 100%;
    color: #999;
    margin-bottom: 6px;
}
.huaxian{
    font-size: 10px;
    color: #c5c5c5;
    text-decoration:  line-through;
    margin-left: 4.5px;
    display: inline-block;
}
.maxproject{
    max-width: 140px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.since-txt{
    font-size: var(--size-12);
    font-weight: 500;
}
.activeword{
    color: #333333;
    font-weight: 700;
    font-size: var(--size-16);
}
</style>
