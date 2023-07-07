<template>
  <client-only>
    <div class="newproduct">
        <div class="header">
            <img :src="require('@/assets/images/classification/lack@2x.png')" @click="prev" class="navimg" alt /> 
            <span class="navtitle">{{type | filterName}}详情</span>
        </div>
        <div class="wrapper" v-if="projectdetail.coverUrls && projectdetail.coverUrls.length">
            <swiper :options="swiperOption">
                <swiper-slide v-for="(item,index) in projectdetail.coverUrls" :key="index">
                    <video class="swiperImg" v-if="item.spUrl" :poster="imgUrl + item.spUrl" :src="imgUrl + item.url" controls="controls"></video>
                    <img class="swiperImg" v-else :src="imgUrl + item.url"  />
                </swiper-slide>
                <div v-if="projectdetail.coverUrls.length!=1" class="swiper-pagination" slot="pagination"></div>
            </swiper> 
        </div>
        <div class="infocontent">
            <!-- 头部信息 -->
            <div class="metaInfo">
                <p class="title">{{projectdetail.name}}</p>
                <p class="solo">{{projectdetail.slogan}}</p>
                <div class="wordflex">
                   <div :class="['itemword',index!=3?'itemmr':'']" v-for="(item,index) in wordList" :key="index">{{item}}</div>
                </div>
                <div class="advantage">
                  <div :class="['aditem',index!=0?'adml':'']" v-for="(item,index) in advantageList" :key="item.title">
                      <img class="adimg" :src="item.img" />
                      <span class="adtitle">{{item.title}}</span>
                  </div>
                </div>
            </div>
             <!-- 固定tab --> 
            <div class="positonfixed" v-show="fixed">
                <div v-for="(item,index) in projectdetail.richContent" :key="index" @click="handleClick(index)" class="fixflex">
                  <div class="fixtitle">
                    <span class="fixlogo" v-if="index==activeTab"></span>
                    <span class="fixword" v-if="item.label.length<=6">{{item.label}}</span>
                    <span class="fixword" v-else>{{item.label.substring(0,6)}}...</span>
                  </div>
                </div>
            </div>
            <!-- 富文本 -->
            <div class="richcontent">
                <div v-for="(item,index) in projectdetail.richContent" :key="index">
                    <div class="richtitle">
                        <span class="richlogo"></span>
                        <span class="richword">{{item.label}}</span>
                   </div>
                    <div :id="index" class="desc_main" v-html="item.content"></div>  
                </div>
            </div>
            <div class="btns">
                <div class="addbtn plus"  v-if="iscollect!=0" @click="addCollect(1)">+ 加入收藏</div>
                <div class="addbtn" v-else  @click="addCollect(2)"><i class="el-icon-check" style="margin-right:4px;"></i> 收藏成功</div>
                <div class="askbtn" @click="showMeiqia">立即咨询</div>
            </div>
        </div>
    </div>
 </client-only>
