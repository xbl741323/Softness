<template>
    <div class="frame">
        <div class="head-box" :class="{'istipwid':iswid==true}">
            <ul class="navigation_ul">
                <div class="dropdown">
                    <span style="color:#FFF;" class="istop">服务分类</span>
                    <img class="service-img istop" src="~assets/images/home/icon08_leftlist_home@2x.png" />  
                    <div class="dropdown-content" :class="{otherPage:($route.path =='/')}">
                        <div class="drop_down">
                            <div v-for="(item,index) in serverList" :key="index">
                                 <div class="sertitle" @click="classPage(item,item.id)"><span class="cur">{{item.name}}</span><img class="rightimg cur" src="~/assets/images/index/ringht_icon@2x.png" /></div>
                                 <div class="sercontent">
                                     <span class="tent mr" v-for="(element,childIndex) in item.serviceOptionList" :key="childIndex" @click="classPage(element)">{{element.optionName}}</span>
                                 </div>
                                 <div class="heng" v-if="index+1<=serverList.length-1"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="navigation"  v-for="item in indexNav" :key="item.id" :class="[{activeTab:activeId == item.id}]" @click="getTab(item.id)">
                    <!-- 知产跳转 -->
                    <a v-if="item.id == '/property'" @click="zcJump()" class="property-style">{{item.name}}</a>
                    <p v-else class="tab" @click="$router.push({name: item.path}),getId(item.id)">{{item.name}}</p>
                    <div class="dropdown-navigation">
                        <div v-for="items in item.children" :key="items.id" class="drop_navigation" :class="[{activeStyle:active == items.id}]">
                            <a v-if="items.id == '/result' || items.id =='/need'" @click="jump(items.id)"  class="property-style">{{items.name}}</a>
                            <a class="property-style" @click="$router.push({name: items.path}),getId(items.id)" v-else>{{items.name}}</a>
                        </div>
                    </div>
                </div>
            </ul>
        </div>
        <nuxt-child />
    </div>
</template>

<script>
import axios from 'axios'
import * as moment from 'moment';
import { getserverList,getService } from '@/api/home'
import { getUserInfo } from '@/api/login'
import {codeTxt} from '@/components/codeTxt'

