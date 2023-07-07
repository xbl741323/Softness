<template>
    <div class="frame">
        <div class="head">
            <div class="location">
                <div class="choose">
                    <client-only>
                        <div class="icon-sty"><i class="iconfont" style="color:red" >&#xe627;</i>{{location}}</div>
                        <el-popover
                            placement="bottom"
                            trigger="manual"
                            v-model="visible"
                        >
                            <div class="province">
                                <div class="province-box">
                                    <newarea class="province-flex" :placeholder="'请选择省份城市'" v-model="areaArr"
                                        @change="(v) => changeAddress(v)" @changeLocation="getLocal">                                                    
                                    </newarea>
                                </div>
                            </div>
                            <p  class="change-city"  slot="reference" @click="showDialog()">[{{$t('txt.switch')}}]</p>
                        </el-popover>
                    </client-only>
                </div>
               <el-popover trigger="hover">
                    <img src="~assets/images/home/code01_home@2x.png" />
                    <span slot="reference" :class="['pppppyiya',fixed==true?'rrrrabc':'']">{{$t('txt.publicAccount')}}</span>
                </el-popover>
                 <div style="display:flex;" v-show="fixed">
                    <input class="newinput"  v-model="searchContent" :placeholder="searchList[0]"  @keydown.enter="search()"/>
                    <div class="newsearch" @click="search()"><img class="searchclass" src="~assets/images/home/icon_serch_home@2x.png" /></div>
                </div>
                <div>
                    <span class="pad" @click="showQia()">{{$t('txt.wtCooperation')}}丨{{$t('txt.feedback')}}</span>
                    {{$t('txt.serviceHotline')}}：
                    <span class="wcolor">{{$t('txt.tel')}}</span>
                </div>
            </div>
        </div>
        <div class="cotn">
        <div class="tii">
            <div class="mtt">
            <img class="mti" @click="goHome()" :src="require('@/assets/images/'+this.imgs)" />
            </div>
            <div>
                <div class="midcon">
                    <div style="display:flex;">
                        <input class="search_input" v-model="searchContent" :placeholder="searchList[0]" @keydown.enter="search()"/>
                        <div class="search"><p style="line-height:33px;text-align:center;font-size:12px" @click="search()"> <img src="~/assets/images/home/icon_search_home.png" width="36" height="36"/></p></div>
                    </div>
                    <div style="display:flex;align-items: center;">
                        <span class="hot-search-span" v-if="this.searchList.length>0">{{$t('txt.hotSearch')}}：</span>
                        <div 
                            v-for="item in searchList" 
                            :key="item.id" 
                            class="hot-search"
                            @click="getSearchId(item)"
                            :class="[{searchStyle:searchId == item}]"
                        >
                            {{item}}
                        </div>
                    </div>
                </div>
            </div>
        
            <div class="toright" >
                <client-only>
                    <div class="popt">
                        <div class="cdc" v-if="!info">
                            <div class="woyao" @click="showQia()">我要咨询项目</div>
                        </div>
                        <div class="cdc" v-else>
                            <div class="woyao" @click="showQia()">我要咨询项目</div>
                        </div>
                    </div>
                </client-only>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import { getLocation,getProvince,getHotSearch} from '@/api/home'
