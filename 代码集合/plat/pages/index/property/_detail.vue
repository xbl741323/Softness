<template>
    <div class="content">
        <!-- 导航栏 -->
        <div class="content_con">
            <div class="title">
                <a @click="toHome">首页</a> >
                <a @click="toZcHome">知识服务</a> >
                <a href="" class="active_a">实用新型专利申请</a>
            </div>

            <div class="box">
                <!-- 左侧导航栏 -->
                <div :class="[fixed==true?'position-fixed':'','tree-menu']">
                    <div v-for="(item,index) in leftMenu" :key="index">
                       <div class="level">
                            <div class="level_a" @click="showToggle(item,index)">
                                <h3 :class="[item.type == parentType?'title-active':'']">{{ item.title}}</h3>
                                <span class="triangle"></span>
                            </div>
                       </div>
                       <ul v-show="item.isSubShow"> 
                            <li v-for="(child,idx) in item.children" :key="idx" @click="goDetail(child)">
                                <p :class="[child.id == productNo?'child-active':'']">{{child.name}}</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 右侧导航栏 -->
                 <div class="main" :class="[fixed==true?'right-box-fixed':'','main']">
                    <div class="top">
                        <div class="top-main">
                            <img :src='imgPath+detailData.coverUrl' >
                            <div class="top-box">
                                <div class="top-title">
                                    <h3>{{detailData.name}}</h3>
                                    <span>{{detailData.slogan}}</span>
                                </div>
                                <button @click="showQia()">立即咨询</button>
                            </div>
                        </div>
                    </div>
                    <div class="main-content">
                        <ul :class="[fixed==true?'right-fixed':'']">
                          <li  v-for="(d, i) in tab" :key="i" @click="changeTab(d)" :class="[d.id == activeId?'choosed':'']">
                            <div>{{ d.name }}</div>
                          </li>
                        </ul>                        
                    </div>
                    <div v-for="(d, i) in tab" :key="i" class="content-box">
                      <div v-html="d.content" :id="d.id"></div>
                    </div>      
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { getPropertyList, getPropertyDetail } from '@/api/property'
export default {    
    head () {
        return {
           title: this.metaTitle,
            meta: [
                { name: 'keywords',content: this.metaKeywords},
                { hid: 'description', name:'description', content:this.metaDesc }
            ]
        }
    },
    async asyncData({params}){
        if(process.server){
            try {
              let number = params.detail.substr(0,params.detail.length-1);
            const res = await axios.get(process.env.ASYNC_DATA_API+'/property/detail?id='+number);
            console.log(res.data.data)
            if(!res.data || !res.data.data){
                return{
                    metaTitle: '',
                    metaKeywords: '',
                    metaDesc: ''
                }
            }else {
                return {
                    metaTitle: res.data.data.metaTitle,
                    metaKeywords :res.data.data.metaKeywords,
                    metaDesc :res.data.data.metaDesc
                }
            }
            }catch(error){
              console.log(error)
            }
        }
    },
    data(){
        return{
            imgPath:process.env.CDN_BASE_URL,
            webUrl:process.env.PC_URL,
            tab: [],
            fixed:false,
            detailData:{},
            leftMenu:[],
            productNo:'',
            parentType:'',
            activeId: '',
            bannerUrl:'',
        }
    },
    created(){
        this.productNo = this.$route.params.detail.substr(0,this.$route.params.detail.length-1);
        this.parentType =  this.$route.params.detail.substr(this.$route.params.detail.length-1,1);
    },
    methods:{
        goDetail(child){
             window.open('/'+child.id+child.type,'_self');            
        },
        // 展开选项
        showToggle(item,index){            
            item.isSubShow = !item.isSubShow;
        },
        //获取页面数据
        getData(){
            getPropertyList().then(res=>{                
                for(let i in res.data.data){
                    this.leftMenu.push(res.data.data[i])
                }
                this.leftMenu.forEach((item) => {
                    if(this.parentType==item.type){
                        this.$set(item, "isSubShow", true);
                    } else {
                        this.$set(item, "isSubShow", false);
                    }                    
                });                
            }).catch(err=>{
                return err;
            });
            getPropertyDetail({id: this.productNo}).then(res=>{
              console.log(res)
                this.detailData = res.data.data;
                this.tab = res.data.data.labelAndContent; //获取产品详情数据    
                this.tab.forEach((item,index) => {
                    this.$set(item, "id", 'id'+index);              
                });          
                this.activeId = this.tab[0].id
            }).catch(err=>{
                return err;
            });
        },
        changeTab(d) {
          this.activeId = d.id;
          var el = document.getElementById(this.activeId);
           this.$nextTick(() => {
                window.scrollTo({ behavior: "smooth",block: "center", top: el.offsetTop - 60 });
            });
        },  
        toHome(){
            window.open(this.webUrl,'_self')
        },  
        toZcHome(){
            this.$router.push('/')
        }, 
        showQia() {
            window.open('https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2','','height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no')
        },
        showSearch() {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop  > 450) {   // 当页面滚动到高度300px处，动态绑定class 来设置头部固定定位
              this.fixed = true;
            }else {
              this.fixed = false;
            }
        },
    },
    mounted() {
        this.getData();
        window.addEventListener("scroll", this.showSearch)
    },
}
</script>