export default {
    components: {
       
    },
    data(){
        return {
            ceshi:[
                {name:'工商注册',child:[{key:'公司注册'},{key:'工商变更'},{key:'公司注销'}]},
                {name:'财税服务',child:[{key:'代理记账'},{key:'公司审计'},{key:'税收计划'}]},
                {name:'知识产权',child:[{key:'发明专利'},{key:'实用专利'},{key:'外观专利'},{key:'商标注册'},{key:'作品著作权登记'},{key:'商标变更'},{key:'更多服务'}]},
                {name:'项目申报',child:[{key:'高企认定'},{key:'可研报告'},{key:'两化融合'},{key:'更多服务'}]},
                {name:'融资上市',child:[{key:'上市辅导'},{key:'新三板挂牌'},{key:'新四板挂牌'}]},
                {name:'法律服务',child:[{key:'法律风险评估'},{key:'知识产权纠纷'},{key:'新四板挂牌'}]},
            ],
            iswid:true,
            cdnPath:process.env.CDN_BASE_URL,
            wtUrl: process.env.PC_URL,
            isZC: process.env.PROPERTY_URL,
            shopUrl:process.env.SHOP_URL,
            enfan:process.env.ENFAN_URL,
            add:'default',
            serverList:[],
            xunlu:process.env.SOFTWARE_URL, //寻鹿
            clickBox:'',
            active:'/',
            activeId:'/',
            href:'',
            routeState:false,
            rightList:[
                {
                    id:1,
                    value:this.$t('txt.announcements'),
                    path: 'index-policy-announcement'
                },
                {
                    id:2,
                    value:this.$t('txt.popularProject'),
                    path:'index-project'
                },
                {
                    id:3,
                    value:this.$t('txt.troubleshooting'),
                    path:'index-policy-troubleshooting'
                },
                {
                    id:4,
                    value:this.$t('txt.policyAssembly'),
                    path:'index-policy-assembly'
                },
                {
                    id:5,
                    value:this.$t('txt.feedback')
                },
            ],
            indexNav:[
                {
                    name: this.$t('txt.home'),
                    path: "index",
                    id: "/",
                },
                {
                    name:this.$t('txt.projectApplication'),
                    path: "index-project",
                    id: "/project",
                },
                {
                    name: this.$t('foot.txt17'),
                    path: "index-property",
                    id: "/property",
                },
                {
                    name:this.$t('foot.txt10'),
                    path: "index-evaluation",
                    id: "/evaluation",
                },
                {
                    name: this.$t('txt.policySquare'),
                    path: "index-policy-policysquare",
                    id: "/policy",
                    children:[
                        {
                            id:'/policy/announcement',
                            name:this.$t('txt.announcements'),
                            path:'index-policy-announcement',
                        },
                        // {
                        //     id:'/policy/assembly',
                        //     name:this.$t('txt.policyAssembly'),
                        //     path:'index-policy-assembly',
                        // },
                        {
                            id:'/policy/industryinfo',
                            name:this.$t('foot.txt18'),
                            path:'index-policy-industryinfo',
                        },
                        {
                            id:'/policy/troubleshooting',
                            name:this.$t('txt.troubleshooting'),
                            path:'index-policy-troubleshooting',
                        },
                        {
                            id:'/policy/filesDownload',
                            name:this.$t('foot.txt19'),
                            path:'index-policy-filesDownload',
                        }
                    ]
                },
                {
                    name: '找技术',
                    id: "/result",
                    children:[
                        {
                            name: '技术成果',
                            path: "index-result",
                            id: "/result",
                        },{
                            name: '技术需求',
                            path: "index-need",
                            id: "/need",
                        }
                    ]
                },
                // {
                //     name: this.$t('foot.txt16'),
                //     path: "index-aboutWt",
                //     id: "/aboutWt",
                // },//导航栏取消显示关于wt
            ]
        };
    },
    mounted(){
        this.getList();
        var val = this.$route;
        this.iswid = false
        if(val.name== 'index'){
            this.iswid =true
        }
        if(val.matched.length>2){
            //有二级页面
            this.activeId = val.matched[1].path;
            this.active = val.matched[2].path;
        }else{
            //无二级页面
            this.activeId = val.matched[1].path;
        }
        if (window.history || window.history.popState) {
            if(this.$store.state.searchTxt){
                this.$store.state.searchTxt = '';
            }
        };
    },
    computed:{
        // serverData(){
        //     return JSON.parse(JSON.stringify(this.serverList));
        // },
        
    },
    watch:{
        $route(val){
            this.iswid = false
            if(val.name== 'index'){
              this.iswid =true
            }
            if(val){
                if(val.matched.length>2){
                    //有二级页面
                    this.activeId = val.matched[1].path;
                    this.active =val.matched[2].path;
                }else{
                    //无二级页面
                    this.activeId = val.matched[1].path;
                }
                if(window.history || window.history.popState){
                    if(this.$store.state.searchTxt){
                        this.$store.state.searchTxt = '';
                    }
                };
            }
        }
    },
    methods:{
        jump(url){
            if(sessionStorage.getItem('link')){
                window.location = this.shopUrl + url+'?link='+sessionStorage.getItem('link');
            }else{
                window.location = this.shopUrl + url;
            };
        },
        zcJump(){
            if(sessionStorage.getItem('link')){
                window.location = this.enfan +'?link='+sessionStorage.getItem('link');
            }else{
                window.location = this.enfan ;
            };
        },
        classPage(val,id){
            if (id) {
                window.open(val.icon)
            } else {
                window.open(val.url)
            }
        },
        getList(){
            // getserverList().then(res=>{
            //     this.serverList = JSON.parse(JSON.stringify(res.data.data));
            // })
            getService().then(res=>{
                let data =  []
                res.data.data.forEach((item)=>{
                    if(item.serviceOptionList){
                       data.push(item)
                    }
                })
                this.serverList = data;
            })
        },
        getTab(data,value){
            this.activeId = data;
            sessionStorage.setItem('add',data);//选中当前浏览的导航栏
        },
        getId(data){
            this.active = data;
            sessionStorage.setItem('active',data);//选中的二级导航栏
        },
    }
}
</script>

