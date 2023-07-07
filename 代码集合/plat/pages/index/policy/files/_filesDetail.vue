<template>
    <div class="frame">
        <div class="breadcrumbSty">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ name: 'index' }">{{$t('txt.home')}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name:'index-policy-policysquare'}">{{$t('txt.policySquare')}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name:'index-policy-filesDownload'}">{{$t('foot.txt19')}}</el-breadcrumb-item>
                <el-breadcrumb-item >文档详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="content">
            <template  v-if="isExist">
                <div class="left_frame">
                    <div class="left_container">
                        <div class="left_buy" v-if="isBuy">已购买</div>
                        <div class="left_con">
                            <div class="title">{{fileInfo.fileName}}</div>
                            <div class="operate">
                                <div class="level_sty" v-if="fileInfo.level">{{fileInfo.level | filterLevel}}</div>
                                <div class="level_sty" v-if="fileInfo.areaName">{{fileInfo.areaName}}</div>
                                <div class="font_sty">
                                    <i class="iconfont">&#xe618;</i>&nbsp;
                                    <span class="font_sty" v-if="fileInfo.createTime">{{fileInfo.createTime | filterTime}}</span>
                                </div>
                                <div class="font_sty" v-if="collectId<2">
                                    <i class="iconfont" @click="collect(1)">&#xe6c8;</i>&nbsp;
                                    <span class="font_sty" @click="collect(1)">收藏</span>
                                </div>
                                <div class="font_sty" v-else>
                                    <i class="iconfont orange_sty" @click="collect(2)">&#xe6c8;</i>&nbsp;
                                    <span class="font_sty" @click="collect(2)">已收藏</span>
                                </div>
                                <div class="font_sty">
                                    <i class="iconfont" @click="downloadDoc()">&#xe60c;</i>&nbsp;
                                    <span class="font_sty" @click="downloadDoc()">下载</span>
                                </div>
                            </div>
                        </div>
                        <!-- pages 0-老数据 1-新数据 -->
                        <div class="img_box"  v-if="fileInfo.pages==0">
                            <div class="img_default">
                                <img :src="historyImg" alt>
                                <p>{{userId | filterTip}}</p>
                            </div>
                        </div>
                        <div :class="['img_box',viewPage==1?'hidden':'scroll']" @scroll="imgScroll($event)"  ref="file" v-else>
                            <div class="img_item">
                                <img :src="item" v-for="(item,index) in fileList" :key="index" alt class="img_sty">
                            </div>
                            <!--下单入口 -->
                            <template v-if="!isBuy"> 
                                <div class="order" @click="toOrder()" v-if="fileInfo.isPay==1&&total>viewPage">
                                    <span>试读已结束，付费{{fileInfo.amount}}元，查看剩余{{total-viewPage}}页信息</span>
                                </div>
                                <div class="order" @click="toOrder()" v-if="fileInfo.isPay==1&&total==viewPage&&total==1">
                                    <span>试读已结束，付费{{fileInfo.amount}}元，查看信息</span>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="left_frame">
                    <div class="property_no_data">
                        <img src="@/assets/images/member/no_question@2x.png" alt="暂无数据" />
                        <p class="tip">暂无数据</p>
                    </div>
                </div>
            </template>
            <div class="right-frame">
                <div>
                    <right-side :typeId="3"></right-side>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import qs from 'qs'
