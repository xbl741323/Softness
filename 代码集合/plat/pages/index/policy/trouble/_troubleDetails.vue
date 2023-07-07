<template>
    <!-- <client-only> -->
        <div class="frame">
            <!-- <div class="breadcrumbSty">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item 
                :to="{path: '/policy/troubleshooting'}">
                    {{this.dataList.policyTypeValue}}
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{this.dataList.policyTypeValue}}详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div> -->
            <div class="content">
                <div style="width: 72%; margin-top:30px; background: #fff">
                    <div class="left-frame" v-if="collectStatus" v-cloak>
                        <div class="trouble-title">
                            <div class="question">
                                <p class="ask">{{$t('txt.ask')}}</p>
                                <p class="title">{{dataList.title}}</p>
                            </div>
                            <p class="views"><i class="iconfont" style="margin-right:5px;">&#xe693;</i>{{pageViews}}
                                <span v-if="collectId !== 0" style="margin-left:40px;"><i class="iconfont" style="color:#A8A8A8;margin-right:5px;cursor:pointer" @click="collect(1)">&#xe6c8;</i><span style="color:#A8A8A8;margin-right:20px;cursor:pointer" @click="collect(1)">{{$t('share.TXT6')}}</span></span>
                                <span v-else style="margin-left:40px;"><i class="iconfont" style="color:#FFB300;margin-right:5px;cursor:pointer" @click="collect(2)">&#xe6c8;</i><span style="color:#A8A8A8;margin-right:20px;cursor:pointer" @click="collect(2)">{{$t('share.TXT7')}}</span></span>
                            </p> 
                        </div>
                        <div class="trouble-content">
                            <div class="ask-content">
                                <p>{{$t('txt.ansewr')}}</p>
                                <p>{{$t('txt.wtAssistant')}}</p>
                                <p>{{dataList.createTime}}</p>
                                <p v-html="dataList.content"></p>
                            </div>
                            <div class="turn-pages">
                                <p v-if="this.lastTrouble" @click="toLast(0)"><span style="color:#A8A8A8">{{$t('txt.lastProblem')}} ></span >{{this.lastTrouble.title}}</p>
                                <p v-if="this.nextTrouble" @click="toLast(1)"><span style="color:#A8A8A8">{{$t('txt.nextProblem')}} ></span>{{this.nextTrouble.title}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="collect_fail" v-if="!collectStatus" v-cloak>
                        <img src="@/assets/images/zhengce/collect_fail@2x.png" alt="">
                        <p style="color:#BFBFBF;font-size:16px;margin-top:14px;">咦，这篇文章不见啦！</p>
                    </div>
                    <!-- <div v-if="!collectStatus">加载中...</div> -->
                </div>
                <div class="right-frame">
                    <div class="attachment" v-if="this.fileLength>0">
                        <span style="font-size:16px;"><i class="iconfont" style="font-size:16px;">&#xe62d;</i>{{$t('txt.attachment')}}：</span>
                        <div v-for="(item,index) in dataList.filesList" :key="item.id">
                            <el-tooltip :content="index+1+'.'+item.title" placement="top" effect="light">
                                <p style="color:#36A6FE;cursor:pointer;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;" @click="download(item)" >
                                   {{index+1}}.{{item.title}}
                                </p>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="right_content">
                        <div class="policy_side" v-for="(item,index) in rightList" :key="index" >
                            <i class="iconfont" style="color:#36A6FE;" v-html="item.icon"></i>
                            <span style="color: #233558; font-size: 14px; font-weight: 400">{{item.label}}</span>
                            <span style="float:right;color:#656565;font-size:14px;cursor:pointer;display: flex;align-items: center;" v-if="item.label" @click="toList(item.listRouter)">
                               <span style="font-size: 12px;margin-right:4px;color: #A8A8A8;">{{ $t("txt.more") }}</span>
                                <img 
                                src="~/assets/images/industry/right_jiantou@2x.png"
                                width="12"
                                height="12"
                                />
                            </span>
                            <div class="policy_content" v-for="items in rightList[index].policies" :key="items.number">
                                <el-tooltip content="Top" placement="top" effect="light" v-if="items.title.length>20">
                                    <span slot="content" >{{items.title}}</span>
                                    <span @click="download(items)" class="file_download" v-if="items.content"> 
                                        <span class="circle">
                                            <span style="margin-left:13px">{{ items.title }}</span>
                                        </span> 
                                    </span>
                                    <span class="art_list" @click="checkDetail(item.detailRouter,items.number,item.value)" v-else> 
                                        <span class="circle">
                                            <span style="margin-left:13px">{{ items.title }}</span>
                                        </span> 
                                  </span>
                                </el-tooltip>
                                <div v-else>
                                    <span @click="download(items)" class="file_download" v-if="items.content">
                                      <span class="circle">
                                        <span style="margin-left:13px">{{ items.title }}</span>
                                      </span> 
                                    </span>
                                    <span class="art_list" @click="checkDetail(item.detailRouter,items.number,item.value)" v-else>
                                      <span class="circle">
                                        <span style="margin-left:13px">{{ items.title }}</span>
                                      </span> 
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <!-- </client-only> -->
</template>

<script>
import { getArtcleDetail,downloadFile,collection,delCollect,views} from '@/api/announcement'
import Encrypt from '~/plugins/Encrypt'
import axios from 'axios'
export default {
    scrollToTop: true,
    head () {
        return {
            title:this.dataList.metaTitle,
            meta: [
                { name:'keywords',content:this.dataList.metaKeyword, },
                { hid: 'description', name: 'description',content: this.dataList.metaDescription}
            ]
        }
    },
    async asyncData({params}){
        if(process.server){
            try {
                let number = params.troubleDetails.substr(0,params.troubleDetails.length-1);
            let id = params.troubleDetails.substr(params.troubleDetails.length-1,1);
            const res = await axios.get(process.env.ASYNC_DATA_API+'/policy/detail?number='+number+'&type='+2+'&token='+ id);
            
            if(!res.data || !res.data.data || !res.data.data.detail){
                return{
                    dataList:{},
                    collectId:-1,
                    fileLength:'',
                    rightList:{},
                    lastTrouble:{},
                    nextTrouble:{},
                }
            } else{
                let str = Encrypt.aesDecode(res.data.data.detail.content);
                res.data.data.detail.content = str;
                if(res.data.data.detail.deleted == 1 || res.data.data.showStatus ==2 ){
                    return {
                        collectStatus: false,
                        dataList : res.data.data.detail,
                        fileLength : res.data.data.detail.filesList.length,
                        rightList : res.data.data.side,
                        lastTrouble : res.data.data.pre,
                        nextTrouble : res.data.data.next,
                        collectId : res.data.data.isCollected
                    }
                }else{  
                    return{
                        collectStatus: true,
                        dataList : res.data.data.detail,
                        fileLength : res.data.data.detail.filesList.length,
                        rightList : res.data.data.side,
                        lastTrouble : res.data.data.pre,
                        nextTrouble : res.data.data.next,
                        collectId : res.data.data.isCollected
                    }
                }
            }
            }catch(error){
                console.log(error)
            }
        }
    },
    data(){
        return{
            collectStatus:true,
            filePathUrl:process.env.baseUrl,
            articleId:'',
            dataList:{},
            fileLength:'',
            articleList:[],
            rightList:[],
            lastTrouble:{},
            nextTrouble:{},
            listLength:'',
            collectId:'',
            pageViews:''
        }
    },
    created(){
        if( this.$route.params.troubleDetails.length >= 14){
            this.articleId = this.$route.params.troubleDetails.substr(0,this.$route.params.troubleDetails.length - 1); //截取文章编号
            this.id = this.$route.params.troubleDetails.substr(this.$route.params.troubleDetails.length - 1,1); //截取筛选类型
        }else{
            this.articleId = this.$route.params.troubleDetails;
        }
        // this.getDetail();
    },
    methods:{
        getViews(){
            views(this.articleId).then(res=>{
                this.pageViews = res.data.data
            })
        },
        //切换上下一篇文章
        toLast(data){
            if(data==0){
                this.articleId = this.lastTrouble.number;
            }else{
                this.articleId = this.nextTrouble.number;
            }
            this.getDetail();
            this.getViews();
        },
        //跳转到对应详情
        checkDetail(detailRouter,number,value){
            //0通知公告 1政策汇编 2卧涛问答 5行业资讯
            if(value=='2'){
                window.open(number+1);
            }else if(value =='10'){
                 window.open(detailRouter+number+value+ 1);
            }
            else{
                window.open(detailRouter+number+value+1);
            }
        },
        //跳转到对应列表
        toList(data){
            this.$router.push({
                name:data
            })
        },
        //获取详情列表数据
        getDetail(){
            let param= {
                number:this.articleId,
                type:2,
                screen:this.id
            }
            getArtcleDetail(param).then(res=>{
                if(res.data.data.detail.deleted == 1 || res.data.data.detail.showStatus == 2){
                    this.collectStatus = false;
                }else{
                    let str = Encrypt.aesDecode(res.data.data.detail.content);
                    this.collectStatus = true;
                    this.dataList = res.data.data.detail;
                    this.dataList.content = str;
                    this.collectId = res.data.data.isCollected;
                    this.fileLength = this.dataList.filesList.length;
                    this.rightList = res.data.data.side;
                    this.lastTrouble = res.data.data.pre
                    this.nextTrouble = res.data.data.next
                }
            })
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
        collect(status){
            if(localStorage.getItem('userInfo')){
                var userInfo = JSON.parse(localStorage.getItem('userInfo'));
                var id = userInfo.accountId
            }else{
                var id = null;
            }
            let param = {
                accountId : id,
                number:this.articleId,
                resourceTitle: this.dataList.title
            }
            if(status == 1){//status 1-收藏 2-取消
                collection(param).then(res=>{
                    if(res.data.code == 0){
                        this.$message({
                            type:'success',
                            message:'收藏成功！',
                            offset:50
                        })
                        this.getDetail();
                    }
                })
            }else{
                delCollect(param).then(res=>{
                    if(res.data.code == 0){
                        this.$message({
                            type:'warning',
                            message:'取消收藏成功',
                            offset:50
                        })
                        this.getDetail();
                    }
                })
            }
        },
    },
    mounted(){
        this.getViews();
    }
}
</script>
<style>
    [v-cloak]{display:none !important}
</style>
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
    user-select:none;
    margin:0 auto;
    background:#F1F1F1;
    font-family :Microsoft YaHei UI;
    font-size:14px;
    .content{
        width:1200px;
        min-height:630px;
        margin:0 auto;
        padding-bottom:20px;
        position: relative;
        display:flex;
        .collect_fail{
        width:100%;
        min-height:600px;
        background:#FFF;
        display flex
        justify-content center
        align-items center
        flex-direction column
        img{
            width 170px
            height 170px
            margin-top -160px
        }
        }
        .left-frame{
            width:100%;
            margin-bottom:0;            
            .trouble-title{
                width:100%;
                background:#FFF;
                .question{
                    display:flex;
                    padding:20px 40px;
                    .ask{
                        background:#36A6FE;
                        width:26px;
                        height:26px;
                        line-height:26px;
                        text-align:center;
                        color:#FFF;
                    }
                    .title{
                        font-size:18px;
                        color:#373D40;
                        font-weight:bold;
                        line-height:26px;
                        margin-left:10px;
                    }
                }
                .views{
                    color:#A8A8A8;
                    margin-left:40px;
                    padding-bottom:20px;
                }
            }
            .trouble-content{
                width:100%;
                background:#FFF;
                .ask-content{
                    padding:40px;
                    margin-top:10px;
                    min-height:560px;
                }
                .ask-content p:nth-child(1){
                    color:#656565;
                    font-size:18px;
                    font-weight:bold;
                }
                .ask-content p:nth-child(2){
                    color:#36A6FE;
                    font-size:16px;
                    font-weight:bold;
                    margin-top:27px;
                    line-height:30px;
                }
                .ask-content p:nth-child(3){
                    color:#A8A8A8;
                    line-height:24px;
                }
                .ask-content p:nth-child(4){
                    color:#656565; 
                }
                .turn-pages{
                    margin:50px 0 0 30px;
                    padding-bottom:30px;
                    color:#656565;
                    line-height:25px;
                }
                .turn-pages p{
                    cursor:pointer;
                }
            }
        }
        .right-frame{
            width:27%;
            margin-top:30px;
            background:#FFF;
            margin-left:1%;
            .attachment{
                margin:20px 10px;
                line-height:25px;
            }
            .right_content{
                width:99%;
                margin-left:1%;
                margin-bottom:10px;
                margin-top:10px;
                background:#FFF;
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
                        text-decoration :none;
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
            .right_content{
                width:100%;
                margin-left:1%;
                margin-bottom:10px;
                margin-top:10px;
                background:#FFF;
                .policy_side{
                    width:100%;
                    padding:10px 10px;
                    .policy_content{
                        margin:14px 0;
                    }
                    .policy_content p{
                        color:#B8B8B8;
                        cursor:pointer;
                        text-overflow:ellipsis;
                        overflow:hidden;
                        display:-webkit-box;
                        -webkit-box-orient:vertical;
                        -webkit-line-clamp:1;
                    }
                }
            }
        }
    }
    
}
.breadcrumbSty {
  width: 500px;
  margin: 0px 0px 0px 360px;
  padding-top: 28px;
}
</style>