<style lang="stylus" scoped>
.istop{
    position: relative;
    top: 2px;
    font-size: 16px;
}
.istipwid{
    border-bottom: 1px solid #2a65ef;
}
.frame{
    width:100%;
    // font-family:Microsoft YaHei;
    min-height:669px;
    .head-box{
        width:100%;
        display:flex;
        z-index:1;
    }
    .dropdown {
        text-align:center;
        display: inline-block;
        background: #2A65EF;
        min-width:220px;
        padding:11px 49px;
        border-radius: 5px 5px 0px 0px;
        .service-img{
            width:14px;
            height:13px;
            margin-left:3px;
        }
    }
    .dropdown:hover .dropdown-content{
        display:block;
    }  
    .otherPage{
        display:block !important;
    }
    .dropdown-content {
        display:none;
        position: absolute;
        background: #fff;
        margin-top:14.2px; 
        margin-left:-49px;
        width: 220px;
        z-index 999
        
        .drop_down{
            width:100%;
            height:551.5px;
            overflow: hidden;
            line-height:20px;
            font-size:14px;
            border-left: 2px solid #2a65ef;
            border-right: 2px solid #2a65ef;
            border-bottom: 2px solid #2a65ef;
            border-radius: 0px 0px 5px 5px;
            padding: 0 14px 0 14px;
            text-align: left;
            .sertitle{
                color: #333333;
                font-weight: 700;
                padding-top: 10px;
                .cur{
                     cursor pointer
                }
                .rightimg{
                    width 6px
                    height: 10px;
                    float:right;
                    position relative
                    top 3px
                }
            }
            .sercontent{
                font-size: 12px;
                color: #767676;
                margin: 6px 0 10px 0;
                .tent{
                    font-size 12px
                    display inline-block
                    margin-bottom 2.5px
                    cursor pointer
                }
                .mr{
                    margin-right: 10.5px;
                }
            }
            .heng{
                width: 193px;
                height: 1px;
                background: #e5e5e5;
            }
            // .class_title{
            //     color: #333333;
            //     font-weight 700
            //     font-size: 16px;
            //     padding-top:13px;
            //     display: flex;
            //     justify-content: center;
            //     align-items: center;  
            // }
            // .option{
            //     margin:8px 17px 0 17px;
            //     display:flex;
            // }
            // .option p{
            //     width:90px;
            //     margin:0 auto;
            //     cursor:pointer;
            //     font-size: 12px;
            //     color: #999999;
            // }
        }
    }
    .activeStyle{
        color:#FFF;
        background:#097CE1FF;
    }
    .activeTab{
        color:#36A6FE;
        font-weight: 700;
    }
    .listSty{
        background:#36A6FEFF;
    }
    .navigation_ul{
        width:1200px;
        min-width:1200px;
        height:46px;
        margin:0 auto;
        margin-top:10px;
        padding-left:0;
        display:flex;
        .navigation{
            flex: 1;
            text-align :center;
            font-size:16px;
            cursor:pointer;
            display: inline-block;
            position relative
            .scrollnav{
                position: absolute;
                width: 23px;
                height: 3px;
                background: #36a6fe;
                top: 38px;
                left: 73px;
                opacity: 1;

            }
        }
        .tab{
            line-height :46.5px;
            font-size: 16px;
        }
        .dropdown-navigation{
            display: none;
            position: absolute;
            background-color: #36A6FEFF;
            color:#FFF;
            min-width: 162.58px;
            z-index: 9999;
            .drop_navigation{
                text-align:center;
                cursor:pointer;
                width:100%;
                height:44px;
                line-height:44px;
                text-align:center;
                border-top:1px solid #FFF;
            }
            .drop_navigation:hover{
                background:#097CE1FF;
            }
        }
        .property-style{
            display :block;
            width:100%;
            line-height: 40px;
            font-size: 16px;
            color: #000000;
            font-family: "Source Han Sans CN";
            text-decoration: none;
            line-height: 46.5px;
        }
        .navigation:hover{
            color:#FFF !important;
            background:#36A6FE;
        }
        .navigation:hover .dropdown-navigation{
            display: block;
        }
        .navigation:hover .property-style{
            color: #FFF;
        }
    }
    .left_navigate{
        position:fixed;
        // margin-top:470px;
        margin-left:150px;
        .left-box:hover{
            background:#36A6FE;
        }
        .top{
            padding:9px;
            cursor:pointer;
            font-size:14px;
            background:#36A6FE;
        }
        @media screen and (max-width:1760px) {
            margin-left:0px;
        }
        @media screen and (max-width:1317px) {
            display:none;
        }
    }
}
</style>

