<template>
    <div class="frame_box">
        <div class="bread_box">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ name: 'index' }">{{$t('txt.home')}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name:'index-policy-policysquare'}">{{$t('txt.policySquare')}}</el-breadcrumb-item>
                <el-breadcrumb-item >{{$t('foot.txt19')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="file_box">
            <div class="file_list" :class="{newSty:fileList.length==0}">
                <div class="search_frame" :v-model="searchForm" >
                    <input type="text" class="search_input" placeholder="搜索卧涛文档" v-model.trim="searchForm.content"  @keydown.enter="getAllList()" />
                    <div class="search">
                        <img src="~/assets/images/home/icon_search.png" alt/>
                    </div>
                    <div class="search_btn" @click="getAllList()">搜索</div>
                </div>
                <!-- 排序 -->
                <div class="sorting">
                    <div class="sort_box" >
                        <span v-for="(item,index) in most" :key="index" :class="['newestSort',{activeSort:sort == item.type}]" @click="chooseItem(item)">
                            <span class="sort_txt">{{item.title}}</span>
                        </span>
                    </div>
                </div>
                <div>
                    <div v-if="fileList.length>0" class="file_content">
                        <div class="item" v-for="(item, index) in fileList" :key="index"  @click="goDetail(item)">
                            <div class="img_box">
                                <img :src="cdnUrl+item.file_image_url" alt  class="img_sty">
                                <img v-if="fileTypeArr.indexOf(item.file_type)>-1" :src="iconUrl[item.file_type]" alt width="20" height="20" class="icon_type">
                                <span class="icon_buy" v-if="item.is_pay==1">付费</span>
                                <span class="download_icon" v-if="item.download_times">
                                    <img src="~assets/images/zhengce/icon-download.png"  class="download_img"/>
                                    {{item.download_times}}
                                </span>
                            </div>
                             <el-tooltip
                                v-if="item.file_name&&item.file_name.length>15"
                                content="Top"
                                placement="top"
                                effect="light"
                                >
                                <span slot="content" v-html="transfer(item.file_name)"></span>
                                <span class="title" v-html="transfer(item.file_name)"></span>
                            </el-tooltip>
                            <span :class="['title']" v-else v-html="transfer(item.file_name)"></span>
                        </div>
                    </div>
                    <div v-else class="no_data">
                        <img src="~assets/images/zhengce/tongzhi_img_nodata@2x.png" />
                        {{$t('txt.noContentTxt')}}
                    </div>
                </div>
            </div>
            <div class="right-box">
                <div>
                    <right-side :typeId="3"></right-side>
                </div>
            </div>
        </div>
         <!-- 分页 -->
        <div class="page_box" v-if="fileList.length!= 0">
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
import {  downloadFile, esPageFile} from '@/api/announcement'
import RightSide from '@/components/policy/rightSide'
import policyData from '@/pages/index/policy/policy_data'
export default {
    props:['searchMark','content'],
    head () {
        return {
            title:this.title,
        }
    },
    components: {
        RightSide
    },
    data(){
        return{
            cdnUrl: process.env.CDN_BASE_URL,
            title:'卧涛-专注企业服务',
            announceList:[],
            currentPage:1,
            pagesize: 20,
            total:0,
            collectImg: require("~/assets/images/zhengce/icon_star.png"),
            downloadImg: require("~/assets/images/zhengce/icon_download.png"),
            fileList: [],
            iconUrl: policyData.iconUrl,
            fileTypeArr: policyData.fileTypeArr,
            searchForm:{
                content:''
            },
            most: policyData.most,
            sort: 'latest'
        }
    },
    created(){
        
    },
    methods:{
        transfer(str){
            return str.replaceAll('font-size:17px','font-size:14px')
        },
        chooseItem(item){
            this.sort = item.type
            this.getAllList()
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.getList();
        },
        handleSizeChange(){

        },
        downLoad(url,name){
            downloadFile(url).then(res=>{
                let blob = new Blob([res.data]);
                let objectUrl = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = objectUrl;
                a.download = name;
                a.click(); 
            })
        },
        getList(){
            let param = {
                pageNo: this.currentPage,
                pageSize: this.pagesize,
                keywords: this.searchForm.content,
                sort: this.sort
            }
            esPageFile(param).then(res=>{
                if(res.data.code == 0){
                  this.fileList = res.data.data.data.fileList;
                  this.total = res.data.data.data.total;
                }
            }).catch(error =>{
                console.log(error)
            })
        },
        getAllList(){
            this.currentPage = 1
            this.getList()
        },
        // 跳转文档详情
        goDetail(item){
            window.open("/policy/files/"+item.id)
        }
    },
    watch:{
        'searchForm.content'(val){
           if(val){
                this.sort = 'hottest'
           }else{
                this.sort = 'latest'
                this.getAllList()
           }
        },
    },
    mounted(){
        this.getAllList()
    },
}
</script>

<style lang="stylus" scoped>
@import './filesDownload.styl';
</style>