import { banner,getProgram,getContent} from '@/api/home'
import {getUserInfo,logOut} from '@/api/login'
import { getNewArea } from '@/api/announcement'
import newarea from '@/components/search/newarea.vue'
import * as CodeMsg from "@/api/CodeChange"
export default {
    props:['searchData'],
    components:{
        newarea
    },
    data() {
        return {
            fixed:false,
            searchList:[],
            placeholderData:"",
            cdnPath:process.env.CDN_BASE_URL,
            provinceList:[],
            imgs: "home/wotao@2x.png",
            headImg: "home/icon_head_home@2x.png",
            address:'',
            searchContent: this.$store.state.searchTxt,
            searchId:'',
            ip:'',
            location:'',           
            identification:'',
            login:false,
            urlShow: false,
            queryType: null,
            sType:0,
            areaArr: [],
            areaList: [],
            visible: false
        }
    },
  methods: {
    showDialog(){
        this.visible = !this.visible
    },
    getLocal(value){
        this.location = value.city
        this.visible = false
    },
    changeProvince(data,areaNo){
        console.log(data,'454545')
        this.location = data;
        this.$store.commit('Set_LocationNo',areaNo);//定位地区编号
        sessionStorage.setItem('locationName',data);//定位地区名
        sessionStorage.setItem('locationNo',areaNo);
    },
    changeAddress(value) {
        //地址选择
        if(value.city!=''){
          let areaNo = Array.from(value.area).join(',')
          let city = ''
          if(value.city.lastIndexOf('市') > -1){
            city = value.city.substr(0, value.city.lastIndexOf('市'))
          }else{
            city = value.city
          }
          this.changeProvince(city, areaNo)
          this.visible = false
        }
    },
    logOut(){
        logOut().then(
            localStorage.removeItem('userInfo'),
            sessionStorage.clear(),
            location.href='/'
        )
    },
    toMember(loginStatus){
        this.$router.push({
            path:'/member'
        })
    },
    toUser(){
        this.$router.push({
            path:'/user'
        })
    },
    showQia() {
        window.open('https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2','','height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no')
    },
    changebackground(){
        document.querySelector('.choose').style.background = '#DBDBDB';
    },
    clearbackground(){
        document.querySelector('.choose').style.background = '';
    },
    getHotWords(){
        getHotSearch(5).then(res=>{
            this.searchList = res.data.data;
        })
    },
    search(){
        let type = this.$store.state.sType ? this.$store.state.sType : this.sType;
        if(this.searchContent==""){
            this.$store.commit('searchTxt',this.searchList[0])
            this.$router.push({
                path: "/search",
                query:{ 
                    keywords: this.searchList[0],
                    type: 1
                }
            })                
        }else{
            this.$store.commit('searchTxt',this.searchContent);               
            this.$router.push({
                path: "/search",
                query:{
                    keywords:this.searchContent,
                    type: 1 
                }
            })
        }
    },
    goHome(){
        this.searchContent = '';       
        this.$router.push({
            path:'/',
        })
    },
    getSearchId(data){
        let type = this.$store.state.sType ? this.$store.state.sType : this.sType;
        this.searchId = data;
        this.searchContent = data;
        this.$store.commit('searchTxt',this.searchContent);
        this.$router.push({
            path: "/search",
            query:{keywords: this.$store.state.searchTxt,type:1 }
        })   
    },
    getData() {
        getNewArea().then(res => {
            if(res.data.data.code == CodeMsg.CODE_0){
                res.data.data.data.forEach(item=>{
                    item.children.forEach(childItem=>{
                    delete childItem.children
                    })
                })
                this.areaList = res.data.data.data
            }
        }).catch(error => {
            console.log(error)
        })
        if(sessionStorage.getItem("locationName")){
            this.location = sessionStorage.getItem("locationName")
        }else{
            getLocation(this.identification).then(res=>{
                if(res.data.code != 1000){
                    this.location = '合肥'
                    this.$store.commit('Set_LocationNo','340000,340100');
                    sessionStorage.setItem('locationNo','340000,340100');
                    return false
                } 
                if(res.data.data.areaName == '局域网'){
                    this.location = '合肥';
                    this.$store.commit('Set_LocationNo','340000,340100');
                    sessionStorage.setItem('locationNo','340000,340100');
                    sessionStorage.setItem('locationName','合肥');
                    return false
                }
                if(res.data.data.cityNo){
                    let no = res.data.data.areaNo + ',' + res.data.data.cityNo
                    let cityName = res.data.data.city
                    cityName = cityName.lastIndexOf('市') ? cityName.slice(0, cityName.lastIndexOf('市')) : cityName
                    this.location = cityName;
                    console.log(cityName,'hdhdhdh1')
                    sessionStorage.setItem('locationNo', no);
                    sessionStorage.setItem('locationName', cityName);
                    this.$store.commit('Set_LocationNo', no);
                }else{
                    this.location = '合肥';
                    this.$store.commit('Set_LocationNo','340000,340100');
                    sessionStorage.setItem('locationNo','340000,340100');
                    sessionStorage.setItem('locationName','合肥');
                }
                if(res.data.data.identification){//定位返回信息
                    localStorage.setItem('identification',res.data.data.identification)
                }
            }).catch(err=>{
                return err;
            });
        }
    },
     handleScroll() {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > 380) {
                this.fixed = true;
            } else {
                this.fixed = false;
            }
     },
},
created(){
    let query = this.$route.query;
    if(query.keywords){
        this.searchContent = query.keywords;
        this.sType = query.type
    }
},
mounted(){
    if(localStorage.getItem('identification')){//定位信息
        this.identification = localStorage.getItem('identification');
    };
    this.getData();
    this.getHotWords();
    if(this.searchData){
        this.searchContent = this.searchData;
        this.search();
    }       
    window.addEventListener("scroll", this.handleScroll,true);
},
beforeDestroy(){
    window.removeEventListener("scroll", this.handleScroll,true);
},
computed:{
    searchTxt(){
        return this.$store.state.searchTxt;
    },
    info(){
        if(this.$store.state.userInfo && this.$store.state.userInfo.phone){
            return this.$store.state.userInfo;
        }else{
            return false;
        }
    }
},
watch:{
    // searchContent(val){
        // if(val.length==0){
        //     this.search();
        // }
    // },
    searchTxt(val){
        this.searchContent = val
        if(val==''){
            this.searchContent = ''
            // location.reload();//刷新页面清除state数据
        }
    }
}
};
</script>

