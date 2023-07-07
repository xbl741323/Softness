<template>
    <div class="frame" v-loading="loading">
        <div class="banner_img">
            <banner :typeId="2"></banner>
        </div>
        <div class="search_box">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ name: 'index' }">{{$t('txt.home')}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name:'index-policy-policysquare'}">{{$t('txt.policySquare')}}</el-breadcrumb-item>
                <el-breadcrumb-item >{{$t('txt.troubleshooting')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 卧涛问答列表 -->
        <div class="troubleList">
            <div class="left-box" :class="{newSty:this.announceList.length==0}">
                <div class="search_frame" :v-model="searchForm" >
                    <input type="text" class="search_input" placeholder="搜索卧涛问答" v-model.trim="searchForm.content"  @keydown.enter="getAllList()" />
                    <div class="search_button" @click="getAllList()">搜问题</div>
                    <div class="search">
                        <img src="~/assets/images/home/icon_search.png" alt="搜索"/>
                    </div>
                    <div class="search_btn" @click="askQuestion()">我要提问</div>
                </div>
                <div class="sorting">
                    <div class="sort-right">
                        <span
                        :class="['sortsty',sort == item.type ? 'activeSort':'']"
                        v-for="(item,index) in most"
                        :key="index"
                        @click="chooseItem(item, 'sort')"
                        >{{item.title}}</span>
                    </div>  
                </div>
                <div v-if="this.announceList.length==0" class="no_data_box">
                    <img class="no_data_img" src="~assets/images/zhengce/tongzhi_img_nodata@2x.png" />
                    {{$t('txt.noContentTxt')}}
                </div>
                <div 
                v-for="(item,index) in announceList" 
                :key="index"
                class="list-box">
                <div class="content-list"> 
                    <div class="content_sty">
                        <el-tooltip content="Top" placement="top" effect="light" v-if="item.title.length>42">
                            <span slot="content" v-html="item.title"></span>
                            <div class="trouble-title" @click="toDetail(item)">
                                <div class="content_box">
                                    <p class="list-title" v-html="item.title"></p>
                                </div>
                            </div>
                        </el-tooltip>
                        <div v-else>
                            <div class="trouble-title" @click="toDetail(item)">
                                <div class="content_box">
                                    <p class="list-title" v-html="item.title"></p>
                                </div>
                            </div>
                        </div>
                        <div class="answer_box">
                            <p class="list-content"  @click="toDetail(item)" v-html="item.description"></p>
                        </div>
                        <div class="answer_con">
                            <div>
                                <img src="~assets/images/industry/icon_wenda.png" alt="回答" class="qa_img">
                                <span class="qa_txt">{{item.answerCount | filterCount}}个回答</span>
                            </div>
                            <div>{{item.createTime | filterTime}}</div>
                        </div>
                    </div>
                </div>
                <div class="list-line"></div>
                </div>
            </div>
            <div class="right-box">
                <div>
                    <right-side :typeId="2"></right-side>
                </div>
            </div>
        </div>
        <!-- 分页 -->
        <div class="page_box" v-if="this.announceList.length != 0">
            <el-pagination
                class="page_sty"
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="currentPage"
                :page-size="pagesize"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import qs from 'qs'
import { downloadFile, esPagePolicy, esPageIndustry, esPageFile } from '@/api/announcement'
import { getQuestionList} from '@/api/question'
import {getHotSearch} from '@/api/home'
import * as CodeMsg from "@/api/CodeChange"
import Banner from '@/components/policy/banner'
import city from '@/components/search/city'
import RightSide from '@/components/policy/rightSide'
import policyData from './policy_data'
export default {
    props:['searchMark','content'],
    components:{
        Banner,
        city,
        RightSide
    },
    head () {
        return {
            title:'科技项目申报_知识产权申请常见问题解答就找卧涛网',
            meta: [
                { name: 'keywords', content: '专利申请知识、科技项目答辩、商标注册问答' },
                { hid: 'description', name: 'description', content: '各类项目政策解读、汇编、分析，助力企业掌握相关领域的知识信息，制定合适的项目申报战略，不懂项目申报就找卧涛网。' }
            ]
        }
    },
    data(){
        return{
            filePathUrl:process.env.baseUrl,
			cdnPath:process.env.CDN_BASE_URL,
            title:'',
            pagesize:10,
            currentPage:1,
            total:0,
            searchForm:{
                content:''
            },
            show:true,
            newsId:['new'],
            titleId:['title'],
            isContent:false,
            areaList:[],
            isHotSpot:false,
            isNewest:true,
            isTitle:true,
            announceList:[],
            noticeList:[],
            industryList:[],
            troubleList:[],
            policySearchParams:[],
            searchList:[],
            searchId:'',
            list: policyData.list,
            bannerImg:[],
            curr:false,
            active:[],
            activeId:null,
            loading:false,
            listLength:'',
            cityList:[],
            citysList:[],
            hasProvinces: [],
            showProvince: true,
            callInterface: false,
            provinceNo: null,
            keepChildOpen: false,
            provinceInfo:{},//临时存储当前省份信息
            addr: '',
            most: policyData.most,
            sort: 'latest',
        }
    },
    filters: {
        filterTime(val){
            if(val){
                return val.length > 10 ? val.slice(0,10) : val
            }
        },
        filterCount(val) {
            if(val){
                return val>0 ? val : 0
            }else{
                return 0
            }
        }
    },
    created(){
        if(this.$route.query.search){
            this.searchForm.content = this.$route.query.search;
            this.getAllList()
        }else{
            this.$router.push({
                query: {
                    search: ''
                }
            });
        }
    },
    methods:{
        askQuestion(){
            if(localStorage.getItem('userInfo')){
                this.$router.push({
                    name: "index-policy-question"
                })
            }else{
                this.$router.push("/login")
                sessionStorage.setItem('collectLink',this.$route.path + '?' + qs.stringify(this.$route.query))
            }
        },
        chooseItem(item, val){
            if(val == 'sort'){
                this.sort = item.type
            }
            this.getAllList()
        },
        getHotWords(){
            getHotSearch(2).then(res=>{
                this.searchList = res.data.data;
            });
        },
         //文件下载预处理，校验是否登录，实际上不下载
        download(item){
            downloadFile(0).then(res=>{
                if(res.data.code != 10002){
                    let a = document.createElement("a");
                    a.href = this.filePathUrl+'/file/download?id='+item.id+'&name='+item.name;
                    a.click();
                }
            })
        },
        toDetail(item){
            this.$router.push({
                name: "index-policy-questionDetail",
                query: {
                    id: item.id
                }
            })
        },
        //翻页
        handleCurrentChange(val){
            this.currentPage =val;
            this.curr = true;
            this.getList();
        },
        handleSizeChange(val){
            
        },
        //获取列表信息
        getList(){
            let param = {
                keyWord: this.searchForm.content,//关键字
                sortField: this.sort =='latest' ? 'Time':'Other',
                pageNo: this.currentPage,
                pageSize: this.pagesize,
            }
            getQuestionList(param).then(res => {
                if (res.data.code == CodeMsg.CODE_0) {
                    this.loading = false
                    this.announceList = Array.from(res.data.data.records)
                    this.total = res.data.data.total
                }else{
                    this.total = 0
                }
            }).catch((err) => {
                return err
            })
        },
        getAllList(){
            this.currentPage = 1
            this.getList()
        }
    },
    mounted(){
        //二级页面全站搜索获取搜索值
        if(this.$store.state.searchTxt){
            this.content = this.$store.state.searchTxt;
        }
        this.getHotWords();
        this.getAllList()
    },
    computed:{
        searchTxt(){
            return this.$store.state.searchTxt;
        },
        location(){
            return this.$store.state.Set_LocationNo;
        }
    },
    watch:{
        'searchForm.content'(val){
            if(val==''){
                this.$router.push({
                    query: {
                        search: ''
                    }
                });
                this.sort = 'latest'
                this.show = true;
            }else{
                this.sort = 'hottest'
            }
            this.getAllList()
        },
        searchTxt(val){
            this.content = val;
            this.getAllList();
        },
    }
}
</script>
<style lang="stylus" scoped>
.circle{
  background:url('~@/assets/images/industry/yuanquan_gray@2x.png') no-repeat;
  background-size:4px 4px;
  background-position: left;
}
.circle:hover{
  color: #36A6FE;
  background:url('~@/assets/images/industry/yuanquan_blue@2x.png') no-repeat;
  background-size:4px 4px;
  background-position: left;
}
.frame{
    width:100%;
    min-width:1200px;
    font-size:14px;
    background:#F1F1F1;
    font-family:Microsoft YaHei UI;
    .banner_img{
        height:440px;
    }
    .search_box{
        width:1200px;
        margin:20px auto;
        font-size:14px;
    }
    .sorting{
        margin: 0 auto;
        padding-left: 20px;
        padding-top: 10px;
        margin-bottom: -10px;
        background: #FFF;
        display: flex;
        text-align: right;
        width: 799px;
        border-bottom: 1px solid #eaebef;
        .new-hot{
            display:flex
            width:200px;
        }
        .newestSort{
            color:#8A8A8A;
            cursor:pointer;
        }
        .hotestSort{
            color:#8A8A8A;
            cursor:pointer;
        }
        .activeSort{
            color:#36A6FE !important;
        }
        .inactiveSort{
            color:none !important;
        }
    }
    .troubleList{
        width:1200px;
        min-height:500px;
        padding-bottom:20px;
        margin:0 auto;
        margin-top:20px;
        display:flex;
        .left-box{
            border-radius: 5px;
            width:70%
            background:#FFF;
            .search_frame{
                width:100%;
                margin:0 auto;
                padding:16px 32px;
                display:flex;
                position:relative;
              .search img{
                width: 18px;
                height: 18px;
                position: absolute;
                left: 44px;
                top: 32px;
            }
            .search_btn {
                width: 116px;
                height: 48px;
                border: 2px solid #36a6fe;
                font-size: 16px;
                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                font-weight: 400;
                color: #36a6fe;
                letter-spacing: 0.96px;
                display: flex;
                background: #fff;
                text-align: center;
                align-items: center;
                justify-content: center;
                margin-left: 28px;
                border-radius: 25px;
            }
            .search_btn:hover {
                cursor: pointer;
            }
            .search_button{
                width: 114px;
                height: 48px;
                line-height: 48px;
                background: #36a6fe;
                position: absolute;
                left: 480px;
                top: 16px;
                border-radius: 0 26px 26px 0;
                font-size: 16px;
                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                font-weight: 400;
                text-align: center;
                color: #ffffff;
                letter-spacing: 0.96px;
                cursor: pointer;
            }
            .search_input{
                width: 556px;
                height: 48px;
                background: #ffffff;
                border: 2px solid #36a6fe;
                border-radius: 26px;
                padding-left:38px;
            }
            input:focus{
                outline:0;
                padding-left:38px;
            }
        }
        .hot_project{
            display:flex;
            width:876px;
            margin:10px auto;
            color:#666666;
            align-items: center;
            .btn{
                border: 1px solid #36A6FE;
                border-radius: 40px;
                font-size: 12px;
                height: 20px;
                padding: 15px 10px;
                text-align: center;
                line-height: 1px;
                margin-left: 10px;
                color: #36A6FE;
                cursor: pointer;
            }
            .btn:hover{
                color:#36A6FE;
            }
            .searchStyle{
                background: #36A6FE;
                color: #FFF;
            }
            .searchStyle:hover{
                color: #FFF;
            }
        }
        .line{
            border-bottom:1px solid #D6D6D6;
            width:100%;
        }
        .attribution{
            padding:0;
            border-bottom:1px solid #D6D6D6;
        }
        .attribution li{
            list-style:none;
            cursor pointer;
        }
        .only-show-city{
            min-height:50px;
            line-height:40px;
            display:flex;
            flex-flow:row wrap;
            border-bottom:1px solid #D6D6D6;
            .area{
                color:#333333;
                font-size:14px;
                font-weight:bold;
                width:150px;
                padding-right: 10px;
                text-align: right;
                border-right:1px solid #EEE;
            }
            .city-name{
                width: 1050px;
                display: flex;
                flex-flow:row wrap;
            }
            .city-name p{
                color:#656565;
                margin:0 15px;
                cursor:pointer;
            }
        }
        .centralized{
            height:50px;
            line-height:50px;
            display:flex;
            flex-flow:row wrap;
            border-bottom:1px solid #D6D6D6;
            .centralized-name{
                color:#333333;
                font-size:14px;
                font-weight:bold;
                width:150px;
                padding-right:10px;
                text-align: right;
                border-right:1px solid #eee;
            }
            .classification{
                display:flex;
                .btn{
                    color:#656565;
                    cursor:pointer;
                }
                .btn span{
                    padding:5px 15px;
                }
                .btn:hover{
                    color:#36A6FE;
                }
            }
        }
        li:hover{
            color:#36A6FE;
        }
        .city-box{
            width:1050px;
            background:#FFF;
            min-height:100px;
            margin-top:-12px;
            margin-left:149px;
            padding-top: 12px;
            border-left:1px solid #eee;
            background: #F2F2F2
            .city-list{
                float:left;
                margin:10px 10px;
            }
            .city-list{
                cursor:pointer;
            }
            .city-list span{
                padding:6px 12px;
                font-size:14px;
                color:#656565;
                background:#fff;
                border: 1px solid #E9E9E9;
                border-radius: 4px;
            }
        }
        .has-province{
          margin-top: -40px !important;
          background:#FFF;
        }
        .provinces{
            line-height:50px;
            display:flex; 
            .area-name{
               color:#333333;
               font-size:14px;
               font-weight:bold;
               width:150px;
               padding-right:10px;
               text-align: right;
               margin-right:15px;
               border-right:1px solid #eee;
            }
             .area {
                color: #333333;
                font-size: 14px;
                font-weight: bold;
                width: 150px;
                padding-right: 10px;
                text-align: right;
                margin-right: 15px;
                border-right: 1px solid #eee;
            }

            .list {
                max-width:1042px;
                        margin-left: -15px;
                        display:flex;
                        flex-flow:row wrap;
                        .activeTab{
                            // color:#36A6FE !important;
                            background: #F2F2F2 ;
                        }
            }
            .areaListSty{
                font-size:14px;
                padding:5px 15px;
                width:100px;
                height:28px;
                color:#656565;
                cursor:pointer;
            }
            .areaListSty:hover{
                color:#36A6FE !important;
            }
        }
        .provinces li{
            list-style:none;
            display:inline-block;
            margin-left:30px;
            font-size:14px;
            color:#656565;
            cursor:pointer;
        }
        
        .city{
            background:#F5F8FA;
            cursor:pointer;
            font-size:14px;
            padding:0 8px;
            line-height:30px;
        }
        .activeStyles{
            color:#FFF !important;
            background:#36A6FE !important;
        }
        .activeSty{
            color:#36A6FE !important;
        }
        .activeTab{
            color:#36A6FE !important;
        }
        .centralized{
            height:50px;
            line-height:50px;
            display:flex;
            border-bottom:1px solid #D6D6D6;
            .classification{
                display:flex;
                .btn{
                    color:#656565;
                    cursor:pointer;
                }
                .btn span{
                    padding:5px 15px;
                }
                .btn:hover{
                    color:#36A6FE;
                }
            }
        }
        .activeStyle{
            color:#36A6FEFF !important;
        }
            .list-box{
                margin:20px;
                // width:90%;
                width:95%;
                .content-list{
                    width:100%;
                    display:flex;
                    position: relative;
                    .ask{
                        width:24px;
                        height:24px;
                        line-height:24px;
                        padding:0 5px;
                        background:#36A6FE;
                        color:#FFF;
                        font-size:14px;
                        text-align:center;
                        border-radius:2px;
                    }
                    .trouble-title{
                        min-width:457px;
                        max-width:90%;
                        padding-left: 4px;
                    }
                    .the-top{
                        margin-left: 28px;
                        width:42px;
                        padding:0 5px;
                        height:20px;
                        background:#FD651C;
                        color:#FFF;
                        line-height:20px;
                        font-size:14px;
                        text-align:center;
                        border-radius:2px;
                    }
                    .list-title{
                        font-size: 16px;
                        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
                        color: #333333;
                        margin:1px 0 10px 10px;
                        font-weight:600;
                        max-width:100%;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        display:-webkit-box;
                        -webkit-box-orient:vertical;
                        -webkit-line-clamp:1;
                    }
                    .list-content{
                        font-size: 14px;
                        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                        font-weight: 400;
                        color: #555555;
                        height:40px
                        margin-left:10px;
                        line-height:20px;
                        text-overflow:ellipsis;
                        overflow:hidden;
                        display:-webkit-box;
                        -webkit-box-orient:vertical;
                        -webkit-line-clamp:2;
                    }
                    .time{
                        color:#A8A8A8;
                        margin:10px 10px 21px 10px;
                        display:flex;
                    }
                }
                .list-line{
                    border-bottom:1px solid #eaebef;
                }
            }
        }
        .newSty{
            background:#F9F9F9;
        }
        .right-box{
            width:28.5%;
            background:#FFF;
            margin-left:1.5%;
            border-radius: 5px;
            .policy_side{
                width:100%;
                padding:10px 10px;
                .policy_content{
                    margin:14px 0;
                    .art_list{
                        color:#86898B;
                        font-size:14px;
                        overflow:hidden;
                        cursor:pointer;
                        text-overflow:ellipsis;
                        display:-webkit-box;
                        -webkit-box-orient:vertical;
                        -webkit-line-clamp:1;
                    }
                    .file_download{
                        text-decoration:none;
                        color:#36A6FE;
                        font-size:14px;
                        overflow:hidden;
                        cursor:pointer;
                        text-overflow:ellipsis;
                        display:-webkit-box;
                        -webkit-box-orient:vertical;
                        -webkit-line-clamp:1;
                    }
                }
                    
            }
        }
    }
.STY {
    background-image: url('~assets/images/industry/gouxuan_icon@2x.png') !important;
    background-size: 16px 16px !important;
    border: none !important;
  }
  .noSty {
    background: #ffffff !important;
    border: 1px solid #707070 !important;
    border-radius: 2px !important;
  }
  .titleSearch {
    width: 16px;
    height: 16px;
    background-image: url('~assets/images/industry/gouxuan_icon@2x.png');
    background-size: 16px 16px;
    cursor: pointer;
  }
  .contentSearch {
    width: 16px;
    height: 16px;
    background: #ffffff;
    cursor: pointer;
    margin-left: 25px;
    border: 1px solid #707070;
    border-radius: 2px;
  }
  .sort-right {
    width: 100%;
    height: 60px;
    line-height: 60px;
  }
  .sortsty:hover {
    cursor: pointer;
  }
  .sortsty {
    margin-right: 13px;
    color: #b6b6b6;
  }
  .search_txt_sty {
    color: #36A6FE;
  }
  .no_data_box {
    height: 210px;
    width: 210px;
    text-align: center;
    margin: 100px auto;
    color: #BFBFBF;
  }
  .no_data_img {
    width: 100%;
    height: 100%;
  }
  .content_sty {
    cursor:pointer;
  }
  .content_box {
    display:flex;
  }
  .content_img {
    position: relative;
    top: 3px;
    left: 3.5px;
  }
  .content_time {
    position: absolute;
    top: 3px;
    right: 0;
    color: #86898B;
  }
  .answer_box {
    display: flex;
    margin-bottom: 10px;
  }
  .answer_img {
    position: relative;
    top: 1px;
    left: 3.5px;
  }
  .right_txt {
    color: #233558; 
    font-size: 14px; 
    font-weight: 600;
  }
  .right_sty {
    float: right;
    color: #656565;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .right_more {
    font-size: 12px;
    margin-right: 4px;
    color: #A8A8A8;
    font-weight: bold;
  }
  .circle_left {
    margin-left: 10px;
  }
  .page_box {
    position: relative;
    padding: 30px 0;
  }
  .page_sty {
    position: absolute;
    left: 50%; 
    top: 50%; 
    transform: translate(-50%,-50%);
  }
  .answer_con {
    display: flex;
    width: 799px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .answer_con div {
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    color: #7b7b7b;
  }
  .qa_img {
    width: 14px;
    height: 14px;
    vertical-align: middle;
    margin-left: 10px;
    margin-right: 6px;
  }
  .qa_txt {
    display: inline-block;
    height: 16px;
    line-height: 16px;
    vertical-align: middle;
    font-size: 12px;
  }
}
</style>