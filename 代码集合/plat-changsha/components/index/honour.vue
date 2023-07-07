<template>
    <div class="flex honour">
        <!-- 荣誉资质 -->
        <div class="honour-left">
            <div class="flex honour-top">
                <p class="honour-top-title">荣誉资质</p>
                <div>
                   <img @click="changeImg(0)" class="honour-icon" src="@/assets/images/index/left_jiantou.png" alt="左箭头">
                   <img @click="changeImg(1)" class="honour-icon" src="@/assets/images/index/right_jiantou.png"  alt="右箭头">                    
                </div>
            </div>
            <div class="flex carousel">
                <div v-for="item in 4" :key="item">
                    <img class="carousel-img" :src="require('@/assets/images/index/pic_0'+(item+count)+'.png')" alt="轮播图">
                </div>
            </div>
        </div>
        <!-- 卧涛新闻 -->
        <div class="honour-left" style="border:0">
            <div class="flex honour-top">
                <p class="honour-top-title">卧涛新闻</p>
                <span style="margin-right:10px" @click="toAboutWT()">
                    <span class="com_color">更多</span>
                    <span class="right_link"></span>
                </span>
            </div>
            <div style="margin-top:14px">
                <div @click="toAboutWT(item.id)" v-for="(item,index) in newsList" :key="index" class="flex news">
                    <p class="text-flow  news-title">{{item.title}}</p>
                    <p style="opacity:.8">{{item.createTime.substr(0,10)}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getRightContent} from "@/api/aboutWT.js";

export default {
    data(){
        return{
            count:0,
            newsList:[]
        }
    },
    methods:{
        changeImg(val){//0-左箭头；1-右箭头
            if(val==1){
                if(this.count<4) this.count+=4;
            }else{
                if(this.count>0)  this.count-=4;
            }
        },
        getIndexData(){
            let params = {
                programId:7,
                current: 1,
                size:7
            };
            getRightContent(params).then(res=>{
                this.newsList=res.data.records;
            })
        },
        toAboutWT(id){
            if(id){
                window.open("/aboutWT?id=7"+"&detailId="+id,);
            }else{
                this.$router.push({
                    path:"/aboutWT",
                    query:{
                        id:7,
                        type:1,
                    }
                })
            }        
        },
    },
    mounted(){
        this.getIndexData()
    }
}
</script>

<style scoped>
.honour{
    width:100%;
    height:440px;
    background:#fff;
    margin-top:20px;
    border-radius:10px;
    align-items: flex-start;
}
.honour-left{   
    width:50%;
    padding:12px;
    border-right:0.5px solid rgba(205, 205, 205, .5)
}
.honour-top{
    border-bottom:0.5px solid rgba(205, 205, 205,.5);
    
}
.honour-icon{
    width:28px;
    cursor: pointer;
}
.honour-icon:hover{
    transform: scale(1.1);
}
.honour-top-title{
    font-size:28px;
    font-weight:bold;
    color:#333;
    border-bottom:3px solid #2482FE;
    width:122px;
    text-align: center;
    padding-bottom:8px;
}
.carousel{
    width:100%;
    padding:18px 8px 0;
    height:366px;
    flex-wrap: wrap;
}
.carousel-img{
    width:258px;
    height: 156px;
    margin-bottom:14px
}
.honour-top>span{
    color:#0D72C1;
    font-size:14px;
    opacity: .6;
    cursor: pointer;
}
.news{
    border-bottom:0.5px dashed rgba(112, 112, 112, .5);
    padding:14px 8px 12px;
    font-size: 14px;
    color:rgba(112, 112, 112);
    cursor: pointer;
}
.news-title{
    width:400px;
    font-size:16px;
    color:#262323;
}
.right_link{
    display: inline-block;
    width: 10px;
    height: 10px;
    border-top: 1px solid #36A6FE;
    border-right: 1px solid #36A6FE;
    opacity: 0.6;
    transform: rotate(45deg);
    cursor: pointer;
}
.com_color{
    color: #36A6FE;
    cursor: pointer;
    font-size: 16px;
}
</style>