<style scoped>
.midcon{
    width: 568px;
    position: relative;
    top: 11.5px;
    padding-bottom: 20px;
}
.popt{
    color:#767676;
    height:50px;
    margin:auto 0;
    display:flex;
}
.toright{
    float:right;
    display:flex;
    margin-left:114px;
    position: relative;
    top:9px;
}
.cdc{
    margin-left:18px;
    display:inline-block;
    line-height:40px;
}
.mtt{
    margin:7.5px 107px 5px 0;
}
.mti{
    width:222px;
    height:64px;
    cursor:pointer;
}
.tii{
    margin:-6.5px auto;
    display:flex
}
.cotn{
    width:1200px;
    margin:10px auto;
    background:#FFF;
    margin-top: 56px;
}
.wcolor{
    color:#666666;
    margin-right:10px;
    font-size: 14px;
    position: relative;
    top: 1px;
}
.pad{
    padding:0 0 0 10px;
    cursor:pointer;
    margin-right: 25px;
    font-size: 14px;
}
.searchclass{
    width:20px;
    height:20px;
    position: relative;
    left: -10px; 
    top: 3px;
}
.rrrrabc{
  left: -119.5px !important;
}
.pppppyiya{
    position: relative;
    cursor:pointer;
    left: -340px;
}
.newinput{
    width: 314px;
    height: 27.5px;
    margin: auto 0;
    border-radius: 20px;
    background: #EFEFEF;
    border: 1px solid #36A6FE;
    outline: none;
    padding-left: 15px;
    padding-right: 100px;
    font-size: 12px;
    overflow: hidden;
}
.newsearch{
    width: 60px;
    height: 27.5px;
    line-height: 27.5px;
    border-radius: 20px;
    border: 1px solid #36A6FE;
    background-color: #36A6FE;
    color: #fff;
    margin: auto 0 auto -60px;
    padding-left: 30px;
    display: flex;
}
.woyao{
    width: 200px;
    height: 45px;
    line-height: 45px;
    background: linear-gradient(136deg, #58B0F6 0%, #1592F5 100%);
    opacity: 1;
    border-radius: 30px;
    color: #FFFFFF;
    text-align: center;
    position: relative;
    top: -11px;
    left: -30px;
    font-size: 16px;
    cursor: pointer;
    letter-spacing: 1px;
}
.frame{
    font-size:14px;
}
.head{
    color:#767676;
    background: #f2f4f5;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1008;
}
.location{
    width:1200px;
    margin:0 auto;
    height:36px;
    display:flex;
    line-height:36px;
    justify-content: space-between;
}
.choose{
    display:flex;
    width: 125px;
}
.icon-sty{
    color:#333333;
    max-width:75px;
    text-overflow:ellipsis;
    overflow:hidden;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:1;
}
.change-city{
    color:#AFAFAFFF;
    font-size:12px;
    padding:0 10px 0 10px;
    cursor:pointer;
    position:relative;
    top: 1px;
}
.change-city:hover .province{
    display: block;
    background:#DBDBDB;
}
.province{
    width: 320px;
}
.province-box{
    /* display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
    text-align: center;
    line-height:30px; */
    height: 100px;
    margin: 10px 0 0 10px;
}
.province-name{
    min-width: 60px;
    padding:2px 5x;
    cursor:pointer;
    text-overflow:ellipsis;
    overflow:hidden;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:1;
}
.province-name:hover{
    color:#FFF;
    background:#36A6FE;
}
.headimg{
    cursor:pointer;
    border: 1px solid #666;
    margin-left:21px;
    border-radius: 50%;
    width:40px;
    height:40px;
}
.user-info{
    cursor:pointer;
    width:75px;
    line-height: 40px;
    margin-left:5px;
    margin-right: 5px;
    text-overflow:ellipsis;
    overflow:hidden;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:1;
}
.link{
    color:#666666;
    text-decoration:none;
    cursor:pointer;
}
.search{
    width: 100px;
    height:44px;
    border-radius:22px;
    border: 1px solid #36A6FE;
    background-color:#36A6FE;
    color:#FFF;
    font-size:14px;
    margin:auto 0;
    margin-left: -100px;
    padding-top:4px;
    cursor:pointer;
}
.search_input{
    width:100%;
    height:44px;
    border-radius:22px;
    border:1px solid #36A6FE;
    outline:one;
    padding-left:24px;
    padding-right:130px;
    overflow: hidden;
    margin:auto 0;
    font-size: 12px;
}

.hot-search{
    border-radius:40px;
    font-size:12px;
    height:20px;
    padding:15px 10px;
    text-align:center;
    line-height:1px;
    color: #36A6FE;
    cursor:pointer;
}
.searchStyle{
    background:#36A6FE;
    color:#FFF;
}
input:focus{
    outline:0;
    padding-left:15px;
}
.hot-search-span{
    width:70px;
    margin-left:25px;
    font-size:12px;
    color: #36A6FE;
}
.no-login{
    color: #36A6FE;
}
.userinfo-btn{
    font-size:14px;
    padding: 2px 4px;
    cursor: pointer;
}
.userinfo-btn:hover{
    background: #36A6FE;
    color: #FFF;
}
.account-info{
    text-align: right;
    margin-left:20px;
}
input::-webkit-input-placeholder{
 color:#999999;
}
</style>