</template>
<script>
import { Toast, MessageBox, Popup, Field } from "mint-ui";
import { addColl,cancelCollect } from '@/api/collect'
import { getCommonDetail } from "@/api/common-service"
import axios from "axios"
export default {
 head() {
    return {
      title: this.serverInfo.metaTitle,
      meta: [
        { name: "keywords", content: this.serverInfo.metaKeyword },
        {
          hid: "description",
          name: "description",
          content: this.serverInfo.metaDescription,
        },
      ]
    }
  },
 async asyncData({ query }) {
    let url = ""
    let length = query.type.length
    let id = query.type.substr(1,length - 1)
    switch (Number(query.type.substr(0,1))) {
        case 1:
            url = '/pagehome/gsdetails/' + id
            break;
        case 2:
            url = '/pagehome/rzdetails/' + id
            break;
        case 3:
            url = '/pagehome/fldetails/' + id
            break;
        case 4:
            url = '/pagehome/csdetails/' + id
            break;
        case 6:
            url = '/pagehome/getSoftwareDevDetail/' + id
            break;
     }
    const res = await axios.get(
      process.env.ASYNC_DATA_API + url
    )
    if (res&&res.data&&res.data.data) {
      return {
        serverInfo: res.data.data
      };
    }
  },
  data(){
    return {
        iscollect:null,
        imgUrl: process.env.CDN_BASE_URL,
        type:'',
        id:'',
        projectdetail:{},
        swiperOption: {
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            loop: false,
            observer: true,
            observeParents: true,
       },
      wordList:['快速响应','专业代理','品质服务','无忧售后'],
      advantageList:[
          {title:'全程监督',img:require('@/assets/images/common-service/jd_icon@2x.png')},
          {title:'保障权益',img:require('@/assets/images/common-service/qy_icon@2x.png')},
          {title:'多年经验',img:require('@/assets/images/common-service/jy_icon@2x.png')}
      ],
      fixed:false,
      activeTab:0
    }
  },
  filters:{
    filterName(val){
      return val == 1?'工商注册':val == 2?'融资上市':val == 3?'法律服务':val == 4?'财税服务':'软件开发'
    },
  },
  mounted(){
    if(this.$route.query.type){
      let val = this.$route.query.type
      let length = val.length
      this.type = val.substr(0,1)
      this.id = val.substr(1,length - 1)
      this.getDetail()
    }
    window.addEventListener("scroll", this.handleScroll,true);
  },
  methods:{
    addCollect(type){
       if(!localStorage.getItem('userInfo')){
            this.$router.push({
                path: '/login'
            })
            return
       }
        let  projectType //前后端工商注册等的对应
        if (this.type==1) {
            projectType=2
        }else if (this.type==2) {
            projectType=4
        }else if (this.type==3) {
            projectType=5
        }else if (this.type==4) {
            projectType=3
        }else{
            projectType = 6 
        }
       if(type==1){
        let param = {
            accountId:JSON.parse(localStorage.getItem('userInfo')).userId,
            number:this.projectdetail.number,
            type: projectType
        }
        addColl(param).then(res=>{
            if(res.code == 0){
                Toast({
                    message: "收藏成功！",
                    position: "middle",
                    duration: 5000,
                });
                this.getDetail()
            }
        })
       }else{
        let param = {
            accountId:JSON.parse(localStorage.getItem('userInfo')).userId,
            numbers:[this.projectdetail.number]
        }
        cancelCollect(param).then(res=>{
            if(res.code == 0){
                Toast({
                    message: "取消收藏成功！",
                    position: "middle",
                    duration: 5000,
                });
                this.getDetail()
            }
        })
       }

    },  
    getDetail(){
        getCommonDetail(this.type,this.id).then(res=>{
           this.projectdetail = res.data
           this.iscollect = res.data.isCollect
           let richContent = []
           if(res.data.labelOneName){
               richContent.push({label:res.data.labelOneName,content:res.data.labelOneContent})
           }
           if(res.data.labelTwoName){
               richContent.push({label:res.data.labelTwoName,content:res.data.labelTwoContent})
           }
           if(res.data.labelThreeName){
               richContent.push({label:res.data.labelThreeName,content:res.data.labelThreeContent})
           }
             if(res.data.labelFourName){
               richContent.push({label:res.data.labelFourName,content:res.data.labelFourContent})
           }
           res.data.richContent = richContent
        })
    },
    prev(){
        this.$router.go(-1)
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
    handleClick(val){
        this.activeTab = val
        let el = document.getElementById(val);
        this.$nextTick(()=>{
            window.scrollTo({
                behavior: "smooth",
                top: el.offsetTop+150
            });
        })
    }
  },
  destroyed(){
       window.removeEventListener("scroll", this.handleScroll,true)
  }

}
</script>
<style lang="stylus" scoped>
.newproduct{
    background: #eff2f3;
    min-height: 100vh;
}
.header{
    width: 100%;
    height: 44px;
    line-height:44px;
    background: #ffffff;
    display:flex;
    align-items: center;
    justify-content: center;
    position :relative;
}
.navimg{
    width:24px;
    height: 24px;
    position: absolute;
    left: 2px;
}
.navtitle{
    font-weight: 500;
    font-size: 18px;
    color: #333333;
}
.wrapper {
  width: 100%;
  height: 5.866666666666666rem;
  overflow: hidden;
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
.swiperImg{
    width:100%;
    height:100%;
}
.infocontent{
    padding:0 12px 12px 12px;
    margin:-10px 0 60px 0;
    position: relative;
    z-index: 999;
}
.metaInfo{
    width: 100%;
    height: 148px;
    background: #ffffff;
    border-radius: 10px;
    padding: 12px;
}
.title{
    font-size: 16px;
    font-weight: 700;
    color: #333333;
    margin-bottom:8px;
    max-width: 305px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.solo{
    font-size: 12px;
    color: #666666;
    max-width: 305px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.wordflex{
    display:flex;
    margin-top:12px;
}
.itemword{
    flex:1;
    background: #fff0E5;
    border-radius: 5px;
    font-size: 12px;
    color: #ff6900;
    height: 28px;
    line-height:28px;
    text-align:center;
}
.itemmr{
    margin-right:10px;
}
.advantage{
    display:flex;
    margin-top:18px;
    padding: 0 12px;
}
.aditem{
    flex:1;
    display: flex;
    align-items: center;
}
.adml{
    margin-left:42.5px;
}
.adtitle{
    font-size: 12px;
    color: #333333;
}
.adimg{
    width:16px;
    height:16px;
    margin-right:6px;
}
.btns{
    width: 100%;
    height: 65px;
    background: #ffffff;
    box-shadow: -3px -3px 4px 0px rgba(0,0,0,0.03); 
    position:fixed;
    left:0;
    right:0;
    bottom:0;
    padding:15px;
    display:flex;
}
.addbtn{
    flex:1;
    height: 100%;
    font-size: 14px;
    background: #ffb226;
    border-radius: 17px;
    margin-right:16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
}
.askbtn{
    height: 100%;
    font-size: 14px;
    background: #36a6fe;
    border-radius: 17px;
    flex:1;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
}
.richcontent{
   background: #ffffff;
   border-radius: 10px;
   padding:10px 0;
   margin-top:10px;
}
.richtitle{
    display:flex;
    align-items: center;
}
.richlogo{
    width: 4px;
    height: 16px;
    background: #36a6fe;
    border-radius: 0px 4px 4px 0px;
    display: inline-block;
    margin-right:8px; 
}
.richword{
    color: #333333;
    font-size: 16px;
    font-weight: 700;
}
.desc_main{
    padding: 0 6px;
    margin-top:16px;
    width:100%;
    overflow-x:scroll; 
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
.positonfixed{
    position:fixed;
    top:0;
    left:0;
    right:0;
    height: 44px;
    background: #fff;
    display:flex;
    width:100%;
}
.fixflex{
    flex:1;
    text-align: center;
    line-height: 44px;
}
.fixtitle{
    position:relative;
}
.fixlogo{
    width: 16px;
    height: 2px;
    background: #36a6fe;
    display: inline-block;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
}
.plus{
    background: #fff;
    border: 1px solid #ffc426;
    color: #ffc426;
}
</style>
