<template>
    <div class="container"  style="background:#F7F8F9;">
        <banner :bannerList="bannerUrl" v-if="bannerUrl.length>0"></banner>
        <div :class="['content',bannerList.length>0?'':'no_banner_sty']">
            <div class="navigation">
                <nav-bar :navList="navList"></nav-bar>
            </div>
            <div style="padding-bottom:20px;position: relative;" ref="banner">
                <!-- 左边固定切换区 -->
                <div :class="['left',bannerTop<=110?'left-fixed':'']"  :style="styleBar">
                    <p :class="['left-title',checkedId==item.id?'checked':'']" @click="changeList(item.id,item.type)" v-for="(item,index) in bannerList" :key="index">
                    <span :class="[checkedId==item.id?'about_com_color':'']">{{item.name}}</span>
                    <span :class="[checkedId==item.id?'about_right_link':'']"></span>
                    </p>
                </div>
                <!-- 右边内容区域 -->
                <div class="right" :style="styleVar">
                    <!-- 图文 -->
                    <div v-if="type==0" style="padding:26px">
                        <p :class="['article-title',isDetail?'article-title-center':'']">{{article.title}}</p>
                        <p v-html="article.content"></p>
                    </div>
                    <!-- 列表 -->
                    <div v-else style="padding:26px 26px 80px">
                        <div v-for="(item,index) in articleList" :key="index" class="flex list-item" @click="toDetail(item.id)">
                            <div class="flex" style="justify-content:flex-start">
                                <div class="icon"></div>
                                <div>{{ item.title }}</div>
                            </div>
                            <div class="item-time">{{ item.createTime ? item.createTime.substring(0, 10) : "" }}</div>
                        </div>
                        <!-- 分页栏 -->
                        <div class="about_pages">
                            <el-pagination
                                background
                                hide-on-single-page
                                layout="prev, pager, next, jumper"
                                :current-page="current"
                                :page-size="size"
                                :total="total"
                                @current-change="handleCurrentChange"
                                />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import navBar from "@/components/common/nav-bar";
import { getBnner } from "@/api/notice";
import { getRightContent , getView } from "@/api/aboutWT.js";
import axios from "axios";
import * as CodeMsg from "@/utils/code";
import banner from "@/components/common/banner"
export default{
    components:{
        banner,
        navBar
    },
    // meta
    async asyncData({query}) {
     try {
      const   response=await axios.get(process.env.ASYNC_DATA_API + "/program");
        let bannerList=response.data.data
            // 右侧内容显示区
            if(query.detailId){//详情
                // 浏览量
                const num = await axios.get(process.env.ASYNC_DATA_API + "/program/add?id=" + query.detailId);
                const res = await axios.get(process.env.ASYNC_DATA_API + "/program/getById?id=" + query.detailId);
                return {
                    metaTitle: res.data.data.records[0].metaTitle,
                    metaKeyword: res.data.data.records[0].metaKeyword,
                    metaDescription: res.data.data.records[0].metaDescription,
                    checkedId:query.id,
                    article:res.data.data.records[0],
                    isDetail:true,
                    bannerList:bannerList,
                    type:0
                };
            }else{
                let checkedId='';
                let type='';
                if(!query.id){
                    checkedId=bannerList[0].id;
                    type=bannerList[0].type;
                }else{
                    checkedId=query.id;
                    type=query.type;
                }
                // 根据type类型判断,1列表,0图文详情
                if(type==1){
                    let item=bannerList.filter(item=>{
                        return item.id==checkedId
                    })
                    return {
                        metaTitle:"关于卧涛-" + item[0].name,
                        metaKeyword:"关于卧涛-" + item[0].name,
                        metaDescription:"关于卧涛-" + item[0].name,
                        type:1,
                        checkedId:checkedId,
                        bannerList:bannerList
                    }
                }else{
                    let ele = await axios.get(process.env.ASYNC_DATA_API + "/program/page?programId="+checkedId);
                    console.log(ele,"res")
                      // 浏览量
                    const num = await axios.get(process.env.ASYNC_DATA_API + "/program/add?id=" + ele.data.data.records[0].id);
                    return {
                        metaTitle: ele.data.data.records[0].metaTitle,
                        metaKeyword: ele.data.data.records[0].metaKeyword,
                        metaDescription: ele.data.data.records[0].metaDescription,
                        checkedId:query.id,
                        article:ele.data.data.records[0],
                        isDetail:false,
                        bannerList:bannerList,
                    };
                }
            }
     } catch (error) {
        redirect('/404')
     }
  },

    head() {
        return {
          title: "江苏卧涛-科技项目申报服务中心",
          meta: [
            { charset: "utf-8" },
            {
              name: "keywords",
              content: "江苏卧涛",
            },
            {
              hid: "description",
              name: "description",
              content: "江苏卧涛-科技项目申报服务中心，专业的代理服务，200人团队，代理导师团全员研究生学历，多年代理经验。品质服务，值得信赖！",
            },
      ],
    };
    },
   computed: {
        styleVar() {
            return {
                '--box-height': this.bannerHeight + 'px',
            }
        },
        styleBar() {
            return {
                '--banner-top': this.fixedTop + 'px',
            }
        }
    },
    data(){
        return{
            navList: ["首页", "关于卧涛"],
            bannerUrl: [],
            bannerList:[],
            articleList:[],
            current: 1,
            total: 0,
            size:15,
            isDetail:false,
            type:0,
            bannerHeight:'',//左边导航栏高度
            bannerTop:"" ,//内容区域顶部位置
            fixedTop:"",//左边导航栏定位的高度
        }
    },
    methods:{
        changeList(id,type){
            window.open("/aboutWT?id=" + id+"&type="+type, "_self");
        },
        handleCurrentChange(val) {
            this.current = val;
            this.getData();
        },
        toDetail(id){
            window.open("/aboutWT?id=" + this.checkedId+"&detailId="+id);
        },
        handleScroll(){
            this.bannerTop=this.$refs.banner.getBoundingClientRect().top;
            if(this.bannerTop<=110)  this.fixedTop=110-this.bannerTop - 40;
            console.log(this.bannerTop,111222)
        },
        getData(){
            console.log(this.type,"type")
            if(!this.$route.query.detailId){
                if(this.type==1){
                    let params = {
                        programId:this.checkedId,
                        current: this.current,
                        size:this.size
                    };
                    getRightContent(params).then(res=>{
                        this.articleList=res.data.records;
                        this.total=res.data.total
                    })

                }
            }
        },
        getBnnerList(){
          getBnner(2).then(res=>{
           if(res.code == CodeMsg.CODE_1000){
              this.bannerUrl = res.data
              console.log(this.bannerUrl)
            }
          })
        }
    },
    mounted(){
        window.addEventListener('scroll',this.handleScroll,true)
        this.getData()
        this.getBnnerList()
        // this.bannerHeight= this.$refs.banner.offsetHeight;
        console.log(this.bannerHeight,"banner")

    },
    destroyed() {
        //离开该页面需要移除这个监听的事件
        window.removeEventListener("scroll", this.handleScroll, true);
    }

}
</script>

