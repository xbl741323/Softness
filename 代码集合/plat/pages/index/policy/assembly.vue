<template>
  <div class="frame">
        <div class="banner_img" v-if="searchMark !==0">
            <banner :typeId="1"></banner>
        </div>
        <div class="search_box" v-if="searchMark !==0">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ name: 'index' }">{{$t('txt.home')}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name:'index-policy-announcement'}">{{$t('txt.policySquare')}}</el-breadcrumb-item>
                <el-breadcrumb-item >{{$t('txt.policyAssembly')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="line" v-if="searchMark !==0"></div>
        <common :typeId=1 :prompt='promptValue' @title="getTitle" :searchMark="searchMark" :content="this.content" />
  </div>
</template>

<script>
import Common from '@/components/policy/commonList'
import Banner from '@/components/policy/banner'
export default {
    props:['searchMark','content'],
    components:{
        Common,
        Banner
    },
    head () {
        return {
        title:'科技项目政策汇编_政策解读-卧涛网',
            meta: [
                { name: 'keywords', content: '补贴政策、政策解读、政策汇编' },
                { hid: 'description', name: 'description', content: '各类项目政策解读、汇编、分析，助力企业掌握相关领域的知识信息，制定合适的项目申报战略，不懂项目申报就找卧涛网。' }
            ]
        }
    },
    data(){
        return{
            title:'',
            promptValue:'搜索政策汇编'
        }
    },
    methods:{
        getTitle(val){
            this.title = val;
        }
    }
}
</script>

<style lang="stylus" scoped>
.frame{
    width:100%;
    min-width:1200px;
    background:#F1F1F1;
    font-family:Microsoft YaHei UI;
    .banner_img{
        height:440px;
    }
    .title{
        font-size:42px;
        color:#FFF;
        margin-left:360px;
        padding-top:80px;
        letter-spacing:5px;
    }
    .content{
        font-size:16px;
        color:#FFF;
        margin-left:360px;
        padding-top:20px;
        letter-spacing:3px;
    }
    .search_box{
        width:1200px;
        margin:20px auto;
        font-size:14px;
    }
}
</style>