import { 
    getDocDetail, 
    previewDoc, 
    downloadDoc,
    addCollect,
    deleteCollect,
    getCollectStatus,
} from '@/api/announcement'
import RightSide from '@/components/policy/rightSide'
import TransferPdf from '@/components/policy/transferPdf'
import * as CodeMsg from "@/api/CodeChange"
export default {
    head () {
        return {
            title: this.fileInfo.fileName,
            meta: [
                { name:'keywords',content: this.fileInfo.fileName, },
                { hid: 'description', name: 'description',content: this.fileInfo.fileName}
            ]
        }
    },
    components: {
        RightSide,
        TransferPdf
    },
    data(){
        return{
            cdnPath: process.env.CDN_BASE_URL,
            fileId: null,//文件ID
            collectId: null,//0-未登录 1-未收藏 2 已收藏,
            fileInfo: {},//文件详情信息
            userId: null,//用户id
            fileList: [],//文件列表
            viewPage: 0,//可看页数
            remain: 0,//剩余页数
            pageNo: 1,
            total: 0,
            remain: 0,
            isScroll: false,//是否滚动到底
            isBuy: false,//是否购买过,
            historyImg: require('@/assets/images/zhengce/icon_examine.png'),
            isExist: true//文档是否存在
        }
    },
    filters: {
        filterLevel(val) {
            return val == 1 ? '国家级': val == 2 ? '省级' : val == 3 ? '市级': val == 4 ? '区级': ''
        },
        filterTime(val) {
            if(val){
                return val.slice(0,10);
            }
        },
        filterTip(val){
            if(val){
                return "文件暂不支持预览，请直接下载查看详情"
            }else{
                return "文件暂不支持预览，请登录后直接下载查看详情"
            }
        }
    },
    created(){
        this.fileId = this.$route.params.filesDetail
    },
    methods:{
        // 滚动加载更多
        imgScroll(e){
            let scrollHeight = this.$refs.file.scrollHeight
            let clientHeight = this.$refs.file.clientHeight
            let scrollTop = this.$refs.file.scrollTop
            if(scrollHeight - (scrollTop + clientHeight) <= 500){
                console.log('快到底了')
                if(this.fileInfo.isPay==0){
                    this.isScroll = true
                    if(Math.ceil((this.total)/5) > this.pageNo){
                        this.pageNo+=1
                        this.getPreview()
                    }
                    return false
                }
            }
            if(scrollHeight - (scrollTop + clientHeight) == 0){
                if(!this.isBuy){
                    if(this.remain==0){
                        this.$message({
                            message:`试读已结束，付费${this.fileInfo.amount}元，可查看信息`,
                            type: 'warning',
                            offset: 500,
                            duration: 1000
                        })
                    }else{
                        this.$message({
                            message:`试读已结束，付费${this.fileInfo.amount}元，可查看剩余${this.remain}页信息`,
                            type: 'warning',
                            offset: 500,
                            duration: 1000
                        })
                    }
                }
            }
        },
        // 文件下载
        download(url, name){
            this.dowondImg(this.cdnPath + url, name)
            window.open(this.cdnPath + url)
        },
        //点击下载图片
        dowondImg(url,name) {
            this.getUrlBase64(url).then((base64) => {
                const link = document.createElement("a");
                link.href = base64;
                link.download = name || 'photo';
                // link.download = this.$route.query.source;
                link.click();
            });
        },
        // 创建一个canvas，把图片转成base64的格式，再赋值给a标签,点击下载
        getUrlBase64(imgUrl) {
            return new Promise((resolve) => {
                    let canvas = document.createElement("canvas");
                    let ctx = canvas.getContext("2d");
                    let img = new Image(); //允许进行跨域
                    img.crossOrigin = "Anonymous";
                    img.src = imgUrl;
                    img.onload = function() {
                    canvas.height = img.height; //图片的高度
                    canvas.width = img.width;//图片的宽度
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    let dataURL = canvas.toDataURL("image/png");
                    canvas = null;
                    resolve(dataURL);
                };
            });
        },
        // 下载
        downloadDoc(){
            if(!localStorage.getItem('userInfo')) {
                location.href = "/login";
                sessionStorage.setItem('collectLink',this.$route.path + '?' + qs.stringify(this.$route.query))
                return false
            }
            if(this.fileInfo.pages == 0){
               this.download(this.fileInfo.fileSourceUrl, this.fileInfo.fileName)
                return false
            }
            let params = {
                id: this.fileId,
                userId: this.userId
            }
            downloadDoc(params).then(res => {
                if(res.data.code == CodeMsg.CODE_0){
                    window.open(res.data.data)
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'warning',
                        offset: 500,
                        duration: 1500
                    });
                }
            })

        },
        // 卧涛文档文档预览
        getPreview(){
            let params = {
                id: this.fileId,
                userId: this.userId,
                pageNo: this.pageNo,
                pageSize: 5
            }
            previewDoc(params).then(res => {
                if(res.data.code == CodeMsg.CODE_0){
                    let list = this.fileList
                    this.fileList = this.isScroll ? list.concat(res.data.data.urls) : res.data.data.urls
                    this.total = res.data.data.total
                    this.viewPage = res.data.data.viewPage
                    this.remain = this.total > this.viewPage ? this.total - this.viewPage : 0
                    this.isBuy = res.data.data.payed
                }
            })
        },
        // 获取收藏状态
        async judgeCollectStatus(){
            await this.getDocDetail()
            await this.getPreview()
            let params = {
                collectSource: 1,//收藏来源 1-PC 2-H5 3-小程序
                infoId: this.fileId,
                title: this.fileInfo.fileName,
                userId: this.userId
            }
            getCollectStatus(params).then(res=>{
                if(res.data.code == 10002){
                    this.collectId = 0
                    return false
                }
                if(res.data.code == 0){
                    this.collectId = res.data.data==false ? 1 : 2
                }
            })
        },
        collect(status) {
            if(!localStorage.getItem('userInfo')) {
                location.href = "/login";
                sessionStorage.setItem('collectLink',this.$route.path + '?' + qs.stringify(this.$route.query))
                return false
            }
            const param = {
                collectSource: 1,//收藏来源 1-PC 2-H5 3-小程序
                title: this.fileInfo.fileName,
                userId: this.userId,
                type: 3//1-通知公告 2-行业资讯 3-卧涛文档
            }
            if (status == 1) {
                // status 1-添加收藏 2-取消收藏
                param.infoId = this.fileId
                param.infoNo = this.fileInfo.fileNo
                addCollect(param).then((res) => {
                    if (res.data.code == 0) {
                        this.$message({
                            type: 'success',
                            message: '收藏成功！',
                            offset: 300,
                            duration: 1500
                        })
                        this.judgeCollectStatus()
                    }
                })
            } else {
                param.infoIds = [this.fileId]
                deleteCollect(param).then((res) => {
                    if (res.data.code == 0) {
                        this.$message({
                            type: 'warning',
                            message: '取消收藏成功',
                            offset: 300,
                            duration: 1500
                        })
                        this.judgeCollectStatus()
                    }
                })
            }
        },
        // 下单入口
        toOrder(){
            if(!localStorage.getItem('userInfo')) {
                location.href = "/login";
                sessionStorage.setItem('collectLink',this.$route.path + '?' + qs.stringify(this.$route.query))
                return false
            }
           this.$router.push({
                path: "/policy/files/file-order",
                query: {
                    id: this.fileId
                }
           })
        },
        getDocDetail(){
            getDocDetail(this.fileId).then(res => {
                if(res.data.code != CodeMsg.CODE_0){
                    this.$message({
                        message: res.data.msg,
                        type: 'warning',
                        offset: 500,
                        duration: 1500
                    });
                   this.$nextTick(()=>{
                     this.isExist = false
                   })
                    return false
                }
                res.data.data.amount = res.data.data.amount.toFixed(2)
                this.fileInfo = res.data.data
            })
        }

    },
    mounted(){
        if(localStorage.getItem('userInfo')) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'))
            this.userId = userInfo.userId
        }
        if (this.$route.query.link) {
            let data = {
                fileId: this.$route.params.filesDetail,
                link: this.$route.query.link
            }
            sessionStorage.setItem('docInfo',JSON.stringify(data))
        }
        this.judgeCollectStatus()
    }
}
</script>
<style lang="stylus" scoped>
@import './filesDetail.styl';
</style>