<style scoped>
.navigation a{
    text-decoration: none;
    color:#999;
}
.content{
    width:62.5%;
    margin:0 auto
}
.navigation{
    height:40px;
    line-height:56px;
    font-size: 16px;
    font-weight: 600;
    margin-top: 20px;
}
.left{
    width:200px;
    padding:10px 0;
    background:#fff;
    border-radius:5px;
    font-weight:500;
    position:absolute;

}
.left-fixed{
    position:absolute;
    top:var(--banner-top);
}
.right{
    width:990px;
    margin-left:210px;
    background:#fff;
    border-radius:5px;
    min-height:750px;
}
.left-title{
    margin:24px 0px;
    padding-left:48px;
    font-size:16px;
    color:#666;
    cursor: pointer;
    border-left:4px solid #ffffff;
}
.left-title>span:nth-of-type(1){
    color: #666666;
    cursor: pointer;
    font-size: 16px;
}
.left-title>span:nth-of-type(2){
    display: inline-block;
    width: 10px;
    height: 10px;
    border-top: 1px solid #666666;
    border-right: 1px solid #666666;
    transform: rotate(45deg);
    cursor: pointer;
    margin-left: 20px;
}
.checked{
    border-left:4px solid #36A6FE;
    color:#36A6FE;
}
.article-title{
    font-size: 22px;
    font-weight: bold;
    color:#3D3E3E;
    padding-bottom:20px;
    border-bottom:0.5px solid rgba(206, 206, 206, .4);
    letter-spacing: 2px;
}
.article-title-center{
    text-align:center
}
.icon {
    width: 8px;
    height: 8px;
    margin-right:10px;
    background-color: #3f93d6;
    transform: rotate(45deg);
}
.list-item{
    justify-content: space-between;
    margin-bottom:16px;
    cursor: pointer;
}
.item-time{
    color:#666;
    font-size: 15px;
    opacity: .7;
}
.pages{
    position:absolute;
    bottom:30px;
    right:160px
}
.about_right_link{
    border-top: 1px solid #36A6FE !important;
    border-right: 1px solid #36A6FE !important;
}
.about_com_color{
    color: #36A6FE !important;
}
.no_banner_sty{
  margin-top: 120px;
}
.about_pages{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
}
</style>