<style scoped>
ul{
    list-style:none;
}
.content{
    padding:26px;
    background: #F5F5F5;
}
.content_con{
    width: 1200px;
    margin: 0 auto;
}
.title{
    font-size: 16px;
    text-align: left;
    margin-bottom: 39px;
    line-height: 24px;
}
.title a{
    font-size: 16px;
    font-weight: 400;
    color: #828282;
    text-decoration:none;
}
.title .active_a{
    color: #36A6FE;
}
/* .title-active{
    color: #36A6FE;
} */
.child-active{
    color: #36A6FE;
}
.box {
  display: flex;
  flex-direction: row;
}
.tree-menu {
  width: 220px;
  max-width: 220px;
  min-width: 220px;
  margin-right: 20px;
  height: 840px;
  overflow-y: scroll; 
  overflow-x: hidden;
}
.level {
  cursor: pointer;
  height: 36px;
  line-height: 36px;
  background-color: #3D85DC;
  color: #fff;
  border-bottom: 1px solid #fff;
  font-size: 14px;
  font-weight: 400;
}
.level_a{
  display: flex;
  align-items: center;
  justify-content: center;
}
.triangle {
  width:0px;  
  height:0px;  
  border:5px solid transparent;
  border-top:5px solid #fff;
  margin-left: 20px;
  transform-origin: 4px 4px;
  transition: transform 0.3s;
}
.tree-menu ul{
  cursor: pointer;
  text-align: left;
  padding: 0;
  line-height: 34px;
  color: #666666;
  background-color: #FFFFFF;
}
.tree-menu ul li{
    height: 34px;
    padding-left:24px;
    margin: 2px 0;
    border-bottom: 1px solid #f5f5f5;
}
.tree-menu ul li p{
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
}
.box {
  display: flex;
  flex-direction: row;
  position: relative;
}
.main {
  width: 960px;
}
.top {
  width: 100%;
  height: 180px;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}
.top-main {
  background-color: #EEF0F2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 25px;
  box-sizing: border-box;
}
.top-main img {
  width: 110px;
  height: 110px;
  margin-right: 40px;
}
.top-box {
  height: 100px;
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.top-box button {
  outline: none;
  width: 120px;
  height: 30px;
  background: #36A6FE;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.top-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.top-title h3 {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
}
.top-title span {
  font-size: 14px;
  color: #A1A1A1;
  margin-left: 12px;
}
.main-content {
  width: 100%;
  background-color: #fff;
  text-align: center;
  margin-top: 20px;
}
.main-content ul {
  display: flex;
  border-bottom: 1px solid #e9e9e9;
}
.main-content ul li {
  cursor: pointer;
  font-size: 16px;
  color: #666666;
  height: 49px;
  line-height: 49px;
  margin: 0 20px;
  flex: 1;
}
.choosed {
  color: #36A6FE !important;
  border-bottom: 2px solid #36A6FE;
}
.main-box {
  height: 300px;
}
.item-html{
  height: 500px;
  color: #333333;
  font-size: 20px;
  font-weight: bold;
}
.content-box{
  background-color: #ffffff;
  text-align: center;
  padding-top: 20px;
}
.position-fixed{
  position: fixed;
  height: 560px;
  top: 46px;
  margin-top: 0 !important;
  
}
.tree-menu::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.right-box-fixed{
  margin-left: 240px;
}
.right-fixed{
  position: fixed;
  top: 46px;
  width: 960px;
  background: #fff;
  box-shadow: 0 4px 20px 0 rgba(61,79,127,.1);
}
</style>